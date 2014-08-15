/*global jQuery */

require.config({
  baseUrl: './',
  paths: {
    d3: 'bower_components/d3/d3.min',
    jquery: 'bower_components/jquery/dist/jquery.min'
    // mtlatlon: 'bower_components/MovableType-LatLon/mtlatlon'
  }
});

require(
  ['jquery', 'd3'],
  function($, d3, LatLon) {

    $(function() {
      function getSelectors() {
        function sp() {
          return $.extend([], arguments).join(" ")
        }

        function p(x, y) {
          return "" + x + " " + y
        }

        var selectionRadius = hquarter + 5;
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

      // London
      // var point_of_origin = LatLon(51.507222, -0.1275)

      // var destinations = [
      //   {label: "Cape Town", loc: LatLon(-33.925278, 18.423889)},
      //   {label: "Castletown", loc: LatLon(54.074167, -4.653889)},
      //   {label: "Hastings", loc: LatLon(50.856302, 0.572875)},
      //   {label: "New York", loc: LatLon( 43, -75)},
      //   {label: "Paris", loc: LatLon(48.8567, 2.3508)},
      //   {label: "Warsaw", loc: LatLon( 52.233333, 21.016667)},
      // ]

      function startNewRound() {

      }
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

      var selector = getSelectors().easy.draw(interact, centerx, centery)

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

      // load compass rose
      d3.xml("images/rose.svg", "image/svg+xml", function(xml) {
        insertRoseSvg(xml.documentElement)
        startNewRound();
      })

      // react to mousemovement
      $('body').mousemove(function(e) {
        var angle = angleTo(e.clientX, e.clientY)
        selector.attr(
          "transform",
          "rotate(" + angle + "," + centerx + "," + centery + ")")
      })

    })
  }
)