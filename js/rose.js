/*global jQuery, setTimeout */

define(
  ['jquery', 'd3', 'mtlatlon', 'geo', 'roseutils'],
  function($, d3, LatLon, geo, roseutils) {
    function getSelectors() {
      // A distance that will get the end of the polygon out of sight even
      // in the diagonals, i.e. more than sqrt(a² + b²) or 1.41…
      var outofsight = Math.max($w.width(), $w.height()) * 2

      function sp() {
        return $.extend([], arguments).join(" ")
      }

      function p(x, y) {
        return "" + x + " " + y
      }

      function drawNarrowSelector(svg, angle) {
            var innerLeftTriangle = roseutils.triangleByAngleAndRadius(90 + angle, selectionRadius)
            var outerLeftTriangle = roseutils.triangleByAngleAndRadius(90 + angle, outofsight)
            return svg.append('path')
                   .attr('class', 'selector')
                   .attr('d', sp(
                     'M', p(centerx + innerLeftTriangle.adjacent, centery - innerLeftTriangle.opposite),
                     'L', p(centerx + outerLeftTriangle.adjacent, centery - outerLeftTriangle.opposite),
                     'L', p(centerx - outerLeftTriangle.adjacent, centery - outerLeftTriangle.opposite),
                     'L', p(centerx - innerLeftTriangle.adjacent, centery - innerLeftTriangle.opposite),
                     'A', p(hquarter, hquarter), '0', '0,0', p(centerx + innerLeftTriangle.adjacent, centery - innerLeftTriangle.opposite),
                     'z'
                   ))
      }

      return {
        boring: {
          draw: function(svg) {
            return svg.append('path')
                   .attr('class', 'selector')
                   .attr('d', sp(
                     'M', p(centerx, centery),
                     'm', p(-selectionRadius, 0),
                     'l', p(-outofsight, 0),
                     'l', p(0, -outofsight),
                     'l', p(2 * outofsight + 2 * selectionRadius, 0),
                     'l', p(0, outofsight),
                     'l', p(-outofsight, 0),
                     'a', p(hquarter, hquarter), '0', '0,0', p(-selectionRadius * 2, 0),
                     'z'
                   ))
          },
          tolerance: 90
        },
        challenging: {
          draw: function(svg) {
            return drawNarrowSelector(svg, this.tolerance)
          },
          tolerance: 45.0 / 2
        },
        easy: {
          draw: function(svg) {
            return drawNarrowSelector(svg, this.tolerance)
          },
          tolerance: 45.0
        },
        insane: {
          draw: function(svg) {
            return drawNarrowSelector(svg, this.tolerance)
          },
          tolerance: 3
        },
        nerdy: {
          draw: function(svg) {
            return drawNarrowSelector(svg, this.tolerance)
          },
          tolerance: 45.0 / 4
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

    var centerx = $w.width()/2;
    var centery = hhalf;

    var destinationRadius = 20
    var destinationCircle = interactSvg
                            .append('circle')
                            .attr('cx', centerx)
                            .attr('cy', centery)
                            .attr('r', destinationRadius)
                            .classed("destination", true)

    $.map(getSelectors(), function(value, key) {
      return $.extend({id: key}, value)
    }).sort(function(a, b) {
      return a.tolerance < b.tolerance
    }).forEach(function(selector) {
      var innerDiv = $('<div></div>').appendTo('div#difficulty')
      var button = $('<button value="' + selector.id + '">' + selector.id + '</button>').appendTo(innerDiv)
      button.click(function() {
        api.cleanupCurrentSelector()
        api.setSelector(selector.id)
        api.useCurrentSelector()
      })
    })

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
      return radian_angle * 180 / Math.PI
    }

    function updateDestination(label) {
      $('#destination').text("In which direction is " + label + "?")
    }

    function insertRoseSvg(roseElement) {
      var $roseDiv = $('<div id="rosediv"></div').appendTo('body')
      $roseDiv
      .height(hhalf)
      .addClass("rose")
      .css({
        top: centery - hquarter,
        left: centerx - hquarter
      })
      var $svg = $(roseElement).appendTo($roseDiv)
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

    function giveFeedbackAndStartNewRound(angle, selector) {
      selector.unbind()
      var actual = getTransformedGeoAngle()
      var difference = roseutils.angleDifference(angle, actual)
      var cleanupSuccessFeedback = (
        (difference < selector.tolerance) ?
          indicateSuccess() :
          indicateFailure(difference - selector.tolerance)
      )
      var cleanupDestinationFeedback = indicateDestination()
      setTimeout(function() {
        cleanupSuccessFeedback()
        cleanupDestinationFeedback()
        api.startNewRound()
      }, 3000)
    }

    function reactToMouseMovementAndClicks(selector) {
      var angle = [0]
      function onMouseMove (e) {
        var selectorSvg = selector.svg
        if (selectorSvg !== undefined) {
          angle[0] = angleTo(e.clientX, e.clientY)
          selectorSvg.attr(
            "transform",
            "rotate(" + (angle[0] + 90) + "," + centerx + "," + centery + ")")
        }
      }

      function onClick(e) {
        giveFeedbackAndStartNewRound(angle[0], selector)
      }

      var $roseDiv = $('div#rosediv')
      $roseDiv.on('mousemove', onMouseMove)
      $roseDiv.on('click', onClick)
      $interactDiv.on('mousemove', onMouseMove)
      $interactDiv.on('click', onClick)

      return function() {
        $interactDiv.off('mousemove', onMouseMove)
        $interactDiv.off('click', onClick)
        $roseDiv.off('mousemove', onMouseMove)
        $roseDiv.off('click', onClick)
      }
    }

    var api = Object.create({
      loadAndStartGame: function() {
        var that = this;
        d3.xml("images/rose.svg", "image/svg+xml", function(xml) {
          insertRoseSvg(xml.documentElement)
          that.setSelector('easy')
          that.startNewRound()
        })
      },
      cleanupCurrentSelector: function() {
        this.selector.unbind()
        this.selector.svg.remove()
        this.selector.svg = undefined
      },
      setSelector: function(id) {
        var selected = getSelectors()[id]
        $('div#difficulty').find('button.active').removeClass('active')
        $('div#difficulty').find('button[value="' + id + '"]').addClass("active")
        this.selector = selected
      },
      useCurrentSelector: function() {
        var selected = this.selector
        selected.unbind = reactToMouseMovementAndClicks(selected)
        selected.svg = selected.draw(interactSvg, centerx, centery)
      },
      startNewRound: function() {
        if (this.selector.svg) {
          api.cleanupCurrentSelector()
        }
        this.useCurrentSelector()
        geo.chooseNewDestination()
        updateDestination(geo.destination.label)
      }
    })

    return api
  }
)