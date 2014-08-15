/*global jQuery */

require.config({
  baseUrl: './',
  paths: {
    d3: 'bower_components/d3/d3.min',
    jquery: 'bower_components/jquery/dist/jquery.min'
  }
});

require(
  ['jquery', 'd3'],
  function($, d3) {
    function sp() {
      return $.extend([], arguments).join(" ")
    }

    function p(x, y) {
      return "" + x + " " + y
    }

    $(function() {

      var $w = $(window)

      var hfull = $w.height()
      var hhalf = (hfull / 2) | 0;
      var hquarter = (hhalf / 2) | 0;

      var $interactDiv = $('<div id="interact"></div>').appendTo('body')
      var interact = d3.select('div#interact').append('svg')
                     .attr("id", "interact")
                     .attr("height", "100%")
                     .attr("width", "100%")
                     .attr("viewBox", "0 0 " + ($w.width() | 0) + " " + hfull)
                     .attr("preserveAspectRatio", "xMaxYMax meet")

      var centerx = hhalf;
      var centery = hhalf;
      var selectionRadius = hquarter + 5;
      var outofsight = Math.max($w.width(), $w.height()) * 2

      var selector = interact.append('path')
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

      $('body').mousemove(function(e) {
        var angle = angleTo(e.clientX, e.clientY)
        selector.attr(
          "transform",
          "rotate(" + angle + "," + centerx + "," + centery + ")")
      })

      d3.xml("images/rose.svg", "image/svg+xml", function(xml) {
        var $rosediv = $('<div id="rosediv"></div').appendTo('body')
        $rosediv
        .height(hhalf)
        .width("50%")
        .addClass("rose")
        .css({
          top: hquarter,
          left: hquarter
        })
        var $svg = $(xml.documentElement).appendTo($rosediv)
        var roseSvg = d3.select('#rosediv').select('svg')
                      .attr("height", hhalf)
                      .attr("width", hhalf)
                      .attr("viewBox", "0 0 800 800")
                      .attr("preserveAspectRatio", "xMidYMid meet")
      })
    })
  }
)