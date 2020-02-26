const { isApple, isAndroid, isWeb } = require("../firefox-extension/helpers.js")

describe('helpers', () => {
    describe('isApple', () => {
        it('returns true if a component is named iOS', () => {
            const issue = { fields: { components: [{ name: 'iOS' }] }}
            expect(isApple(issue)).toBeTrue()
        })

        it('returns true if a component is named tvOS', () => {
            const issue = { fields: { components: [{ name: 'Web' }, { name: 'tvOS' }] }}
            expect(isApple(issue)).toBeTrue()
        })

        it('returns false if there is no iOS or tvOS component', () => {
            const issue = { fields: { components: [{ name: 'Android' }] }}
            expect(isApple(issue)).toBeFalse()
        })

        it('returns false if there are no components', () => {
            const issue = { fields: { components: [] }}
            expect(isApple(issue)).toBeFalse()
        })
    })

    describe('isAndroid', () => {
        it('returns true if a component is named Android', () => {
            const issue = { fields: { components: [{ name: 'Android' }] }}
            expect(isAndroid(issue)).toBeTrue()
        })

        it('returns true if a component is named Android TV', () => {
            const issue = { fields: { components: [{ name: 'Web' }, { name: 'Android TV' }] }}
            expect(isAndroid(issue)).toBeTrue()
        })

        it('returns true if a component is named Amazon Fire TV', () => {
            const issue = { fields: { components: [{ name: 'Amazon Fire TV' }, { name: 'QA' }] }}
            expect(isAndroid(issue)).toBeTrue()
        })

        it('returns false if there is no Android component', () => {
            const issue = { fields: { components: [{ name: 'Web' }, { name: 'QA' }] }}
            expect(isAndroid(issue)).toBeFalse()
        })

        it('returns false if there are no components', () => {
            const issue = { fields: { components: [] }}
            expect(isAndroid(issue)).toBeFalse()
        })
    })

    describe('isWeb', () => {
        it('returns true if a component is named Web', () => {
            const issue = { fields: { components: [{ name: 'Web' }] }}
            expect(isWeb(issue)).toBeTrue()
        })

        it('returns false if there is no Web component', () => {
            const issue = { fields: { components: [{ name: 'Android' }] }}
            expect(isWeb(issue)).toBeFalse()
        })

        it('returns false if there are no components', () => {
            const issue = { fields: { components: [] }}
            expect(isWeb(issue)).toBeFalse()
        })
    })
})
