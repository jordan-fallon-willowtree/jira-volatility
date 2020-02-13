console.log('Jira velocity loaded! 🐧')

const velocityHelper = {
    init(rows) {
        this.issues = rows
        return this
    },

    letsFuckingGo() {
        const pointsByPlatform = this.issues
            .reduce((result, next) => {
                const platforms = next.querySelector('.ghx-plan-extra-fields .ghx-extra-field:last-child').innerText
                const estimate = next.querySelector('.ghx-estimate .ghx-statistic-badge').innerText

                if(estimate.trim().length) {
                    if(platforms.includes("iOS") || platforms.includes("tvOS")) {
                        result.iOS += Number(estimate)
                    } else if(platforms.includes("Android") || platforms.includes("Amazon")) {
                        result.android += Number(estimate)
                    } else if(platforms.includes("Web")) {
                        result.web += Number(estimate)
                    }
                }

                return result
            }, {android: 0, iOS: 0, web: 0})
        
        const badgeContainer = document.querySelector('.ghx-sprint-group .ghx-badge-group.ghx-right')
        badgeContainer.prepend(
            this.makeBadge(`android: ${pointsByPlatform.android}`),
            this.makeBadge(`ios: ${pointsByPlatform.iOS}`),
            this.makeBadge(`web: ${pointsByPlatform.web}`),
        )
    },

    makeBadge(str) {
        const badge = document.createElement('aui-badge')
        badge.innerText = str
        return badge
    }
}

const pointField = 'customfield_10004'
const sprintIds = [
    1405, // 28
    1406, // 29
    1414, // 30
    1422, // 31
]

const baseURL = 'https://jira.willowtreeapps.com/rest'
const apiURL = baseURL + '/api/latest'
const agileURL = baseURL + '/agile/1.0'

function isApple(issue) {
    return containsKeywords(issue, ['iOS', 'tvOS'])
}

function isAndroid(issue) {
    return containsKeywords(issue, ['Android', 'Android TV', 'Amazon Fire TV'])
}

function isWeb(issue) {
    return containsKeywords(issue, ['Web', 'chromecast'])
}

function containsKeywords(issue, keywords) {
    return issue.fields.components.some(com => keywords.includes(com.name))
}

function getSprints() {
    fetch(`${agileURL}/board/309/sprint?startAt=100`)
        .then(res => res.json())
        .then(data => console.log(data.values.map(sprint => ({id: sprint.id, name: sprint.name}))))
}
// getSprints()

function breakdownSprint(sprintId) {
    fetch(`${agileURL}/board/309/sprint/${sprintId}/issue`)
        .then(res => res.json())
        .then(data => {
            console.log(
                data.issues
                    .filter(issue => issue.fields.status.name == 'Done')
                    .filter(issue => issue.fields.customfield_10004)
                    .reduce((obj, issue) => {
                        const points = issue.fields.customfield_10004
                        if(isApple(issue)) {
                            obj.apple += points
                        } else if(isAndroid(issue)) {
                            obj.android += points
                        } else if(isWeb(issue)) {
                            obj.web += points
                        }
                        return obj
                    }, {android: 0, apple: 0, web: 0})
            )
        })
}
sprintIds.forEach(breakdownSprint)

// function waitForJira() {
//     let interval

//     function stopLoop() {
//         clearInterval(interval)
//     }

//     function startLoop() {
//         interval = setInterval(() => {
//             const rows = Array.from(document.querySelectorAll('.ghx-sprint-group [data-sprint-id="1422"] .js-issue'))
//             if(rows.length) {
//                 stopLoop()
//                 velocityHelper.init(rows).letsFuckingGo()
//             }
//         }, 200)
//     }
//     startLoop()
// }
// waitForJira()
