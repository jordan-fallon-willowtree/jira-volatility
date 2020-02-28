const { ANDROID, APPLE, WEB, TE } = require('./constants.js')

function platformVelocity(velocityByIteration, platform) {
    const totalPoints = velocityByIteration
        .reduce((total, iteration) => total + iteration[platform], 0)
    return Math.floor(totalPoints / velocityByIteration.length * 10) / 10
}

function totalPointsFromIssues(issues) {
    return issues.reduce((total, issue) => total + issue.points * issue.platforms.length, 0)
}

function totalPointsFromIterations(iterations) {
    return iterations.reduce((total, iteration) => total + iteration[TE] + iteration[ANDROID] + iteration[APPLE] + iteration[WEB], 0)
}

module.exports = { platformVelocity, totalPointsFromIssues, totalPointsFromIterations }
