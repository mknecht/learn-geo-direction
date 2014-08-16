var requirejs = require("requirejs");
var should = require("should")

requirejs.config({
  baseUrl: 'js'
})

describe("Difference of Degree-based angles", function() {
  var rose = {}
  before(function(done) {
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

var errormargin = 0.01

describe("Length of the legs of right-angled triangle given angle a and radius r", function() {
  var rose = {}
  before(function(done) {
    requirejs(
      ['roseutils'],
      function(roseutils) {
        rose.utils = roseutils
        done()
    })
  })

  it("should be 1 for a=45° and r=sqrt(2)", function() {
    var legs = rose.utils.triangleByAngleAndRadius(45, Math.sqrt(2))
    legs.adjacent.should.be.approximately(1, errormargin)
    legs.opposite.should.be.approximately(1, errormargin)
  })

  it("should be 1 and 2 for a=63.4° and r=sqrt(2**2+1)", function() {
    var legs = rose.utils.triangleByAngleAndRadius(63.44, Math.sqrt(5))
    legs.adjacent.should.be.approximately(1, errormargin)
    legs.opposite.should.be.approximately(2, errormargin)
  })

  it("should be 2 and 1 for a=26.57° and r=sqrt(2)", function() {
    var legs = rose.utils.triangleByAngleAndRadius(26.57, Math.sqrt(5))
    legs.adjacent.should.be.approximately(2, errormargin)
    legs.opposite.should.be.approximately(1, errormargin)
  })

  it("should be -1 and 1 for a=135° and r=sqrt(2)", function() {
    var legs = rose.utils.triangleByAngleAndRadius(135, Math.sqrt(2))
    legs.adjacent.should.be.approximately(-1, errormargin)
    legs.opposite.should.be.approximately(1, errormargin)
  })

  it("should be 1 and -1 for a=315° and r=sqrt(2)", function() {
    var legs = rose.utils.triangleByAngleAndRadius(360-45, Math.sqrt(2))
    legs.adjacent.should.be.approximately(1, errormargin)
    legs.opposite.should.be.approximately(-1, errormargin)
  })

  it("should be -1 and -1 for a=225° and r=sqrt(2)", function() {
    var legs = rose.utils.triangleByAngleAndRadius(360-45-90, Math.sqrt(2))
    legs.adjacent.should.be.approximately(-1, errormargin)
    legs.opposite.should.be.approximately(-1, errormargin)
  })

})