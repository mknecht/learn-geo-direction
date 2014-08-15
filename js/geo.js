define(
  ['mtlatlon'],
  function(LatLon) {
    function choose(items) {
      return items[(Math.random() * items.length) | 0]
    }

    var london = LatLon(51.507222, -0.1275)
    var origin = london

    var destinations = [
      {label: "Cape Town", loc: LatLon(-33.925278, 18.423889)},
      {label: "Castletown", loc: LatLon(54.074167, -4.653889)},
      {label: "Hastings", loc: LatLon(50.856302, 0.572875)},
      {label: "New York", loc: LatLon( 43, -75)},
      {label: "Paris", loc: LatLon(48.8567, 2.3508)},
      {label: "Warsaw", loc: LatLon( 52.233333, 21.016667)}
    ]

    return {
      chooseNewDestination: function() {
        this.destination = choose(destinations)
        return this.destination
      },
      getAngle: function() {
        return origin.bearingTo(this.destination)
      }
    }
  }
)