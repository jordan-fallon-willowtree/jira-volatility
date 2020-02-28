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
    const numberOfFullIterations = Math.floor((lastDate - firstDate) / MILLISECONDS_PER_WEEK)

    const lastDateWeCareAbout = new Date(firstDate)
    lastDateWeCareAbout.setDate(lastDateWeCareAbout.getDate() + numberOfFullIterations * 7)

    const issuesWeCareAbout = issues
        .filter(issue => issue.done < lastDateWeCareAbout)

    return {
        issues: issuesWeCareAbout,
        firstDate,
        numberOfFullIterations
    }
}

module.exports = { simplifyIssue, issueData }
