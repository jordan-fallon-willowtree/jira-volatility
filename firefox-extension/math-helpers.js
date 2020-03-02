const { ANDROID, APPLE, WEB, TE } = require('./constants.js')

function platformVelocity(iterations, platform) {
    const totalPoints = iterations
        .reduce((total, iteration) => total + iteration[platform], 0)
    return Math.floor(totalPoints / iterations.length * 10) / 10
}

function totalPointsFromIssues(issues) {
    return issues.reduce((total, issue) => total + issue.points * issue.platforms.length, 0)
}

function totalPointsFromIterations(iterations) {
    return iterations.reduce((total, iteration) => total + iteration[TE] + iteration[ANDROID] + iteration[APPLE] + iteration[WEB], 0)
}

function platformVolatility(iterations, platform) {
    const velocity = platformVelocity(iterations, platform)

    const std = Math.sqrt(iterations
        .map(iteration => Math.pow(iteration[platform] - velocity, 2))
        .reduce((total, next) => total + next, 0))
    return Math.floor(std / velocity * 1000) / 10
}

class RecentCompletedIterations {
    constructor(iterations) {
        this.iterations = iterations
    }

    get iterationCount() { return this.iterations.length }

    velocity(platform) {
        const totalPoints = this.iterations
            .reduce((total, iteration) => total + iteration[platform], 0)
        return Math.floor(totalPoints / this.iterationCount * 10) / 10
    }
}

module.exports = { totalPointsFromIssues, totalPointsFromIterations, platformVolatility, RecentCompletedIterations }
