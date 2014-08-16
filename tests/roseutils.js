var requirejs = require("requirejs");
var should = require("should")

requirejs.config({
  baseUrl: 'js'
})

describe("Difference of Degree-based angles", function() {
  var rose = {}
  before(function(done) {
    console.log(rose)
    requirejs(
      ['roseutils'],
      function(roseutils) {
        rose.utils = roseutils
        done()
      })
  })

  it("should be zero, if the angles are the same.", function() {
    rose.utils.angleDifference(0, 0).should.equal(0)
    rose.utils.angleDifference(1, 1).should.equal(0)
    rose.utils.angleDifference(10, 10).should.equal(0)
    rose.utils.angleDifference(359, 359).should.equal(0)
  })

  it("should be (larger-smaller), if angles are not separated by 0/360.", function() {
    rose.utils.angleDifference(0, 10).should.equal(10)
    rose.utils.angleDifference(1, 10).should.equal(9)
    rose.utils.angleDifference(100, 180).should.equal(80)
    rose.utils.angleDifference(350, 359).should.equal(9)
  })

  it("should work on edge-case, regarding 0/360 barrier", function() {
    rose.utils.angleDifference(0, 180).should.equal(180)
  })

  it("should consider that 360=0, if angles are separated by 0/360.", function() {
    rose.utils.angleDifference(359, 0).should.equal(1)
    rose.utils.angleDifference(350, 0).should.equal(10)
    rose.utils.angleDifference(350, 10).should.equal(20)
    rose.utils.angleDifference(200, 10).should.equal(170)
  })
})