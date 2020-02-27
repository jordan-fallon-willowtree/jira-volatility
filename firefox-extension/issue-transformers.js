const { getPlatforms } = require('./helpers.js')

function simplifyIssue(issue) {
    return {
        id: issue.id,
        points: issue.fields.customfield_10004,
        done: new Date(issue.fields.resolutiondate),
        platforms: getPlatforms(issue)
    }
}

module.exports = { simplifyIssue }
