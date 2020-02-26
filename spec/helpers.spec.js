const { isApple, isAndroid, isWeb, filterOutInvalidIssues } = require("../firefox-extension/helpers.js")

describe('helpers', () => {
    describe('isApple', () => {
        it('returns true if a component is named iOS', () => {
            const issue = { fields: { components: [{ name: 'iOS' }] }}
            expect(isApple(issue)).toBeTrue()
        })

        it('returns true if a component is named tvOS', () => {
            const issue = { fields: { components: [{ name: 'Web' }, { name: 'tvOS' }] }}
            expect(isApple(issue)).toBeTrue()
        })

        it('returns false if there is no iOS or tvOS component', () => {
            const issue = { fields: { components: [{ name: 'Android' }] }}
            expect(isApple(issue)).toBeFalse()
        })

        it('returns false if there are no components', () => {
            const issue = { fields: { components: [] }}
            expect(isApple(issue)).toBeFalse()
        })
    })

    describe('isAndroid', () => {
        it('returns true if a component is named Android', () => {
            const issue = { fields: { components: [{ name: 'Android' }] }}
            expect(isAndroid(issue)).toBeTrue()
        })

        it('returns true if a component is named Android TV', () => {
            const issue = { fields: { components: [{ name: 'Web' }, { name: 'Android TV' }] }}
            expect(isAndroid(issue)).toBeTrue()
        })

        it('returns true if a component is named Amazon Fire TV', () => {
            const issue = { fields: { components: [{ name: 'Amazon Fire TV' }, { name: 'QA' }] }}
            expect(isAndroid(issue)).toBeTrue()
        })

        it('returns false if there is no Android component', () => {
            const issue = { fields: { components: [{ name: 'Web' }, { name: 'QA' }] }}
            expect(isAndroid(issue)).toBeFalse()
        })

        it('returns false if there are no components', () => {
            const issue = { fields: { components: [] }}
            expect(isAndroid(issue)).toBeFalse()
        })
    })

    describe('isWeb', () => {
        it('returns true if a component is named Web', () => {
            const issue = { fields: { components: [{ name: 'Web' }] }}
            expect(isWeb(issue)).toBeTrue()
        })

        it('returns false if there is no Web component', () => {
            const issue = { fields: { components: [{ name: 'Android' }] }}
            expect(isWeb(issue)).toBeFalse()
        })

        it('returns false if there are no components', () => {
            const issue = { fields: { components: [] }}
            expect(isWeb(issue)).toBeFalse()
        })
    })

    describe('filterOutInvalidIssues', () => {
        it('filters out issues that are not Done', () => {
            const inProgressIssue = { fields: { status: { name: 'In Progress' }, customfield_10004: 1, resolutiondate: '2019-01-01T14:25:20.000Z'  } }
            const doneIssue = { fields: { status: { name: 'Done' }, customfield_10004: 1, resolutiondate: '2019-01-01T14:25:20.000Z'  } }
            const inReviewIssue = { fields: { status: { name: 'In Review' }, customfield_10004: 1, resolutiondate: '2019-01-01T14:25:20.000Z'  } }

            const validIssues = filterOutInvalidIssues([inProgressIssue, doneIssue, inReviewIssue])
            expect(validIssues.length).toBe(1)
            expect(validIssues[0]).toBe(doneIssue)
        })

        it('filters out issues that are not pointed', () => {
            const pointedIssue = { fields: { status: { name: 'Done' }, customfield_10004: 3, resolutiondate: '2019-01-01T14:25:20.000Z'  } }
            const nullPointsIssue = { fields: { status: { name: 'Done' }, customfield_10004: null, resolutiondate: '2019-01-01T14:25:20.000Z'  } }
            const noPointsFieldIssue = { fields: { status: { name: 'Done' }, resolutiondate: '2019-01-01T14:25:20.000Z'  } }
            const zeroPointsIssue = { fields: { status: { name: 'Done' }, customfield_10004: 0, resolutiondate: '2019-01-01T14:25:20.000Z' } }

            const validIssues = filterOutInvalidIssues([pointedIssue, nullPointsIssue, noPointsFieldIssue, zeroPointsIssue])
            expect(validIssues.length).toBe(1)
            expect(validIssues[0]).toBe(pointedIssue)
        })

        it('filters out issues that do not have a resolution date', () => {
            const nullDateIssue = { fields: { status: { name: 'Done' }, customfield_10004: 3, resolutiondate: null } }
            const noDateIssue = { fields: { status: { name: 'Done' }, customfield_10004: 3 } }
            const validIssue = { fields: { status: { name: 'Done' }, customfield_10004: 3, resolutiondate: '2019-01-01T14:25:20.000Z' } }

            const validIssues = filterOutInvalidIssues([nullDateIssue, noDateIssue, validIssue])
            expect(validIssues.length).toBe(1)
            expect(validIssues[0]).toBe(validIssue)
        })
    })
})
