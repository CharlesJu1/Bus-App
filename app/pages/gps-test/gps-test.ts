import {Page, NavController} from 'ionic-angular';
import {BLineRoute, BStop, Coords} from '../../providers/bus-provider/bus';
import {logError} from '../../util/logUtil';
import {gpsDist, copyPosition} from '../../util/mathUtil';
//import * as Promise from 'bluebird';

/*
  Generated class for the GpsTestPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/gps-test/gps-test.html',
})


export class GpsTestPage {

  lat: number;
  long: number;
  accuracy: number;
  altitude: number;
  heading: number;
  speed: number;
  timeStamp: number;
  altitudeAccuracy: number;
  startTime: number;
  endTime: number;
  timeLength: number;
  distance: number;

  currentPoint:any = {};

  startPoint:any = {};
  startPointSet: Boolean = false;

  p1: any = {};
  p2: any = {};
  p3: any = {};

  updateInterval: any;
  updateWatch: any;


  constructor(public nav: NavController) { }

  // copyPosition(from:any, to:any) {
  //   to.lat = from.coords.latitude;
  //   to.long = from.coords.longitude;
  //   to.accuracy = from.coords.accuracy;
  //   to.heading = from.coords.heading;
  //   to.speed = from.coords.speed;
  //   to.timeStamp = from.timestamp;
  //   to.altitude = from.coords.altitude;
  //   to.altitudeAccuracy = from.coords.altitudeAccuracy;
  // }

  getOneAvgPosition()
  {
    // var pAll = [];
    // var p;
    // for (var i = 0; i < 3; i++) {
    //   console.log(i);
    //   p = new Number(i + 5);
    //   pAll.push(p);
    // }

    // for (var i = 0; i < 3; i++) {
    //   console.log(pAll[i]);
    // }

    var pAll = []; // Promise Array
    var p;
    var that = this;

    var getGPS = function(resolve, reject) {
      var t = new Date().getTime();
      console.log('getGPS time=' + t);
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    };

    var getGPS1 = function(resolve, reject) {
      var t = new Date().getTime();
      console.log('getGPS time=' + t);
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    };

    var getGPS2 = function(resolve, reject) {
      var t = new Date().getTime();
      console.log('getGPS time=' + t);
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    };

    var getGPS3 = function(resolve, reject) {
      var t = new Date().getTime();
      console.log('getGPS time=' + t);
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    };

    // for (var i = 0; i < 3; i++) {
    //   console.log(i);
    //   p = new Promise(function(resolve, reject) {
    //     setTimeout(function() { getGPS(resolve, reject) }, 5000*i);
    //   });

    //   pAll.push(p);
    // }

    var p1 = new Promise(function(resolve, reject) {
      var r1 = resolve;
      var j1 = reject;
      setTimeout(function() { getGPS1(r1, j1) }, 100 * 1);
      //setTimeout(function() { getGPS1(r1, j1) }, 100 * 1);
    });

    pAll.push(p1);

    var p2 = new Promise(function(resolve, reject) {
      var r2 = resolve;
      var j2 = reject;
      setTimeout(function() { getGPS2(r2, j2) }, 100 * 2);
    });

    pAll.push(p2);

    var p3 = new Promise(function(resolve, reject) {
      var r3 = resolve;
      var j3 = reject;
      setTimeout(function() { getGPS3(r3, j3) }, 100 * 3);
    });

    pAll.push(p3);

    console.dir(pAll);
    console.log('wait for resolve');

    // var p1 = new Promise(function(resolve, reject) {
    //       setTimeout(resolve, 1000, 1)
    //     });
    //     console.dir(p1);
    //     pAll.push(p1);
    //     console.dir(pAll);
    //     console.log('p1');
    
    // var p2 = new Promise(function(resolve, reject) {
    //       setTimeout(resolve, 3000, 2)
    //     });
    //     console.dir(p2);
    //     pAll.push(p2);
    //     console.dir(pAll);
    //     console.log('p2');

    Promise.all(pAll).then(function(positions) {
      copyPosition(positions[0], that.p1);
      copyPosition(positions[1], that.p2);
      copyPosition(positions[2], that.p3);

      console.log('resolved all');
      console.dir(positions);
      console.log('length=' + positions.length);
      for (var j = 0; j < positions.length; j++) {
        var position = positions[j];
        console.log('j xxxx =' + j);
        console.dir(position);
        //setTimeout(function() { console.dir(position); }, 2000);
        //setTimeout(function() { copyPosition(positions[i], that); }, 2000);
        //console.dir(positions[i]);
        console.log('xxx ' + j);
      }
    }, function(err) { console.log(err); });

    // var pAll = []; // Promise Array
    // var p;
    // var that = this;
    // for (var i = 0; i < 3; i++) {
    //   console.log(i);
    //   setTimeout(function() {
    //     console.log('i=' );
    //     p = new Promise(function(resolve, reject) {
    //       navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    //     });
    //     pAll.push(p);
    //   }, i * 1000);
    // }

    // Promise.all(pAll).then(function(positions) {
    //   console.log('resolved all');
    //   console.dir(positions);
    //   for (var i = 0; i < positions.length; i++) {
    //     var position = positions[i];
    //     console.dir(position);
    //     //setTimeout(function() { console.dir(position); }, 2000);
    //     //setTimeout(function() { copyPosition(positions[i], that); }, 2000);
    //     //console.dir(positions[i]);
    //     console.log('xxx ' + i);
    //   }

    // }, function(err) { console.log(err); });
  }


  updatePositionPromise() {

    var that = this;
    var update = function(position) {
      copyPosition(position, that);
      copyPosition(position, that.currentPoint);

      console.log('GpsTestPage:updatePosition position =' + JSON.stringify(position));
      that.endTime = new Date().getTime();
      that.timeLength = that.endTime - that.startTime;
      console.log('Updating GPS position time:' + that.endTime);
      return 5;
    };

    this.startTime = new Date().getTime();
    console.log('Getting GPS position. Time=' + this.startTime);

    var p = new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    });

    p.then(update, logError('fail')).then(function(value) {console.log('value=' + value)});
  }

  updatePosition() {
    var update = function(position) {
      copyPosition(position, this);
      copyPosition(position, this.currentPoint);

      console.log('GpsTestPage:updatePosition position =' + JSON.stringify(position));
      this.endTime = new Date().getTime();
      this.timeLength = this.endTime - this.startTime;
      console.log('Updating GPS position time:' + this.endTime);
    };
    this.startTime = new Date().getTime();
    console.log('Getting GPS position. Time=' + this.startTime);
    navigator.geolocation.getCurrentPosition(update.bind(this), logError('updatePosition: '),
      { enableHighAccuracy: true });
  }

  startUpdatePositionInterval() {
    var update = function(position) {
      copyPosition(position, this);
      copyPosition(position, this.currentPoint);

      if (this.startPointSet) {
        this.distance = gpsDist({ lat: this.currentPoint.lat, long: this.currentPoint.long },
          { lat: this.startPoint.lat, long: this.startPoint.long }); 
      }

      console.log('GpsTestPage:updatePosition position =' + JSON.stringify(position));
      this.endTime = new Date().getTime();
      this.timeLength = this.endTime - this.startTime;
      console.log('Updating GPS position time:' + this.endTime);
    };


    this.updateInterval = setInterval(() => {
      this.startTime = new Date().getTime();
      console.log('Getting GPS position. Time=' + this.startTime);
      //check https://github.com/apache/cordova-plugin-geolocation for details
      navigator.geolocation.getCurrentPosition(update.bind(this), logError('updatePosition: '), { enableHighAccuracy: true });
    }, 1000);
  }

  stopUpdatePositionInterval() {
    clearInterval(this.updateInterval);
  }

  setStartPoint () {
    copyPosition(this, this.startPoint);
    this.startPointSet = true;
  }

}
