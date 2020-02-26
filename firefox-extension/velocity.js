const { isApple, isAndroid, isWeb } = require("helpers.js")

console.log('Jira velocity loaded! 🐧')

const pointField = 'customfield_10004'
const sprintIds = [
    // 1405, // 28
    1406, // 29
    1414, // 30
    1422, // 31
    1424, // 32
]

const APPLE = 'apple'
const ANDROID = 'android'
const WEB = 'web'
const QA = 'qa'

const baseURL = 'https://jira.willowtreeapps.com/rest'
const apiURL = baseURL + '/api/latest'
const agileURL = baseURL + '/agile/1.0'

function getSprints() {
    fetch(`${agileURL}/board/309/sprint?startAt=100`)
        .then(res => res.json())
        .then(data => console.log(data.values.map(sprint => ({id: sprint.id, name: sprint.name}))))
}
// getSprints()

const issues = []
function breakdownSprint(sprintId) {
    return fetch(`${agileURL}/board/309/sprint/${sprintId}/issue`)
        .then(res => res.json())
        .then(data => {
            const validIssues = data.issues
                .filter(issue => issue.fields.status.name == 'Done')
                .filter(issue => issue.fields.customfield_10004)
                .filter(issue => issue.fields.resolutiondate)

            issues.push(...validIssues)
        })
}

function getPlatform(issue) {
    if(isApple(issue)) { return APPLE }
    else if(isAndroid(issue)) { return ANDROID }
    else if(isWeb(issue)) { return WEB }
    else { return QA }
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
            <span style="color: green;">Android - ${platformVelocity(velocityByIteration, ANDROID)}</span> |
            <span style="color: red;">Apple - ${platformVelocity(velocityByIteration, APPLE)}</span> |
            <span style="color: blue;">Web - ${platformVelocity(velocityByIteration, WEB)}</span> |
            <span style="color: orange;">QA - ${platformVelocity(velocityByIteration, QA)}</span>
        </div>
    `

    const pageContainer = document.getElementById('gh')
    pageContainer.prepend(newDiv)
}

function figureOutVelocity() {
    // getSprints()
    const promises = []
    sprintIds.forEach(sprintId => {
        promises.push(breakdownSprint(sprintId))
    })
    Promise.all(promises).then(() => {
        const dedupedIssues = issues
            .filter((issue, index, self) => self.findIndex(i => i.id === issue.id) === index)
            .map(issue => ({
                    id: issue.id,
                    points: issue.fields.customfield_10004, 
                    done: new Date(issue.fields.resolutiondate),
                    platform: getPlatform(issue)
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
        const initialTotalVelocity = issuesInChosenSprints.reduce((total, issue) => total + issue.points, 0 )

        const iterations = []
        for(i = 0; i < numberOfIterations; i++) {
            iterations.push({ [ANDROID]: 0, [APPLE]: 0, [WEB]: 0, [QA]: 0, issueIds: [] })
        }

        const velocityByIteration = issuesInChosenSprints
            .reduce((result, issue) => {
                const iterationIndex = Math.floor((issue.done - firstDate) / millisecondsPerWeek)
                result[iterationIndex][issue.platform] += issue.points
                result[iterationIndex].issueIds.push(issue.id)
                return result
            },
            iterations)
        // console.log(velocityByIteration)

        const decomposedTotalVelocity = velocityByIteration.reduce((total, iteration) => total + iteration[QA] + iteration[ANDROID] + iteration[APPLE] + iteration[WEB], 0)
        if(decomposedTotalVelocity === initialTotalVelocity) {
            console.log(`Android running velocity: ${platformVelocity(velocityByIteration, ANDROID)}`)
            console.log(`Apple running velocity: ${platformVelocity(velocityByIteration, APPLE)}`)
            console.log(`Web running velocity: ${platformVelocity(velocityByIteration, WEB)}`)
            console.log(`QA running velocity: ${platformVelocity(velocityByIteration, QA)}`)

            addToDOM(velocityByIteration)
        } else {
            console.log(`Something went wrong! Our initial total velocity of ${initialTotalVelocity} wasn't reflected in the final calculation. Instead, we got ${decomposedTotalVelocity}`)
        }
    })
}
