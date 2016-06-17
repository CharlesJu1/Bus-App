import {Page, NavController} from 'ionic-angular';
import * as io from 'socket.io-client';
import {AppSetting} from '../../app-setting';
import {BLinePosition} from '../../providers/bus-provider/bus';
import {gpsDist} from '../../util/mathUtil';
import {UpdatePositionPage} from '../update-position/update-position';
import {GpsTestPage} from '../gps-test/gps-test';

declare var cordova: any;
/*
  Generated class for the ShowPositionPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/show-position/show-position.html',
})
export class ShowPositionPage {
  bLinePosition = new BLinePosition();
  private socket: any;
  constructor(public nav: NavController, public appSetting: AppSetting) { 
  }

  //Connect to server with socketIO to receive position update from server
  connectServer() {
    var self = this;
    // Socket IO has namespace and within each namespace there are rooms (channels). 
    // Users need to see real time bus locations. Users connect to passenger namespace via socket IO.
    // Drivers can either use REST Api to update bus position, or connect to driver namespace via socket IO.
    // Driver namespace is not implemented yet.
 
    // Use websocket for socket IO first, if not implmented by browser, use polling.
    this.socket = io.connect(this.appSetting.webApiServer + '/passenger', {transports: ['websocket', 'polling']});

    console.debug('socket transport' + this.socket.io.engine.transport.name);
    console.log('socket transport' + this.socket.io.engine.transport.name);
    console.dir(this.socket);
    console.log('connecting to webApiServer with socket IO' + this.socket);

    this.socket.on('broadcast position', function(data) {
      var t = new Date().getTime();
      console.log('time:' + t);
      console.log('got location from server for bus:' + JSON.stringify(data));
      self.bLinePosition.city = data.city;
      self.bLinePosition.line = data.line;
      self.bLinePosition.plate = data.plate;
      self.bLinePosition.position.coords.lat = data.position.coords.lat;
      self.bLinePosition.position.coords.long = data.position.coords.long;
      self.bLinePosition.position.heading = data.position.coords.heading;
      self.bLinePosition.position.speed = data.position.coords.speed;
    });
  }

  disconnectServer() {
    console.log('socket.io disconnecting');
    this.socket.disconnect();
  }

  // TODO Need to take the city, line parameter from user input
  registerPositionUpdate() {
    console.log('register positionUpdate {city: ZH, line: 88}');
    this.socket.emit('register positionUpdate', {city: 'ZH', line: 88});
  }

  unregisterPositionUpdate() {
    this.socket.emit('unregister positionUpdate', { city: 'ZH', line: 88 });
  }

  registerPermission = function() {
      cordova.plugins.notification.local.registerPermission(function(granted) {
      console.log('granted' + granted);
    });
  };


  scheduleNotification() {

    var now = new Date().getTime(),
      _5_sec_from_now = new Date(now + 5 * 1000);

    //var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
    var sound = 'file://audio/beep.caf';
    cordova.plugins.notification.local.schedule({
      id: 1,
      text: 'Test Message 1111i11',
      sound: sound,
      at: _5_sec_from_now,
      //icon and smallIcon only works on android.
      icon: 'file://img/Hillary.png',
      smallIcon: 'res://cordova',
      data: { test: 5}
    });
  };

  gpsDistance() {
    var p1 = { lat: 22.25297098451076, long: 113.5822988527495};
    var q1 = { lat: 22.25291620476381, long: 113.5822147597685};
    var q2 = { lat: 22.25314410871104, long: 113.5821985826954};


    var t = gpsDist(p1, q1);
    console.log('gpsDist p1 q1 =' + t);

    var t1 = gpsDist(p1, q2);
    console.log('gpsDist p1 q2 =' + t1);

    var t2 = gpsDist(p1, p1);
    console.log('gpsDist p1 p1 =' + t2);
  }


  gotoUpdatePositionPage() {
    this.nav.push(UpdatePositionPage);
  }
  gotoGpsTestPage() {
    this.nav.push(GpsTestPage);
  }
}
