import {Coords} from '../providers/bus-provider/bus';

export function gpsDist(p: Coords, q: Coords) {
  var toRad = function(degrees: number) {
    //radians = degrees * PI / 180
    return degrees * 0.0174532925199433;
  }

  var R = 6378.1370; // km
  var dLat = toRad(p.lat - q.lat);
  var dLong = toRad(p.long - q.long);
  var pLat = toRad(p.lat);
  var qLat = toRad(q.lat);

  // haversine(theta) = sine(theta/2) * sine(theta/2)
  var x = Math.sin(dLat / 2);
  var hSinLat = x * x;
  var y = Math.sin(dLong / 2);
  var hSinLong = y * y;
  var a = hSinLat + hSinLong * Math.cos(pLat) * Math.cos(qLat)

  // var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //         Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(pLat) * Math.cos(qLat);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = 1000 * R * c; //meter

  return d;
}


export function copyPosition(from: any, to:any) {
  to.lat = from.coords.latitude;
  to.long = from.coords.longitude;
  to.accuracy = from.coords.accuracy;
  to.heading = from.coords.heading;
  to.speed = from.coords.speed;
  to.timeStamp = from.timestamp;
  to.altitude = from.coords.altitude;
  to.altitudeAccuracy = from.coords.altitudeAccuracy;
}