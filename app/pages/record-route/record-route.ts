import {Page, NavController} from 'ionic-angular';
import {BLineRoute, BStop, Coords} from '../../providers/bus-provider/bus';
import {BusProvider} from '../../providers/bus-provider/bus-provider';
import {Input} from 'angular2/core';
import {logError, overWriteFile, readFile} from '../../util/logUtil';
import {UpdatePositionPage} from '../update-position/update-position';
import {BaiduMapPage} from '../baidu-map/baidu-map';

declare var window: any;
declare var LocalFileSystem: any;

/*
  Generated class for the MyPagePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/record-route/record-route.html',
})
export class RecordRoutePage {
  @Input() busStop: BStop = new BStop();
  busCoords: Coords = new Coords();
  busLineRoute: BLineRoute = new BLineRoute();
  public busLineRtFromFile: string = 'this is some text';

  recordBusRouteInterval: any;
  constructor(public nav: NavController, private busProvider: BusProvider) { 
  
    setTimeout(() => { this.busLineRtFromFile = 'new text'; console.log('xxxx=' + this.busLineRtFromFile); }, 5000);
  }

  // getBusLocation() {
  //   console.log('getBusLocation');
  //   //this.busProvider.getBusLocation();
  // }

  // setBusLocation() {
  //   console.log('setBusLocation');
  //   //this.busProvider.setBusLocation(this.bus);
  // }

  startRecordBusRoute() {

    //clear the data
    this.busStop = new BStop();
    this.busCoords = new Coords();
    // Only reset the route array. Keep the city and line no.
    this.busLineRoute.resetRoute();

    var recordBusRouteCb = function(position) {
      //console.log('getBusPosition success');

      this.busCoords.lat = position.coords.latitude;
      this.busCoords.long = position.coords.longitude;
      this.busLineRoute.addPathCoords(this.busCoords);
    };

    console.log('recordBusRoute');

    this.recordBusRouteInterval = setInterval(() => {
      //check https://github.com/apache/cordova-plugin-geolocation for details
      navigator.geolocation.getCurrentPosition(recordBusRouteCb.bind(this), logError('addBusStop: '));
    }, 1000);
  }

  addBusStop() {
    var bStop: BStop = new BStop();
    bStop.name = this.busStop.name;
    var addBusStopCb = function(position) {
      bStop.coords.lat = position.coords.latitude;
      bStop.coords.long = position.coords.longitude;
      this.busLineRoute.addStop(bStop);
    };

    console.log('busStop Name' + JSON.stringify(this.busStop.name));
    navigator.geolocation.getCurrentPosition(addBusStopCb.bind(this), logError('addBusStop: '));
  }

  stopRecordBusRoute() {
    clearInterval(this.recordBusRouteInterval);
    console.log('stopRecordBusRoute: route is:' + JSON.stringify(this.busLineRoute));
  }

  saveBusRoute() {
    var busRte = this.busLineRoute;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      console.log('file system open: ' + fs.name);
      fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {

          console.log("fileEntry is file?" + fileEntry.isFile.toString());
          console.log('busRte in saveBusRoute' + JSON.stringify(busRte));
          overWriteFile(fileEntry, JSON.stringify(busRte));
      }, function(error) {});
    }, function(error) {});
  }

  test() {
    var that = this; 
    var update = function () {
      that.busLineRtFromFile = 'xxxxx test ';  
    }

    setTimeout(update, 1000);

  }
  readBusRoute() {
    var that = this;  // that is a reference to this (RecordRoutePage)
    var readFileCb = function(fileContent: string) {  
      that.busLineRtFromFile = fileContent;
      console.log('readBusRoute callback 111111: ' + that.busLineRtFromFile);
      console.log('readBusRoute callback: ' + that.busLineRtFromFile);
    }

    //check https://github.com/apache/cordova-plugin-file for details
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {

      console.log('file system open: ' + fs.name);
      fs.root.getFile("newPersistentFile.txt", { create: false }, function(fileEntry) {

        console.log("fileEntry is file?" + fileEntry.isFile.toString());
        // fileEntry.name == 'someFile.txt'
        // fileEntry.fullPath == '/someFile.txt'
        readFile(fileEntry, readFileCb);
      }, function(error) { });
    }, function(error) { });
  }

  uploadBusRoute() {
    var that = this;  // that is a reference to this (RecordRoutePage)
    var readFileCb = function(fileContent: string) {
      that.busProvider.uploadBusRoute(fileContent);
      console.log('uploadBusRoute callback: ' + fileContent);
    }

    //check https://github.com/apache/cordova-plugin-file for details
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
      console.log('file system open: ' + fs.name);
      fs.root.getFile("newPersistentFile.txt", { create: false }, function(fileEntry) {
        console.log("fileEntry is file?" + fileEntry.isFile.toString());
        readFile(fileEntry, readFileCb);
      }, function(error) { });
    }, function(error) { });
  }

  gotoUpdatePositionPage() {
    this.nav.push(UpdatePositionPage);
  }

  gotobaiduMapPage(){
    this.nav.push(BaiduMapPage);
  }

}



