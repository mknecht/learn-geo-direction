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

    var roseApi = rose(centerx, centery)
    var selectorApi = selectors(
      interactSvg, [$interactDiv, roseApi.getRoseDiv()], centerx, centery)
    var evaluationApi = evaluation(interactSvg, centerx, centery)
    var challengerApi = challenger()

    function giveFeedbackAndStartNewRound(angle, selector) {
      selector.unbind()
      var cleanupFeedback = evaluationApi.giveFeedback(angle, selector.tolerance)
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
            selectorApi.showMenu()
            selectorApi.setSelector('easy')
            that.startNewRound()
          }, 4000)
        })
      },
      startNewRound: function() {
        selectorApi.cleanupCurrentSelector()
        selectorApi.startCurrentSelector(giveFeedbackAndStartNewRound)
        geo.chooseNewDestination()
        challengerApi.updateQuestion(geo.destination.label)
      }
    }

    return api
  }
)
