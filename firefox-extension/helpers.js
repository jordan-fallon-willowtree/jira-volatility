const { APPLE, ANDROID, WEB, TE } = require('./constants.js')

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

function isTE(issue) {
    return containsKeywords(issue, ['QA', 'TE'])
}

function containsKeywords(issue, keywords) {
    return issue.fields.components.some(com => keywords.includes(com.name))
}

function getPlatforms(issue) {
    const platforms = []
    if(isApple(issue)) { platforms.push(APPLE) }
    if(isAndroid(issue)) { platforms.push(ANDROID) }
    if(isWeb(issue)) { platforms.push(WEB) }
    if(isTE(issue)) { platforms.push(TE) }
    return platforms
}

function filterOutInvalidIssues(issues) {
    return issues
        .filter(issue => issue.fields.status.name == 'Done')
        .filter(issue => issue.fields[pointField])
        .filter(issue => issue.fields.resolutiondate)
}

module.exports = { isApple, isAndroid, isWeb, isTE, getPlatforms, filterOutInvalidIssues }
