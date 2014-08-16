define(
  ['mtlatlon', 'roseutils'],
  function(LatLon, roseutils) {
    var origin = {label: "London", loc: new LatLon(51.507222, -0.1275)}

    var destinations = [
      {label: "Cape Town", loc: new LatLon(-33.925278, 18.423889)},
      {label: "Castletown", loc: new LatLon(54.074167, -4.653889)},
      {label: "Hastings", loc: new LatLon(50.856302, 0.572875)},
      {label: "New York", loc: new LatLon( 43, -75)},
      {label: "Paris", loc: new LatLon(48.8567, 2.3508)},
      {label: "Warsaw", loc: new LatLon( 52.233333, 21.016667)}
    ]

    return {
      chooseNewDestination: function() {
        this.destination = roseutils.choose(destinations)
        return this.destination
      },
      getAngle: function() {
        return origin.loc.bearingTo(this.destination.loc)
      }
    }
  }
)