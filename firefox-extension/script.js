console.log('Jira volatility loaded! 🐧')

// Seems like Firefox extensions don't support classes?
// So let's kick it old school
const volatilityHelper = {
    init(rows) {
        // We only want to use the last 3 sprints
        this.recentSprints = rows.slice(-3)
        return this
    },

    letsGetUpAndRockAndRoll() {
        this.addTeamStrengthFields()
        this.calculateVolatility()
    },

    calculateVolatility() {
        // Grab the completed values for each sprint and turn them into numbers
        const velocities = this.recentSprints
            .map(row => Number(row.childNodes[2].innerText))
        console.log(velocities)

        // Normalize the velocities based on team strength
        const teamStrengths = Array.from(document.querySelectorAll('.teamStrengthField'))
            .map(input => Number(input.value) / 100)
        console.log('team strengths', teamStrengths)
        this.normalizedVelocities = velocities
            .map((velocity, index) => velocity * 1/teamStrengths[index])
        console.log('normalized velocities', this.normalizedVelocities)

        this.total = this.normalizedVelocities.reduce((total, next) => total + next, 0)
        this.mean = this.total / this.normalizedVelocities.length

        // Calculate the standard deviation and volatility
        const std = Math.sqrt(this.normalizedVelocities
            .map(value => { const diff = value - this.mean; return diff * diff })
            .reduce((total, next) => total + next, 0))
        this.volatility = std / this.mean * 100

        this.addVolatilityMessages()
    },

    addVolatilityMessages() {
        // Tweak the existing style so our new div will layout nicely next to the table
        document.querySelector('#ghx-chart-data').style.display = 'flex'

        // Create our new space and its contents and style
        const newDiv = document.createElement('div')
        newDiv.id = 'volatilityHelper'
        newDiv.style.padding = '10px'
        newDiv.style.maxWidth = '600px'
        newDiv.innerHTML = this.formMessage()

        // Add our messaging to the page
        const sprintTable = document.querySelector('table.aui')
        sprintTable.parentNode.appendChild(newDiv)
    },

    formMessage() {
        return `
            With a <strong>normalized total of ${this.total.toFixed(0)} points</strong> based on team strength,<br/>
            in the last ${this.normalizedVelocities.length} sprints we had a <strong>running velocity of ${this.mean.toFixed(0)}</strong><br/>
            and a <strong>volatility of <span style="color:${this.colorForVolatility()};">${this.volatility.toFixed(0)}%</span></strong><br/><br/>

            <span style="font-size: 12px;">
                <strong>Team strength</strong> is a percentage of your team's capacity that was utilized for a sprint. For example, if you have three
                engineers, but one is out for 3 days in a 2-week sprint, your team strength would be 27 out of 30 dev days, so 90%.<br/><br/>
                <strong>Normalized total points</strong> is the sum of points for the last three sprints after taking team strength into account,
                where weeks with a lower strength are given some credit that more would have been accomplished with a full team.<br/><br/>
                <strong>Velocity</strong> is the number of points completed in a given sprint. <strong>Running velocity</strong> is the average
                velocity over the last 3 sprints. We don't want to go back further than that, because as the team evolves older data is less likely 
                to help forecast new outcomes.<br/><br/>
                <strong>Volatility</strong> is a measure of how much velocity changes sprint to sprint. A <strong>low volatility (<20%)</strong>
                indicates a stable velocity and makes forecasting more predictable. A <strong>high volatility (>50%)</strong> means we have lower
                confidence in our forecasting, as we may get much more or less work done in a given sprint than average.
            </span>
        `
    },

    colorForVolatility() {
        if(this.volatility <= 20) {
            return 'green'
        } else if(this.volatility <= 50) {
            return '#808000'
        } else if(this.volatility <= 75) {
            return 'orange'
        } else {
            return 'red'
        }
    },

    addTeamStrengthFields() {
        const thead = document.querySelector('table.aui thead tr')
        const th = document.createElement('th')
        th.innerText = 'Team Strength'
        thead.appendChild(th)

        this.recentSprints.forEach(row => {
            const input = document.createElement('input')
            input.addEventListener('input', () => this.update())
            input.className = 'teamStrengthField'
            input.value = '100'
            input.style.width = '50px'
            const td = document.createElement('td')
            td.appendChild(input)
            row.appendChild(td)
        })
    },

    update() {
        document.getElementById('volatilityHelper').remove()
        this.calculateVolatility()
    }
}

// Jira loads like it's paid hourly so we have to wait a while
// for the data we're interested in to show up
function waitForJira() {
    let interval

    function stopLoop() {
        clearInterval(interval)
    }

    function startLoop() {
        interval = setInterval(() => {
            const rows = Array.from(document.querySelectorAll('.aui tr'))
            if(rows.length) {
                stopLoop()
                volatilityHelper.init(rows).letsGetUpAndRockAndRoll()
            }
        }, 200)
    }
    startLoop()
}
waitForJira()
