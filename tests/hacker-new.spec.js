`use strict`;

/**
 * test hacker-news fails
 */
const chai = require('chai')
const { loggerSetting } = require('x-utils-es/umd')

loggerSetting('log', 'off')
loggerSetting('warn', 'off')

const expect = chai.expect

const HackerNewsAPI = require('../libs/hacker-news-api')
const hn = new HackerNewsAPI()

describe('Test hacker news API', function () {

    it(`fetch() / fails`, function (done) {
        this.timeout(5000)

        let sync = async () => {
            try {
                // @ts-ignore
                await hn.fetch()
            } catch (err) {
                expect(err.length).have.length
            }
            try {
                // @ts-ignore
                await hn.fetch({ type: 'item' })
            } catch (err) {
                expect(err.length).have.length
            }

            try {
                // @ts-ignore
                await hn.fetch({ type: 'nonexist' })
            } catch (err) {
                expect(err.length).have.length
            }

            try {
                // @ts-ignore
                await hn.fetch({ type: 'user' })
            } catch (err) {
                expect(err.length).have.length
            }
        }

        sync().then(done)
    })

    it(`storiesPaged() / fails`, function (done) {
        this.timeout(15000)

        let sync = async () => {
            try {
                // @ts-ignore
                await hn.storiesPaged({paged:10000,value:'beststories'})
            } catch (err) {
                expect(err.length).have.length
            }
            try {
                // @ts-ignore
                await hn.storiesPaged({value:'nonexist'})
            } catch (err) {
                expect(err.length).have.length
            }
            try {
                // @ts-ignore
                await hn.storiesPaged()
            } catch (err) {
                expect(err.length).have.length
            }
        }
        sync().then(done)
    })
})

