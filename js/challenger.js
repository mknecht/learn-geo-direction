define(
  ['jquery', 'roseutils'],
  function($, roseutils) {
    return function() {
      var $question = $('#question')
      var greetings = [
          "You are just passing Big Ben.",
          "You just bumped into Windsor Castle.",
          "You are weeping for Liù, leaving Royal Albert Hall."
      ]

      return {
        greet :function() {
          var top = $('#banner').css('top')
          $('#banner').css('top', "10%")
          $('#banner').append(roseutils.choose(greetings) + '<br>In <span class="origin">London</span>.<br>A tourist approaches.')
          $('#fog').show()
          return function() {
            $('#fog').hide()
            $('#banner').css('top', top)
          }
        },
        updateQuestion: function(label) {
          $question.text("Which direction is " + label + "?")
        }
      }
    }
  }
)
