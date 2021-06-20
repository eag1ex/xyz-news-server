`use strict`;

/**
 * @typedef {import("../types").types.TReq} Req
 * @typedef {import("../types").types.TResp} Resp
 * @typedef {import("../types").types.APIstoryTypes} APIstoryTypes
 * @typedef {import("../types").types.StoryResponse} StoryResponse
 * @typedef {import("../types").types.MetaResponse} MetaResponse
 * @typedef {import("../types").types.UserResponse} UserResponse
 */

// asset: https://mochajs.org/
// asset: https://www.chaijs.com/
// asset: https://github.com/istanbuljs/nyc
const {users, testURLS} = require('./user-test.data')

const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
// with debug true will get better coverage because will expose notify logging
const DEBUG = require('../config').debug
const { encrypt } = require('../libs/utils')
const { loggerSetting, sq } = require('x-utils-es/umd')

loggerSetting('log', 'off')
loggerSetting('warn', 'off')
loggerSetting('onerror', 'off')

const serverApp = require('../libs/server')(DEBUG)
const should = chai.should()
const expect = chai.expect
const config = require('../config')
chai.use(chaiHttp)

/**
 *
 * @returns {Promise<any>}
 */
function chaiGetRequest(server, url = '') {
    const defer = sq()
    chai.request(server)
        .get(url)
        .end(function (err, res) {
            if (err || (res || {}).status >= 400) {
                defer.reject(err)
                return
            } else {
                defer.resolve(res)
            }
        })
    return defer
}

// SECTION  Server should start successfully
describe('Server should start successfully', function () {
    let port
    before(async function (done) {
        // @ts-ignore
        port = serverApp.server.address().port
        done()
    })

    after(function (done) {
        serverApp.server.close()
        done()
    })

    it(`server is running on port:${config.port}`, function (done) {
        this.retries(2)
        const okPort = process.env.PORT || config.port
        assert.equal(okPort, Number(port))
        done()
    })

    it('GET /welcome status is 200', function (done) {
        chaiGetRequest(serverApp.server, `/welcome`).then((res) => {
            expect(res.body.status).equal(200)
            res.should.have.status('200')
            res.should.be.json
            done()
        })
    })
})

describe('PASS:GET /api/stories:type', function () {
    after(function (done) {
        serverApp.server.close()
        done()
    })

    it(`/api/stories/topstories should return 15 results`, function (done) {
        this.timeout(15000)

        chaiGetRequest(serverApp.server, `/api/stories/topstories`).then((res) => {
            /**
             * @type {StoryResponse}
             */
            let body = res.body
            assert.equal(body.code, 200)
            expect(body.response.length).equal(15)
            expect(res.status === 200 || res.status === 300).equal(true)
            expect(body.paged).equal(0)
            res.should.have.status('200')
            body.response.forEach((item, inx) => {
                expect(item).haveOwnProperty('id')
            })
            done()
        })
    })

    it(`/api/stories/beststories?paged=3 should return 15 results`, function (done) {
        this.timeout(15000)

        chaiGetRequest(serverApp.server, `/api/stories/beststories?paged=3`).then((res) => {
            /**
             * @type {StoryResponse}
             */
            let body = res.body
            assert.equal(body.code, 200)
            expect(body.response.length).equal(15)
            expect(res.status === 200 || res.status === 300).equal(true)
            expect(body.paged).equal(3)
            res.should.have.status('200')
            body.response.forEach((item, inx) => {
                expect(item).haveOwnProperty('id')
            })
            done()
        })
    })

    it(`/api/stories/newstories?paged=4 should return 15 results`, function (done) {
        this.timeout(15000)

        chaiGetRequest(serverApp.server, `/api/stories/newstories?paged=4`).then((res) => {
            /**
             * @type {StoryResponse}
             */
            let body = res.body
            assert.equal(body.code, 200)
            expect(body.response.length).equal(15)
            expect(res.status === 200 || res.status === 300).equal(true)
            expect(body.paged).equal(4)
            res.should.have.status('200')
            body.response.forEach((item, inx) => {
                expect(item).haveOwnProperty('id')
            })
            done()
        })
    })
})


/**
 * NOTE the result is not guaranteed, we cannot know the server is reachable
 * so we have set to at least 1 pass and 1 fail
 */
describe('PASS:GET /api/metadata (7 requests)', function () {
    after(function (done) {
        serverApp.server.close()
        done()
    })

    it(`/api/metadata/{url} should pass all requests`, function (done) {

        this.timeout(30000)

        let passCount = 0 // count pass requests
        let rejectCount = 0 // count reject requests
        let eachRequest = (cUrl = '') => {
            return chaiGetRequest(serverApp.server, `/api/metadata/${cUrl}`).then((res) => {
                /**
                 * @type {MetaResponse}
                 */
                let body = res.body
                assert.equal(body.code, 200)
                expect(body.response.metadata.length).to.greaterThan(0)
                expect(res.status === 200 || res.status === 300).equal(true)
                res.should.have.status('200')
                return true
            })
        }

        let doLoop = async () => {
            for (let inx = 0; inx < testURLS.length; inx++) {
                try {
                    let encryptUrl = encrypt(testURLS[inx].value)
                    await eachRequest(encryptUrl)
                    passCount++
                } catch (err) {
                    rejectCount++
                }
            }
            return true
        }

        doLoop().then((n) => {
            expect(passCount).greaterThan(0) // results not guaranteed
            expect(rejectCount).equal(4)
            done()
        })
    })
})


describe('PASS:GET /api/user:name (2 pass/fail)', function () {
    after(function (done) {
        serverApp.server.close()
        done()
    })

    it(`/api/user:name should pass/fail all requests`, function (done) {
        this.timeout(15000)

        let passCount = 0 // count pass requests
        let rejectCount = 0 // count reject requests

        let eachRequest = (idName = '') => {
            return chaiGetRequest(serverApp.server, `/api/user/${idName}`).then((res) => {
                /**
                 * @type {UserResponse}
                 */
                let body = res.body
                assert.equal(body.code, 200)
                expect(body.response).haveOwnProperty('id')
                expect(res.status === 200 || res.status === 300).equal(true)
                res.should.have.status('200')
                return true
            })
        }

        let doLoop = async () => {
            for (let inx = 0; inx < users.length; inx++) {
                try {
                    await eachRequest(users[inx].user)
                    passCount++
                } catch (err) {
                    rejectCount++
                }
            }
            return true
        }
        doLoop().then((n) => {
            expect(passCount).greaterThan(0) // results not guaranteed
            expect(rejectCount).equal(1)
            done()
        })
    })
})



describe('Test app route on /xyz/app/stories/new', function () {
    after(function (done) {
        serverApp.server.close()
        done()
    })
    it(`/xyz/app/stories/new should have status: 200`, function (done) {
        this.timeout(10000)

        chaiGetRequest(serverApp.server, `/xyz/app/stories/new`).then((res) => {
            res.should.have.status('200')
            done()
        })
    })
})
