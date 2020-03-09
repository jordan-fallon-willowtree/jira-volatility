function totalPointsFromIssues(issues) {
    return issues.reduce((total, issue) => total + issue.points * issue.platforms.length, 0)
}

function std(numbers) {
    const avg = numbers.reduce(sum, 0) / numbers.length
    const stdSquared = numbers
        .map(num => Math.pow(num - avg, 2))
        .reduce(sum, 0) / numbers.length
    return Math.round(Math.sqrt(stdSquared) * 100) / 100
}

function sum(total, next) {
    return total + next
}

module.exports = { std, totalPointsFromIssues }
