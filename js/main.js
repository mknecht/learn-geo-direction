require.config({
  baseUrl: './',
  shim: {
    mtlatlon: {
      exports: 'LatLon'
    }
  },
  paths: {
    challenger: 'js/challenger',
    d3: 'bower_components/d3/d3.min',
    evaluation: 'js/evaluation',
    geo: 'js/geo',
    jquery: 'bower_components/jquery/dist/jquery.min',
    mtlatlon: 'bower_components/MovableType-LatLon/mtlatlon',
    orchestrator: 'js/orchestrator',
    rose: 'js/rose',
    roseutils: 'js/roseutils',
    selectors: 'js/selectors',
    widgets: 'js/widgets.js'
  }
});


require(['jquery', 'orchestrator'], function($, orchestrator) {
  $(function() {
    orchestrator.loadAndStartGame()
  })
})