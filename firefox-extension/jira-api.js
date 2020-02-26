const baseURL = 'https://jira.willowtreeapps.com/rest'
const apiURL = baseURL + '/api/latest'
const agileURL = baseURL + '/agile/1.0'

function getSprints() {
    fetch(`${agileURL}/board/309/sprint?startAt=100`)
        .then(res => res.json())
        .then(data => console.log(data.values.map(sprint => ({id: sprint.id, name: sprint.name}))))
}

function getSprintIssues(sprintId) {
    return fetch(`${agileURL}/board/309/sprint/${sprintId}/issue`)
        .then(res => res.json())
}

module.exports = { getSprints, getSprintIssues }
