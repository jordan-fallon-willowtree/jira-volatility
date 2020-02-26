const { getPlatforms, filterOutInvalidIssues } = require("./helpers.js")
const { getSprintIssues } = require("./jira-api.js")
const { APPLE, ANDROID, WEB, TE } = require('./constants.js')

const sprintIds = [
    // 1405, // 28
    1406, // 29
    1414, // 30
    1422, // 31
    1424, // 32
]

const issues = []
function breakdownSprint(sprintId) {
    return getSprintIssues(sprintId)
        .then(data => filterOutInvalidIssues(data.issues))
}

function getAllValidIssues(callback) {
    return Promise
        .all(sprintIds.map(sprintId => breakdownSprint(sprintId)))
        .then(issues => callback(issues.reduce((result, next) => {
            result.push(...next)
            return result
        }, [])))
}

function platformVelocity(velocityByIteration, platform) {
    const totalPoints = velocityByIteration
        .reduce((total, iteration) => total + iteration[platform], 0)
    return (totalPoints / velocityByIteration.length).toFixed(1)
}

function addToDOM(velocityByIteration) {
    const newDiv = document.createElement('div')
    newDiv.id = 'velocity-helper'
    newDiv.innerHTML = `
        <div style="font-size: 18px; font-weight: bold;">
            Velocity <i>(avg points / week for the last 4 sprints)</i>:
            <span style="color: #A4C639;">Android - ${platformVelocity(velocityByIteration, ANDROID)}</span> |
            <span style="color: #7D7D7D;">Apple - ${platformVelocity(velocityByIteration, APPLE)}</span> |
            <span style="color: #007ACC;">Web - ${platformVelocity(velocityByIteration, WEB)}</span> |
            <span style="color: #009800;">TE - ${platformVelocity(velocityByIteration, TE)}</span>
        </div>
    `

    const pageContainer = document.getElementById('gh')
    pageContainer.prepend(newDiv)
}

function figureOutVelocity() {
    getAllValidIssues(issues => {
        console.log(issues)
        const dedupedIssues = issues
            .filter((issue, index, self) => self.findIndex(i => i.id === issue.id) === index)
            .map(issue => ({
                    id: issue.id,
                    points: issue.fields.customfield_10004, 
                    done: new Date(issue.fields.resolutiondate),
                    platforms: getPlatforms(issue)
                }))
            .sort((a, b) => a.done > b.done)
        // console.log(dedupedIssues)
        const firstDate = dedupedIssues[0].done
        const lastDate = dedupedIssues[dedupedIssues.length - 1].done
        const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7
        const numberOfIterations = Math.floor((lastDate - firstDate) / millisecondsPerWeek)
        // console.log(`number of iterations: ${ numberOfIterations }`)

        const lastDateWeCareAbout = new Date(firstDate)
        lastDateWeCareAbout.setDate(lastDateWeCareAbout.getDate() + numberOfIterations * 7)

        const issuesInChosenSprints = dedupedIssues
            .filter(issue => issue.done < lastDateWeCareAbout)
        const initialTotalVelocity = issuesInChosenSprints.reduce((total, issue) => total + issue.points * issue.platforms.length, 0)

        const iterations = []
        for(i = 0; i < numberOfIterations; i++) {
            iterations.push({ [ANDROID]: 0, [APPLE]: 0, [WEB]: 0, [TE]: 0, issueIds: [] })
        }

        const velocityByIteration = issuesInChosenSprints
            .reduce((result, issue) => {
                const iterationIndex = Math.floor((issue.done - firstDate) / millisecondsPerWeek)
                issue.platforms.forEach(platform => result[iterationIndex][platform] += issue.points)
                result[iterationIndex].issueIds.push(issue.id)
                return result
            },
            iterations)
        // console.log(velocityByIteration)

        const decomposedTotalVelocity = velocityByIteration.reduce((total, iteration) => total + iteration[TE] + iteration[ANDROID] + iteration[APPLE] + iteration[WEB], 0)
        if(decomposedTotalVelocity === initialTotalVelocity) {
            console.log(`Android running velocity: ${platformVelocity(velocityByIteration, ANDROID)}`)
            console.log(`Apple running velocity: ${platformVelocity(velocityByIteration, APPLE)}`)
            console.log(`Web running velocity: ${platformVelocity(velocityByIteration, WEB)}`)
            console.log(`TE running velocity: ${platformVelocity(velocityByIteration, TE)}`)

            addToDOM(velocityByIteration)
        } else {
            console.log(`Something went wrong! Our initial total velocity of ${initialTotalVelocity} wasn't reflected in the final calculation. Instead, we got ${decomposedTotalVelocity}`)
        }
    })
}

module.exports = { figureOutVelocity }