/*global jQuery, setTimeout */

define(
  ['jquery', 'd3', 'roseutils'],
  function($, d3, roseutils) {
    var $w = $(window)
    var hfull = $w.height()
    var hhalf = (hfull / 2) | 0;
    var hquarter = (hhalf / 2) | 0;
    var $roseDiv = $('<div id="rosediv"></div').appendTo('body')

    function insertRoseSvg(roseElement, centerx, centery) {
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

    return function(centerx, centery) {
      return {
        getRoseDiv: function() {
          return $roseDiv
        },
        loadExternalSvg: function(onFinish) {
          d3.xml("images/rose.svg", "image/svg+xml", function(xml) {
            insertRoseSvg(xml.documentElement, centerx, centery)
            onFinish()
          })
        }
      }
    }
  }
)