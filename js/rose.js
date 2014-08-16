/*global jQuery */

define(
  ['jquery', 'd3', 'mtlatlon', 'geo', 'roseutils'],
  function($, d3, LatLon, geo, roseutils) {
    function getSelectors() {
      function sp() {
        return $.extend([], arguments).join(" ")
      }

      function p(x, y) {
        return "" + x + " " + y
      }

      // A distance that will get the end of the polygon out of sight even
      // in the diagonals, i.e. more than sqrt(a² + b²) or 1.41…
      var outofsight = Math.max($w.width(), $w.height()) * 2

      return {
        "easy": {
          draw: function(interact) {
            return interact.append('path')
                   .attr('class', 'selector')
                   .attr('d', sp(
                     'M', p(centerx, centery),
                     'm', p(0, -selectionRadius),
                     'l', p(0, -outofsight),
                     'l', p(outofsight, 0),
                     'l', p(0, 2 * outofsight + 2 * selectionRadius),
                     'l', p(-outofsight, 0),
                     'l', p(0, -outofsight),
                     'a', p(hquarter, hquarter), '0', '0,0', p(0, -selectionRadius * 2),
                     'z'
                   ))
          }
        }
      }
    }

    var $w = $(window)

    var hfull = $w.height()
    var hhalf = (hfull / 2) | 0;
    var hquarter = (hhalf / 2) | 0;

    var selectionRadius = hquarter + 5;

    var $interactDiv = $('<div id="interact"></div>').appendTo('body')
    var interactSvg = d3.select('div#interact').append('svg')
                   .attr("id", "interact")
                   .attr("height", "100%")
                   .attr("width", "100%")
                   .attr("viewBox", "0 0 " + ($w.width() | 0) + " " + hfull)
                   .attr("preserveAspectRatio", "xMaxYMax meet")

    var centerx = hhalf;
    var centery = hhalf;

    var selector = getSelectors().easy.draw(interactSvg, centerx, centery)

    var destinationRadius = 20
    var destinationCircle = interactSvg
                            .append('circle')
                            .attr('cx', centerx)
                            .attr('cy', centery)
                            .attr('r', destinationRadius)
                            .classed("destination", true)

    function angleTo(x, y) {
      var a = y - centery
      var b = x - centerx;
      var c = Math.sqrt(Math.pow(x - centerx, 2) + Math.pow(y - centery, 2))
      var radian_angle = Math.asin(a / c)
      if (b < 0) {
        // When the angle is bigger than 90 degrees,
        // we need to account for the fact that the above formulae
        // are for an orthogonal triangle.
        radian_angle = Math.PI - radian_angle;
      }
      var res = radian_angle * (360 / (2 * Math.PI))
      // -135 degrees is the difference between the 0 angle of the coordinate
      // system and the angle of the untransformed drawing.
      return res

    }

    function updateDestination(label) {
      $('#destination').text("In which direction is " + label + "?")
    }

    function insertRoseSvg(roseElement) {
      var $rosediv = $('<div id="rosediv"></div').appendTo('body')
      $rosediv
      .height(hhalf)
      .width("50%")
      .addClass("rose")
      .css({
        top: hquarter,
        left: hquarter
      })
      var $svg = $(roseElement).appendTo($rosediv)
      var roseSvg = d3.select('#rosediv').select('svg')
                    .attr("height", hhalf)
                    .attr("width", hhalf)
                    .attr("viewBox", "0 0 800 800")
                    .attr("preserveAspectRatio", "xMidYMid meet")
    }

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
      return displayBanner("Nailed it!")
    }

    function indicateFailure(missedBy) {
      return displayBanner("No! Missed by " + (missedBy | 0) + " degrees.")
    }

    function indicateDestination() {
      var destinationDistance = selectionRadius * 1.5
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

    function giveFeedbackAndStartNewRound(angle) {
      var tolerance = 90
      var actual = getTransformedGeoAngle()
      var difference = roseutils.angleDifference(angle, actual)
      var cleanupSuccessFeedback = (
        (difference < tolerance) ?
          indicateSuccess() :
          indicateFailure(difference - tolerance)
      )
      var cleanupDestinationFeedback = indicateDestination()
      setTimeout(function() {
        cleanupSuccessFeedback()
        cleanupDestinationFeedback()
        api.startNewRound()
      }, 3000)
    }

    function reactToMouseMovementAndClicks() {
      var angle = [0]
      $('body').mousemove(function(e) {
        angle[0] = angleTo(e.clientX, e.clientY)
        selector.attr(
          "transform",
          "rotate(" + angle + "," + centerx + "," + centery + ")")
      })

      $('body').click(function(e) {
        giveFeedbackAndStartNewRound(angle[0])
      })
    }

    var api = Object.create({
      loadGame: function() {
        // load compass rose
        d3.xml("images/rose.svg", "image/svg+xml", function(xml) {
          insertRoseSvg(xml.documentElement)
        })
      },
      startNewRound: function() {
        geo.chooseNewDestination()
        updateDestination(geo.destination.label)
      },
      startGame: function() {
        reactToMouseMovementAndClicks()
        this.startNewRound()
      }
    })

    return api
  }
)