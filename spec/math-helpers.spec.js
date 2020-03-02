const { RecentCompletedIterations, totalPointsFromIssues, totalPointsFromIterations, platformVolatility } = require('../firefox-extension/math-helpers.js')
const { ANDROID, APPLE, WEB, TE } = require('../firefox-extension/constants.js')

describe('RecentCompletedIterations', () => {
    describe('velocity', () => {
        it('finds an average points for each platform', () => {
            const iterations = [
                {[ANDROID]: 15, [APPLE]: 7},
                {[ANDROID]: 5, [APPLE]: 0},
                {[ANDROID]: 7, [APPLE]: 11},
                {[ANDROID]: 13, [APPLE]: 8},
            ]
            const recentIterations = new RecentCompletedIterations(iterations)

            expect(recentIterations.velocity(ANDROID)).toEqual(10)
            expect(recentIterations.velocity(APPLE)).toEqual(6.5)
        })
    })

    describe('totalPointsFromIssues', () => {
        it('sums up all issue points, counting them once per platform', () => {
            const issues = [
                {points: 2, platforms: [ANDROID]},
                {points: 5, platforms: [ANDROID, APPLE]},
                {points: 3, platforms: [APPLE]},
                {points: 8, platforms: [ANDROID, APPLE]},
            ]

            expect(totalPointsFromIssues(issues)).toEqual(31)
        })
    })

    describe('totalPointsFromIterations', () => {
        it('sums up all issue points, counting them once per platform', () => {
            const iterations = [
                {[ANDROID]: 5, [APPLE]: 2, [WEB]: 7, [TE]: 1},
                {[ANDROID]: 3, [APPLE]: 5, [WEB]: 4, [TE]: 0},
                {[ANDROID]: 2, [APPLE]: 3, [WEB]: 2, [TE]: 1},
                {[ANDROID]: 8, [APPLE]: 3, [WEB]: 2, [TE]: 2},
            ]

            expect(totalPointsFromIterations(iterations)).toEqual(50)
        })
    })

    describe('platform volatility', () => {
        it('calculates the variance in velocity over the given iterations', () => {
            const iterations = [
                {[ANDROID]: 22, [APPLE]: 4, [WEB]: 5, [TE]: 100},
                {[ANDROID]: 13, [APPLE]: 5, [WEB]: 5, [TE]: 99},
                {[ANDROID]: 17, [APPLE]: 4, [WEB]: 5, [TE]: 100},
                {[ANDROID]: 19, [APPLE]: 5, [WEB]: 5, [TE]: 101},
            ]

            expect(platformVolatility(iterations, WEB)).toEqual(0.0)
            expect(platformVolatility(iterations, TE)).toEqual(1.4)
            expect(platformVolatility(iterations, ANDROID)).toEqual(36.9)
            expect(platformVolatility(iterations, APPLE)).toEqual(22.2)
        })
    })
})
