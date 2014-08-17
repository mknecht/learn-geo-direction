define(
  ['jquery', 'geo', 'roseutils'],
  function($, geo, roseutils) {
    var $w = $(window)
    var hfull = $w.height()
    var hhalf = (hfull / 2) | 0;
    var hquarter = (hhalf / 2) | 0;

    var destinationRadius = 20

    var successMessages = [
      "That's it!",
      "Good job!",
      "Wow!",
      "Outstandingly astonishingly exceptional!",
      "I stand in awe!"
    ]

    var failureMessages = [
        function(missedBy) { return "Off by " + (missedBy | 0) + "°!" },
        function(missedBy) { return "All " + (missedBy | 0) + "° are saying you are wrong!" },
        function(missedBy) { return "So close! (" + (missedBy | 0) + "°)" }
    ]

    function displayBanner(text) {
      var $fog = $('div#fog')
      var $banner = $fog.children('div#banner')
      $banner.text(text)
      $fog.show()
      return function() {
        $fog.hide()
      }
    }

    function getTransformedGeoAngle() {
      return geo.getAngle() - 90  // 0 is north for geo-angles
    }

    function indicateSuccess() {
      return displayBanner(roseutils.choose(successMessages))
    }

    function indicateFailure(missedBy) {
      return displayBanner(roseutils.choose(failureMessages)(missedBy))
    }

    function indicateDestination(destinationCircle, centerx, centery) {
      var destinationDistance = hquarter * 1.5
      var triangle = roseutils.triangleByAngleAndRadius(
        getTransformedGeoAngle(), destinationDistance)
      destinationCircle
      .attr("cx", centerx + triangle.adjacent)
      .attr("cy", centery + triangle.opposite)
      .style('display', 'inline')
      return function() {
        destinationCircle.style('display', 'none')
      }
    }

    return function(interactSvg, centerx, centery) {
      var destinationCircle = interactSvg
                              .append('circle')
                              .attr('cx', centerx)
                              .attr('cy', centery)
                              .attr('r', destinationRadius)
                              .classed("destination", true)
      return {
        giveFeedback: function(angle, tolerance) {
          var actual = getTransformedGeoAngle()
          var difference = roseutils.angleDifference(angle, actual)
          var cleanupSuccessFeedback = (
            (difference < tolerance) ?
              indicateSuccess() :
              indicateFailure(difference - tolerance)
          )
          var cleanupDestinationFeedback = indicateDestination(
            destinationCircle, centerx, centery)
          return function() {
            cleanupSuccessFeedback()
            cleanupDestinationFeedback()
          }
        }
      }
    }
  }
)