define(
  ['jquery', 'mtlatlon', 'roseutils'],
  function($, LatLon, roseutils) {
    var origin = {label: "London", loc: new LatLon(51.507222, -0.1275)}

    var destinations = [
      {label: "Cape Town", loc: new LatLon(-33.925278, 18.423889)},
      {label: "Castletown", loc: new LatLon(54.074167, -4.653889)},
      {label: "Disneyland", loc: new LatLon(33.809, -117.919)},
      {label: "Fergburger in Queenstown, NZ", loc: new LatLon(-45.031111, 168.6625)},
      {label: "Fukushima", loc: new LatLon(37.316389, 141.025556)},
      {label: "Hastings", loc: new LatLon(50.856302, 0.572875)},
      {label: "Mumbai", loc: new LatLon(18.975, 72.825833)},
      {label: "New York", loc: new LatLon( 43, -75)},
      {label: "Paris", loc: new LatLon(48.8567, 2.3508)},
      {label: "Warsaw", loc: new LatLon( 52.233333, 21.016667)}
    ]

      var courseMethods = {
        rhumb: function(origin, destination) {
          return origin.loc.rhumbBearingTo(this.destination.loc)
        },
        true_: function(origin, destination) {
          return origin.loc.bearingTo(this.destination.loc)
        }
      }

    return function(methodname) {
      var api = {
        chooseNewDestination: function() {
          this.destination = roseutils.choose(destinations)
          return this.destination
        },
        getAngle: function() {
          return this.courseMethod(origin, this.destination)
        },
        setCourseMethod: function(id) {
          $('div#course').find('button.active').removeClass('active')
          $('div#course').find('button[value="' + id + '"]').addClass("active")
          this.courseMethod = courseMethods[id]
        }
      }

      $('div#course').find('button').click(function() {
        api.setCourseMethod($(this).attr('value'))
      })

      api.setCourseMethod(methodname)
      return api
    }
  }
)