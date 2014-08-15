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

        var $div = $('<div></div').appendTo('body')
        $div
        .height($w.height()/2)
        .width("100%") //$w.width()/2)
        .addClass("rose")
        .css({
          top: ($w.height()/4) | 0,
          left: 0 //($w.width()/4) | 0
        })
        var $svg = $(xml.documentElement).appendTo($div)
        var originalHeight = $svg.height()
        var svg = d3.select('svg')
                  .attr("height", "100%")
                  .attr("width", "100%")
                  .attr("viewBox", "0 0 800 800")
                  .attr("preserveAspectRatio", "xMidYMid meet")
                  // .attr('height', $w.height())
                  // .attr('width', $w.width())
        // svg.select('g')
        //           .transition().duration(0).delay(0)
        // .attr("transform", translateRose(svg) + " " + scaleRose(originalHeight))

        var interactDiv = $('<div id="interact"></div>').appendTo('body')
        var interact = d3.select('div#interact').append('svg')
                       .attr("id", "interact")
                       .attr("height", "100%")
                       .attr("width", "100%")
                       .attr("viewBox", "0 0 " + ($w.width() | 0) + " " + ($w.height() | 0))
                       .attr("preserveAspectRatio", "xMidYMid meet")
        interact.append('circle')
        .attr("class", "selector")
        .attr("cx", $w.width()/2)
        .attr("cy", $w.height()/2)
        .attr("r", $w.height()/4 + "px")

      })
    })
  }
)