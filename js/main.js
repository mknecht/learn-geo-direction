require.config({
  baseUrl: './',
  shim: {
    mtlatlon: {
      exports: 'LatLon'
    }
  },
  paths: {
    d3: 'bower_components/d3/d3.min',
    geo: 'js/geo',
    jquery: 'bower_components/jquery/dist/jquery.min',
    mtlatlon: 'bower_components/MovableType-LatLon/mtlatlon',
    rose: 'js/rose'
  }
});


require(['jquery', 'rose'], function($, rose) {
  $(function() {
    rose.loadGame()
    rose.startGame()
  })
})