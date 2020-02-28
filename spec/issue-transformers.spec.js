const { APPLE, ANDROID } = require('../firefox-extension/constants.js')
const { simplifyIssue, issueData } = require('../firefox-extension/issue-transformers.js')
const { issueWithId, issueWithResolutionDate } = require('./support/spec-helpers.js')

describe('Issue transformers', () => {
    describe('simplifyIssue', () => {
        it('builds a simple object out of a larger issue', () => {
            const dateString = '2019-05-11T13:44:53.022Z'
            const issue = {
                id: 'test-id-123',
                fields: {
                    customfield_10004: 3,
                    resolutiondate: dateString,
                    components: [
                        { name: 'Android' },
                        { name: 'iOS' }
                    ]
                }
            }

            const result = simplifyIssue(issue)

            expect(result.id).toBe('test-id-123')
            expect(result.points).toBe(3)
            expect(result.done).toEqual(new Date(dateString))
            expect(result.platforms).toEqual([APPLE, ANDROID])
        })
    })

    describe('issueData', () => {
        it('returns the list of issues', () => {
            const issues = [{id: 5}, {id: 7}]
            const data = issueData(issues)
            expect(data.issues).toBe(issues)
        })

        it('returns the done date from the first issue, as they are sorted by date', () => {
            const jan1 = new Date('2019-01-01T12:34:56.000Z')
            const jan5 = new Date('2019-01-05T12:34:56.000Z')
            const jan13 = new Date('2019-01-13T12:34:56.000Z')

            const issues = [{done: jan1}, {done: jan5}, {done: jan13}]
            const data = issueData(issues)

            expect(data.firstDate).toBe(jan1)
        })

        it('returns the last date we care about, based on how many full iterations there are', () => {
            const jan1 = new Date('2019-01-01T12:34:56.000Z')
            const jan5 = new Date('2019-01-05T12:34:56.000Z')
            const jan13 = new Date('2019-01-13T12:34:56.000Z')
            const jan17 = new Date('2019-01-17T12:34:56.000Z')

            const issues = [{done: jan1}, {done: jan5}, {done: jan13}, {done: jan17}]
            const data = issueData(issues)

            expect(data.numberOfFullIterations).toBe(2)
            expect(data.lastDateWeCareAbout).toEqual(new Date('2019-01-15T12:34:56.000Z'))
        })
    })
})
