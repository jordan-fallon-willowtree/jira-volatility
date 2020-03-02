const { ANDROID, APPLE, WEB, TE } = require('./constants.js')

function totalPointsFromIssues(issues) {
    return issues.reduce((total, issue) => total + issue.points * issue.platforms.length, 0)
}

function totalPointsFromIterations(iterations) {
    return iterations.reduce((total, iteration) => total + iteration[TE] + iteration[ANDROID] + iteration[APPLE] + iteration[WEB], 0)
}

function std(numbers) {
    const avg = numbers.reduce(sum, 0) / numbers.length
    const stdSquared = numbers
        .map(num => Math.pow(num - avg, 2))
        .reduce(sum, 0) / numbers.length
    return Math.round(Math.sqrt(stdSquared) * 100) / 100
}

function sum(total, next) {
    return total + next
}

class AgileCalculator {
    constructor(iterations) {
        this.iterations = iterations
    }

    get iterationCount() { return this.iterations.length }

    velocity(platform) {
        const totalPoints = this.iterations
            .reduce((total, iteration) => total + iteration[platform], 0)
        return Math.floor(totalPoints / this.iterationCount * 10) / 10
    }

    volatility(platform) {
        const points = this.iterations.map(iteration => iteration[platform])
        return Math.floor(std(points) / this.velocity(platform) * 1000) / 10
    }
}

module.exports = { std, totalPointsFromIssues, totalPointsFromIterations, AgileCalculator }
