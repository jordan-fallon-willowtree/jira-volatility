const { getPlatforms } = require('./helpers.js')
const { MILLISECONDS_PER_WEEK } = require('./constants.js')

function simplifyIssue(issue) {
    return {
        id: issue.id,
        points: issue.fields.customfield_10004,
        done: new Date(issue.fields.resolutiondate),
        platforms: getPlatforms(issue)
    }
}

function issueData(issues) {
    const firstDate = issues[0].done
    const lastDate = issues[issues.length - 1].done
    const iterationCount = numberOfFullIterations(firstDate, lastDate)

    const lastDateWeCareAbout = new Date(firstDate)
    lastDateWeCareAbout.setDate(lastDateWeCareAbout.getDate() + iterationCount * 7)

    return {
        issues,
        firstDate,
        lastDateWeCareAbout,
        numberOfFullIterations: iterationCount
    }
}

function numberOfFullIterations(firstDate, lastDate) {
    return Math.floor((lastDate - firstDate) / MILLISECONDS_PER_WEEK)
}

module.exports = { simplifyIssue, issueData }
