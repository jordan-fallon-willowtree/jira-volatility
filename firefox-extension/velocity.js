const { filterOutInvalidIssues } = require('./helpers.js')
const { issueData, simplifyIssue } = require('./issue-transformers.js')
const { getSprintIssues } = require('./jira-api.js')
const { APPLE, ANDROID, WEB, TE, MILLISECONDS_PER_WEEK } = require('./constants.js')
const { totalPointsFromIssues } = require('./math-helpers.js')
const { AgileCalculator } = require('./agile-calculator.js')

const sprintIds = [
    // 1405, // 28
    // 1406, // 29
    1414, // 30
    1422, // 31
    1424, // 32
    1436, // 33
]

function figureOutVelocity() {
    getValidSortedDedupedIssues(data => {
        const initialTotalVelocity = totalPointsFromIssues(data.issues)
        const iterations = buildIterations(data)
        const calculator = new AgileCalculator(iterations)

        if(calculator.totalPoints() === initialTotalVelocity) {
            console.log(`Android running velocity: ${calculator.velocity(ANDROID)}, and volatility: ${calculator.volatility(ANDROID)}`)
            console.log(`Apple running velocity: ${calculator.velocity(APPLE)}, and volatility: ${calculator.volatility(APPLE)}`)
            console.log(`Web running velocity: ${calculator.velocity(WEB)}, and volatility: ${calculator.volatility(WEB)}`)
            console.log(`TE running velocity: ${calculator.velocity(TE)}, and volatility: ${calculator.volatility(TE)}`)

            addToDOM(calculator)
        } else {
            console.log(`Something went wrong! Our initial total velocity of ${initialTotalVelocity} wasn't reflected in the final calculation. Instead, we got ${decomposedTotalVelocity}`)
        }
    })
}

function getValidSortedDedupedIssues(callback) {
    getIssuesForSprints(issues => {
        const mappedSortedFilteredIssues = filterOutInvalidIssues(issues)
            .map(simplifyIssue)
            .sort((a, b) => a.done > b.done)

        callback(issueData(mappedSortedFilteredIssues))
    })
}

function getIssuesForSprints(callback) {
    return Promise
        .all(sprintIds.map(getSprintIssues))
        .then(data => {
            const flattenedIssues = data.reduce((result, next) => {
                result.push(...next.issues)
                return result
            }, [])
            callback(flattenedIssues)
        })
}

function buildIterations(data) {
    const iterations = []
    for(i = 0; i < data.numberOfFullIterations; i++) {
        iterations.push({ [ANDROID]: 0, [APPLE]: 0, [WEB]: 0, [TE]: 0, issueIds: [] })
    }

    return data.issues
        .reduce((result, issue) => {
            const iterationIndex = Math.floor((issue.done - data.firstDate) / MILLISECONDS_PER_WEEK)
            issue.platforms.forEach(platform => result[iterationIndex][platform] += issue.points)
            result[iterationIndex].issueIds.push(issue.id)
            return result
        },
        iterations)
}

function addToDOM(iterations) {
    const newDiv = document.createElement('div')
    newDiv.id = 'velocity-helper'
    newDiv.innerHTML = `
        <div style="font-size: 18px; font-weight: bold;">
            Velocity <i>(avg points / week for the last 4 sprints)</i>:
            <span style="color: #A4C639;">Android - ${iterations.velocity(ANDROID)}</span> |
            <span style="color: #7D7D7D;">Apple - ${iterations.velocity(APPLE)}</span> |
            <span style="color: #007ACC;">Web - ${iterations.velocity(WEB)}</span> |
            <span style="color: #009800;">TE - ${iterations.velocity(TE)}</span>
        </div>
    `

    const pageContainer = document.getElementById('gh')
    pageContainer.prepend(newDiv)
}

module.exports = { figureOutVelocity }
