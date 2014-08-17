define(
  ['jquery'],
  function($) {

    return function() {
      var $destination = $('#destination')

      return {
        updateQuestion: function(label) {
          $destination.text("In which direction is " + label + "?")
        }
      }
    }
  }
)
