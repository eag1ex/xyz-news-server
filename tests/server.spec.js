`use strict`

// asset: https://mochajs.org/
// asset: https://www.chaijs.com/
// asset: https://github.com/istanbuljs/nyc

const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
// with debug true will get better coverage because will expose notify logging
const DEBUG = require('../config').debug
const serverApp = require('../libs/server')(DEBUG)

const should = chai.should()
const expect = chai.expect
// const { notify } = require("x-units")
const config = require('../config')
chai.use(chaiHttp)

// let absencesList = ['admitterNote',
//   'confirmedAt',
//   'createdAt',
//   'crewId',
//   'endDate',
//   'id',
//   'memberNote',
//   'rejectedAt',
//   'startDate',
//   'type',
//   'userId']

// let membersList = [
//   'crewId',
//   'id',
//   'image',
//   'name',
//   'userId'
// ]

function chaiGetRequest(server, url, cb, done) {
  chai.request(server).get(url)
    .end(function (err, res) {
      if (err) {
        expect('success').not.equal('success')
        return
      }
      cb(res)
      done()
    })
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

    chaiGetRequest(serverApp.server, `/welcome`, (res) => {
      expect(res.body.status).equal(200)
      res.should.have.status('200')
      res.should.be.json
    }, done)

  })
}) // !SECTION 

