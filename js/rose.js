/*global jQuery */

require.config({
  baseUrl: 'bower_components/',
  paths: {
    d3: 'd3/d3.min',
    jquery: 'jquery/dist/jquery.min'
  }
});

require(
  ['jquery', 'd3'],
  function($, d3) {
    $(function() {
      d3.xml("images/rose.svg", "image/svg+xml", function(xml) {
        document.body.appendChild(xml.documentElement)
      })
    })
  }
)