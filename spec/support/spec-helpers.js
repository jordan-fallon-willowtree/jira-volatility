function issueWithStatus(status) {
    return { id: String(Math.random()), fields: { status: { name: status }, customfield_10004: 1, resolutiondate: '2019-01-01T14:25:20.000Z' } }
}

function issueWithPoints(points) {
    return { id: String(Math.random()), fields: { status: { name: 'Done' }, customfield_10004: points, resolutiondate: '2019-01-01T14:25:20.000Z' } }
}

function issueWithResolutionDate(date) {
    return { id: String(Math.random()), fields: { status: { name: 'Done' }, customfield_10004: 1, resolutiondate: date } }
}

function issueWithId(id) {
    return { id: id, fields: { status: { name: 'Done' }, customfield_10004: 1, resolutiondate: '2019-01-01T14:25:20.000Z' } }
}

module.exports = { issueWithStatus, issueWithResolutionDate, issueWithPoints, issueWithId }
