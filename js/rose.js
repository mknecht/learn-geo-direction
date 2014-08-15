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
        interact.append('circle')
        .attr("class", "selector")
        .attr("cx", hquarter) //$w.width()/2)
        .attr("cy", hquarter)
        .attr("r", hquarter)
        interact.append('circle')
        .attr("class", "selector")
        .attr("cx", hhalf) //$w.width()/2)
        .attr("cy", hhalf)
        .attr("r", hquarter)
        interact.append('circle')
        .attr("class", "selector")
        .attr("cx", hquarter) //$w.width()/2)
        .attr("cy", hquarter * 3)
        .attr("r", hquarter)
      interact.append('rect')
      .attr('class', 'testsvg')
      .attr('x', 800)
      .attr('y', 50)
      .attr('width', 200)
      .attr('height', 100)
      interact.append('line')
      .attr('class', 'testsvg')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 100)
      .attr('y2', 100)

      $('body').append('<div class="testdiv"></div>')
      // var $root = $('<svg></svg>')
      //             .appendTo('body')
      //             .attr('height', $w.height())
      //             .attr('width', $w.width())
      d3.xml("images/rose.svg", "image/svg+xml", function(xml) {
        function scaleRose(currentHeight) {
          return "scale(" + (($w.height()/ 2) / currentHeight) + ")"
        }

        function translateRose(svg) {
          return "translate(" + $w.width() + " " + $w.height() + ")"
        }

        var $rosediv = $('<div id="rosediv"></div').appendTo('body')
        $rosediv
        .height(hhalf)
        .width("100%")
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