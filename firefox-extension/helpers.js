const { APPLE, ANDROID, WEB, QA } = require('./constants.js')

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

function isQA(issue) {
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
    if(isQA(issue)) { platforms.push(QA) }
    return platforms
}

function filterOutInvalidIssues(issues) {
    return issues
        .filter(issue => issue.fields.status.name == 'Done')
        .filter(issue => issue.fields[pointField])
        .filter(issue => issue.fields.resolutiondate)
}

module.exports = { isApple, isAndroid, isWeb, isQA, getPlatforms, filterOutInvalidIssues }
