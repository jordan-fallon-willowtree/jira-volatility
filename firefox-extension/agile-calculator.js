const { std } = require('./math-helpers.js')
const { ANDROID, APPLE, WEB, TE } = require('./constants.js')

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


    totalPoints() {
        return this.iterations
            .reduce((total, iteration) => total + iteration[TE] + iteration[ANDROID] + iteration[APPLE] + iteration[WEB], 0)
    }
}

module.exports = { AgileCalculator }
