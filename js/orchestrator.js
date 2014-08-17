define(
  ['jquery', 'd3', 'geo', 'roseutils', 'evaluation', 'selectors', 'challenger', 'rose'],
  function($, d3, geo, roseutils, evaluation, selectors, challenger, rose) {
    var $w = $(window)

    var hfull = $w.height()
    var hhalf = (hfull / 2) | 0;
    var hquarter = (hhalf / 2) | 0;

    var $interactDiv = $('div#interact')
    var interactSvg = d3.select('svg#interactsvg')
                      .attr("viewBox", "0 0 " + ($w.width() | 0) + " " + hfull)

    var centerx = $w.width()/2;
    var centery = hhalf;

    var geoApi = geo('rhumb')
    var roseApi = rose(centerx, centery)
    var selectorApi = selectors(
      interactSvg, [$interactDiv, roseApi.getRoseDiv()], centerx, centery, geoApi)
    var evaluationApi = evaluation(interactSvg, centerx, centery)
    var challengerApi = challenger()

    function getTransformedGeoAngle() {
      return geoApi.getAngle() - 90  // 0 is north for geo-angles
    }

    function giveFeedbackAndStartNewRound(chosenAngle, selector) {
      selector.unbind()
      var cleanupFeedback = evaluationApi.giveFeedback(getTransformedGeoAngle(), chosenAngle, selector.tolerance)
      setTimeout(function() {
        cleanupFeedback()
        api.startNewRound()
      }, 3000)
    }

    var api = {
      loadAndStartGame: function() {
        var that = this;
        selectorApi.drawButtons(function(selector) {
          selectorApi.cleanupCurrentSelector()
          selectorApi.setSelector(selector.id)
          selectorApi.startCurrentSelector(giveFeedbackAndStartNewRound)
        })

        roseApi.loadExternalSvg(function() {
          var cleanupGreeting = challengerApi.greet()
          setTimeout(function() {
            cleanupGreeting()
            $('#menu').show()
            selectorApi.setSelector('easy')
            that.startNewRound()
          }, 4000)
        })
      },
      startNewRound: function() {
        selectorApi.cleanupCurrentSelector()
        geoApi.chooseNewDestination()
        selectorApi.startCurrentSelector(giveFeedbackAndStartNewRound)
        challengerApi.updateQuestion(geoApi.destination.label)
      }
    }

    return api
  }
)
