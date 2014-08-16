define(
  function() {
    function toRadian(degrees) {
      return degrees / 180 * Math.PI
    }

    return {
      angleDifference: function(first, second) {
        var simpleDiff = Math.max(first, second) - Math.min(first, second)
        return (simpleDiff <= 180) ? simpleDiff : 180 - simpleDiff % 180
      },
      triangleByAngleAndRadius: function(degrees, radius) {
        var radian = toRadian(degrees)
        return {
          adjacent: Math.cos(radian) * radius,
          opposite: Math.sin(radian) * radius
        }
      },
      choose: function(items) {
        return items[(Math.random() * items.length) | 0]
      }
    }
  }
)