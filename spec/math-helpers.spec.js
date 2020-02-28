const { platformVelocity, totalPointsFromIssues, totalPointsFromIterations } = require('../firefox-extension/math-helpers.js')
const { ANDROID, APPLE, WEB, TE } = require('../firefox-extension/constants.js')

describe('math helpers', () => {
    describe('platformVelocity', () => {
        it('finds an average points for each platform', () => {
            const velocityByIteration = [
                {[ANDROID]: 15, [APPLE]: 7},
                {[ANDROID]: 5, [APPLE]: 0},
                {[ANDROID]: 7, [APPLE]: 11},
                {[ANDROID]: 13, [APPLE]: 8},
            ]

            expect(platformVelocity(velocityByIteration, ANDROID)).toEqual(10)
            expect(platformVelocity(velocityByIteration, APPLE)).toEqual(6.5)
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
})
