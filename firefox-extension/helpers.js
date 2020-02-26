const pointField = 'customfield_10004'

function isApple(issue) {
    return containsKeywords(issue, ['iOS', 'tvOS'])
}

function isAndroid(issue) {
    return containsKeywords(issue, ['Android', 'Android TV', 'Amazon Fire TV'])
}

function isWeb(issue) {
    return containsKeywords(issue, ['Web', 'chromecast'])
}

function containsKeywords(issue, keywords) {
    return issue.fields.components.some(com => keywords.includes(com.name))
}

function filterOutInvalidIssues(issues) {
    return issues
        .filter(issue => issue.fields.status.name == 'Done')
        .filter(issue => issue.fields[pointField])
        .filter(issue => issue.fields.resolutiondate)
}

module.exports = { isApple, isAndroid, isWeb, filterOutInvalidIssues }
