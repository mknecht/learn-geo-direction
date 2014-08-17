define(['jquery', 'roseutils'], function($, roseutils) {
  var $w = $(window)
  var hfull = $w.height()
  var hhalf = (hfull / 2) | 0;
  var hquarter = (hhalf / 2) | 0;

  var $menuDiv = $('div#difficulty')

  var selectionRadius = hquarter + 5;

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

    function drawNarrowSelector(svg, angle, centerx, centery) {
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
        draw: function(svg, centerx, centery) {
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
        draw: function(svg, centerx, centery) {
          return drawNarrowSelector(svg, this.tolerance, centerx, centery)
        },
        tolerance: 45.0 / 2
      },
      easy: {
        draw: function(svg, centerx, centery) {
          return drawNarrowSelector(svg, this.tolerance, centerx, centery)
        },
        tolerance: 45.0
      },
      insane: {
        draw: function(svg, centerx, centery) {
          return drawNarrowSelector(svg, this.tolerance, centerx, centery)
        },
        tolerance: 3
      },
      nerdy: {
        draw: function(svg, centerx, centery) {
          return drawNarrowSelector(svg, this.tolerance, centerx, centery)
        },
        tolerance: 45.0 / 4
      }
    }
  }

  function angleTo(centerx, centery, x, y) {
    var a = y - centery
    var b = x - centerx
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

  function reactToMouseMovementAndClicks(elements, centerx, centery, onSelect, selector) {
    var angle = [0]
    function onMouseMove (e) {
      var selectorSvg = selector.svg
      if (selectorSvg !== undefined) {
        angle[0] = angleTo(centerx, centery, e.clientX, e.clientY)
        selectorSvg.attr(
          "transform",
          "rotate(" + (angle[0] + 90) + "," + centerx + "," + centery + ")")
      }
    }

    function onClick(e) {
      onSelect(angle[0], selector)
    }

    var $roseDiv = $('div#rosediv')
    elements.forEach(function(it) {
      it.on('click', onClick)
      it.on('mousemove', onMouseMove)
    })

    return function() {
      elements.forEach(function(it) {
        it.off('click', onClick)
        it.off('mousemove', onMouseMove)
      })
    }
  }

  return function(interactSvg, elements, centerx, centery) {
    return {
      cleanupCurrentSelector: function() {
        /** May be called at the beginning, so needs to be robust. */
        if (this.selector.unbind !== undefined) {
          this.selector.unbind()
        }
        if (this.selector.svg !== undefined) {
          this.selector.svg.remove()
          this.selector.svg = undefined
        }
      },
      drawButtons: function(onClick) {
        var that = this
        $.map(getSelectors(), function(value, key) {
          return $.extend({id: key}, value)
        }).sort(function(a, b) {
          return a.tolerance < b.tolerance
        }).forEach(function(selector) {
          var innerDiv = $('<div></div>').appendTo($menuDiv)
          var button = $('<button value="' + selector.id + '">' + selector.id + '</button>').appendTo(innerDiv)
          button.click(function() {
            onClick(selector)
          })
        })
      },
      setSelector: function(id) {
        var selected = getSelectors()[id]
        $('div#difficulty').find('button.active').removeClass('active')
        $('div#difficulty').find('button[value="' + id + '"]').addClass("active")
        this.selector = selected
      },
      showMenu: function() {
        $menuDiv.show()
      },
      startCurrentSelector: function(onSelect) {
        var selected = this.selector
        selected.unbind = reactToMouseMovementAndClicks(elements, centerx, centery, onSelect, selected)
        selected.svg = selected.draw(interactSvg, centerx, centery)
      }
    }
  }
})