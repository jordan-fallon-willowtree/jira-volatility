const { std, totalPointsFromIssues, totalPointsFromIterations } = require('../firefox-extension/math-helpers.js')
const { ANDROID, APPLE, WEB, TE } = require('../firefox-extension/constants.js')

describe('math helpers', () => {
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

    describe('std', () => {
        it('returns the standard deviation of the list of numbers', () => {
            expect(std([14, 15, 16, 14])).toEqual(0.83)
            expect(std([22, 13, 17, 19])).toEqual(3.27)
        })
    })
})
