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
            const issues = [issueWithId(4), issueWithId(5)]
            const data = issueData(issues)
            expect(data.issues).toBe(issues)
        })
    })
})
