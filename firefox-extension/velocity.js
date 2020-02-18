console.log('Jira velocity loaded! 🐧')

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
    if(isApple(issue)) { return 'iOS' }
    else if(isAndroid(issue)) { return 'android' }
    else if(isWeb(issue)) { return 'web' }
    else { return 'qa' }
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
        const initialTotalVelocity = dedupedIssues.reduce((total, issue) => total + issue.points, 0 )

        const firstDate = dedupedIssues[0].done
        const lastDate = dedupedIssues[dedupedIssues.length - 1].done
        const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7
        const numberOfIterations = Math.ceil((lastDate - firstDate) / millisecondsPerWeek)
        // console.log(`number of iterations: ${ numberOfIterations }`)

        const iterations = []
        for(i = 0; i < numberOfIterations; i++) {
            iterations.push({ android: 0, iOS: 0, web: 0, qa: 0, issueIds: [] })
        }

        const velocityByIteration = dedupedIssues
            .reduce((result, issue) => {
                const iterationIndex = ((issue.done - firstDate) / millisecondsPerWeek).toFixed()
                result[iterationIndex][issue.platform] += issue.points
                result[iterationIndex].issueIds.push(issue.id)
                return result
            },
            iterations)
        // console.log(velocityByIteration)

        const decomposedTotalVelocity = velocityByIteration.reduce((total, iteration) => total + iteration.qa + iteration.android + iteration.iOS + iteration.web, 0)
        if(decomposedTotalVelocity === initialTotalVelocity) {
            console.log(`Android running velocity: ${velocityByIteration.reduce((total, iteration) => total + iteration.android, 0) / numberOfIterations}`)
            console.log(`iOS running velocity: ${velocityByIteration.reduce((total, iteration) => total + iteration.iOS, 0) / numberOfIterations}`)
            console.log(`Web running velocity: ${velocityByIteration.reduce((total, iteration) => total + iteration.web, 0) / numberOfIterations}`)
            console.log(`QA running velocity: ${velocityByIteration.reduce((total, iteration) => total + iteration.qa, 0) / numberOfIterations}`)
        } else {
            console.log(`Something went wrong! Our initial total velocity of ${initialTotalVelocity} wasn't reflected in the final calculation. Instead, we got ${decomposedTotalVelocity}`)
        }
    })
}
figureOutVelocity()


// const velocityHelper = {
//     init(rows) {
//         this.issues = rows
//         return this
//     },

//     letsFuckingGo() {
//         const pointsByPlatform = this.issues
//             .reduce((result, next) => {
//                 const platforms = next.querySelector('.ghx-plan-extra-fields .ghx-extra-field:last-child').innerText
//                 const estimate = next.querySelector('.ghx-estimate .ghx-statistic-badge').innerText

//                 if(estimate.trim().length) {
//                     if(platforms.includes("iOS") || platforms.includes("tvOS")) {
//                         result.iOS += Number(estimate)
//                     } else if(platforms.includes("Android") || platforms.includes("Amazon")) {
//                         result.android += Number(estimate)
//                     } else if(platforms.includes("Web")) {
//                         result.web += Number(estimate)
//                     }
//                 }

//                 return result
//             }, {android: 0, iOS: 0, web: 0})
        
//         const badgeContainer = document.querySelector('.ghx-sprint-group .ghx-badge-group.ghx-right')
//         badgeContainer.prepend(
//             this.makeBadge(`android: ${pointsByPlatform.android}`),
//             this.makeBadge(`ios: ${pointsByPlatform.iOS}`),
//             this.makeBadge(`web: ${pointsByPlatform.web}`),
//         )
//     },

//     makeBadge(str) {
//         const badge = document.createElement('aui-badge')
//         badge.innerText = str
//         return badge
//     }
// }
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
