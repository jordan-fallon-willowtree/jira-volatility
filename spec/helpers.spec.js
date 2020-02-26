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
            const inProgressIssue = issueWithStatus('In Progress')
            const doneIssue = issueWithStatus('Done')
            const inReviewIssue = issueWithStatus('In Review')

            const validIssues = filterOutInvalidIssues([inProgressIssue, doneIssue, inReviewIssue])
            expect(validIssues.length).toBe(1)
            expect(validIssues[0]).toBe(doneIssue)
        })

        it('filters out issues that are not pointed', () => {
            const pointedIssue = issueWithPoints(3)
            const nullPointsIssue = issueWithPoints(null)
            const zeroPointsIssue = issueWithPoints(0)

            const validIssues = filterOutInvalidIssues([pointedIssue, nullPointsIssue, zeroPointsIssue])
            expect(validIssues.length).toBe(1)
            expect(validIssues[0]).toBe(pointedIssue)
        })

        it('filters out issues that do not have a resolution date', () => {
            const nullDateIssue = issueWithResolutionDate(null)
            const validIssue = issueWithResolutionDate('2019-05-04T03:02:01.000Z')

            const validIssues = filterOutInvalidIssues([nullDateIssue, validIssue])
            expect(validIssues.length).toBe(1)
            expect(validIssues[0]).toBe(validIssue)
        })
    })

    function issueWithStatus(status) {
        return { fields: { status: { name: status }, customfield_10004: 1, resolutiondate: '2019-01-01T14:25:20.000Z' } }
    }

    function issueWithPoints(points) {
        return { fields: { status: { name: 'Done' }, customfield_10004: points, resolutiondate: '2019-01-01T14:25:20.000Z' } }
    }

    function issueWithResolutionDate(date) {
        return { fields: { status: { name: 'Done' }, customfield_10004: 1, resolutiondate: date } }
    }
})
