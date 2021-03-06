const { AgileCalculator } = require('../firefox-extension/agile-calculator.js')
const { ANDROID, APPLE, WEB, TE } = require('../firefox-extension/constants.js')

describe('AgileCalculator', () => {
    describe('velocity', () => {
        it('finds an average points for each platform', () => {
            const iterations = [
                {[ANDROID]: 15, [APPLE]: 7, teamStrength: 1},
                {[ANDROID]: 5, [APPLE]: 0, teamStrength: 1},
                {[ANDROID]: 7, [APPLE]: 11, teamStrength: 1},
                {[ANDROID]: 13, [APPLE]: 8, teamStrength: 1},
            ]
            const calculator = new AgileCalculator(iterations)

            expect(calculator.velocity(ANDROID)).toEqual(10)
            expect(calculator.velocity(APPLE)).toEqual(6.5)
        })
    })

    describe('velocity with team strength', () => {
        it('considers team strength when calculating velocity', () => {
            const iterations = [
                {[ANDROID]: 5, [WEB]: 12, teamStrength: .5},
                {[ANDROID]: 10, [WEB]: 8, teamStrength: 1},
            ]

            const calculator = new AgileCalculator(iterations)
            expect(calculator.velocity(WEB)).toEqual(16)
            expect(calculator.velocity(ANDROID)).toEqual(10)
        })
    })

    describe('volatility', () => {
        it('calculates the variance in velocity over the given iterations', () => {
            const iterations = [
                {[ANDROID]: 22, [APPLE]: 4, [WEB]: 5, [TE]: 100, teamStrength: 1},
                {[ANDROID]: 13, [APPLE]: 5, [WEB]: 5, [TE]: 99, teamStrength: 1},
                {[ANDROID]: 17, [APPLE]: 4, [WEB]: 5, [TE]: 100, teamStrength: 1},
                {[ANDROID]: 19, [APPLE]: 5, [WEB]: 5, [TE]: 101, teamStrength: 1},
            ]
            const recentIterations = new AgileCalculator(iterations)

            expect(recentIterations.volatility(WEB)).toEqual(0.0)
            expect(recentIterations.volatility(TE)).toEqual(0.7)
            expect(recentIterations.volatility(ANDROID)).toEqual(18.4)
            expect(recentIterations.volatility(APPLE)).toEqual(11.1)
        })
    })

    describe('totalPoints', () => {
        it('sums up all issue points, counting them once per platform', () => {
            const iterations = [
                {[ANDROID]: 5, [APPLE]: 2, [WEB]: 7, [TE]: 1, teamStrength: 1},
                {[ANDROID]: 3, [APPLE]: 5, [WEB]: 4, [TE]: 0, teamStrength: 1},
                {[ANDROID]: 2, [APPLE]: 3, [WEB]: 2, [TE]: 1, teamStrength: 1},
                {[ANDROID]: 8, [APPLE]: 3, [WEB]: 2, [TE]: 2, teamStrength: 1},
            ]
            const calculator = new AgileCalculator(iterations)

            expect(calculator.totalPoints()).toEqual(50)
        })
    })
})