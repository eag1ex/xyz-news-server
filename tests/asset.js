
// SECTION PASS:GET /absences requests
describe('PASS:GET /absences requests', function () {
  
    after(function (done) {
      serverApp.server.close()
      done()
    })
  
    it(`should list all items with all keys`, function (done) {
  
      chaiGetRequest(serverApp.server, `/database/absences`, (res) => {
  
        assert.equal(res.body.success, true)
        expect(res.body.response.length).above(0)
        expect(res.status === 200 || res.status === 300).equal(true)
        res.should.be.json
        res.should.have.status('200')
  
        res.body.response.forEach((item, inx) => {
          absencesList.filter(key => {
            assert(Object.keys(item).includes(key))
          })
        })
      }, done)
  
    })
  
  
    it(`every [item,...] should have {member.name}`, function (done) {
  
      chaiGetRequest(server, `/database/absences`, (res) => {
        res.body.response.forEach((item, inx) => {
          expect(item).to.have.property('member')
          expect(item.member).to.have.property('name').to.be.a('string')
        })
      }, done)
    })
  
  
    it(`{query} ?userId=644 to get list`, function (done) {
  
      chaiGetRequest(server, `/database/absences?userId=644`, (res) => {
        assert.equal(res.body.success, true)
        expect(res.body.response.length).above(0)
        res.body.response.forEach((item) => {
          expect(item).to.have.property('userId').to.be.a('number')
          expect(item['userId']).to.equal(644)
        })
      }, done)
    })
  
    it(`{query} ?startDate=2016-12-31&endDate=2017-03-10 to list correct range`, function (done) {
  
      chaiGetRequest(server, `/database/absences?startDate=2016-12-31&endDate=2017-03-10`, (res) => {
        assert.equal(res.body.success, true)
        expect(res.body.response.length).above(0)
        res.body.response.forEach((item) => {
          expect(new Date(item.startDate).getTime() >= new Date('2016-12-31')).to.equal(true)
          expect(new Date(item.endDate).getTime() <= new Date('2017-03-10')).to.equal(true)
        })
      }, done)
  
    })
  
    it(`{query} ?startDate=2016-12-31 to list from startDate`, function (done) {
  
      chaiGetRequest(server, `/database/absences?startDate=2016-12-31`, (res) => {
  
        assert.equal(res.body.success, true)
        expect(res.body.response.length).above(0)
        res.body.response.forEach((item) => {
          expect(new Date(item.startDate).getTime() >= new Date('2016-12-31')).to.equal(true)
        })
  
      }, done)
    })
  }) // !SECTION 
  
  
  // SECTION PASS:GET /members requests
  describe('PASS:GET /members requests', function () {
    
    after(function (done) {
      server.close()
      done()
    })
  
    it(`should list all items with all keys`, function (done) {
  
      chaiGetRequest(server, `/database/members`, (res) => {
        assert.equal(res.body.success, true)
        expect(res.body.response.length).above(0)
        expect(res.status === 200 || res.status === 300).equal(true)
        res.should.have.status('200')
  
        res.body.response.forEach((item, inx) => {
          membersList.filter(key => {
            assert(Object.keys(item).includes(key))
          })
        })
      }, done)
  
    })
  
  
    it(`{query} ?userId=644 to get list`, function (done) {
  
      chaiGetRequest(server, `/database/members?userId=644`, (res) => {
        res.body.response.forEach((item, inx) => {
          membersList.filter(key => {
            assert(Object.keys(item).includes(key))
          })
          expect(item['userId']).to.equal(644)
        })
      }, done)
  
    })
  
  
    it(`{query} ?absence=1 list all with related absences[]`, function (done) {
  
      chaiGetRequest(server, `/database/members?absence=1`, (res) => {
        res.body.response.forEach((item, inx) => {
          [].concat('absences', membersList).filter(key => {
            assert(Object.keys(item).includes(key))
          })
          // it is ok for some members not to have absences yet set
          if ((item['absences'] || []).length) {
            item['absences'].forEach((absence) => {
              absencesList.filter(key => assert(Object.keys(absence).includes(key)))
            })
          }
        })
      }, done)
  
    })
  
  
    it(`{query} ?userId=644&absence=1 list by userId=644 with related absences[]`, function (done) {
  
      chaiGetRequest(server, `/database/members?userId=644&absence=1`, (res) => {
        res.body.response.forEach((item, inx) => {
          [].concat('absences', membersList).filter(key => {
            assert(Object.keys(item).includes(key))
          })
          // it is ok for some members not to have absences yet set
          if ((item['absences'] || []).length) {
            item['absences'].forEach((absence) => {
              expect(absence['userId']).to.equal(644)
              absencesList.filter(key => assert(Object.keys(absence).includes(key)))
            })
          }
          expect(item['userId']).to.equal(644)
        })
      }, done)
  
    })
  
  }) //!SECTION 
  
  
  // SECTION Calendar should create (.ics) events for types: [sickness,vacation]
  describe('Test calendar (.ics) events for types: [sickness,vacation]', function () {
    
    after(function (done) {
      server.close()
      done()
    })
  
    it('generate events for :sickness, with userId=644', function (done) {
  
      chaiGetRequest(server, `/calendar/sickness/644`, (res) => {
        assert.equal(res.body.success, true)
        res.body.response.forEach((el, inx) => {
          expect(el).to.have.property('created')
        })
        expect(res.body.response.length).above(0)
        res.should.have.status('200')
  
      }, done)
    })
  
    it('generate events for :vacation, with userId=644', function (done) {
  
      chaiGetRequest(server, `/calendar/vacation/644`, (res) => {
        assert.equal(res.body.success, true)
        res.body.response.forEach((el, inx) => {
          expect(el).to.have.property('created')
        })
        expect(res.body.response.length).above(0)
        res.should.have.status('200')
  
      }, done)
    })
  
    it('/download/test_2351_event.ics should return status:200', function (done) {
      chaiGetRequest(server, `/download/test_2351_event.ics`, (res) => {
        res.should.have.status('200')
      }, done)
    })
  
  
    it('Should fail to generate events for :vacation with invalid userId=000', function (done) {
  
      chaiGetRequest(server, `/calendar/vacation/000`, (res) => {
        assert.equal(res.body.success, true)
        expect(res.body).to.have.property('code').to.equal(107)
        expect(res.body.response.length).below(1)
        res.should.have.status('200')
      }, done)
    })
  
    it('Should fail to generate events :sickness with invalid userId=000', function (done) {
  
      chaiGetRequest(server, `/calendar/sickness/000`, (res) => {
        assert.equal(res.body.success, true)
        expect(res.body).to.have.property('code').to.equal(107)
        expect(res.body.response.length).below(1)
        res.should.have.status('200')
      }, done)
    })
  
  })  //!SECTION 
  
  
  
  
  // SECTION Calendar should create (.ics) events for types: [sickness,vacation]
  describe('FAIL:GET /members requests', function () {
    
    after(function (done) {
      server.close()
      done()
    })
  
    it('failed results for {query} ?userId=000&absence=1', function (done) {
  
      chaiGetRequest(server, `/database/members?userId=000&absence=1`, (res) => {
        expect(res.body.response.length).below(1)
        res.should.have.status('200')
        expect(res.body).to.have.property('code').to.equal(103)
  
      }, done)
  
    })
  
    it('failed results for invalid range startDate=20161-12-311&endDate=2017-03-101', function (done) {
  
      chaiGetRequest(server, `/database/members?startDate=20161-12-311&endDate=2017-03-101`, (res) => {
        expect(res.body.response.length).below(1)
        res.should.have.status('200')
        expect(res.body).to.have.property('code').to.equal(103)
      }, done)
  
    })
  
  
  })// !SECTION 
  
  // SECTION FAIL:GET /absences requests
  describe('FAIL:GET /absences requests', function () {
    
    after(function (done) {
      server.close()
      done()
    })
  
    it('failed results for {query} ?userId=000', function (done) {
  
      chaiGetRequest(server, `/database/absences?userId=000`, (res) => {
        expect(res.body.response.length).below(1)
        res.should.have.status('200')
        expect(res.body).to.have.property('code').to.equal(100)
  
      }, done)
    })
  }) //!SECTION
  
  