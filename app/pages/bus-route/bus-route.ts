import {Page, Alert, NavController} from 'ionic-angular';
import {logError, overWriteFile, readFile} from '../../util/logUtil';
import {BLineRoute, BStop, Coords} from '../../providers/bus-provider/bus';
import {Input} from 'angular2/core';
import {BusProvider} from '../../providers/bus-provider/bus-provider';
import {FileListPage} from '../file-list/file-list';

/*
  Generated class for the BusRoutePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


declare var window: any;
declare var LocalFileSystem: any;

@Page({
  templateUrl: 'build/pages/bus-route/bus-route.html',
})
export class BusRoutePage {
  
  @Input() busStop: BStop = new BStop();
  busGps: Coords = new Coords();
  busLineRoute: BLineRoute = new BLineRoute();

  public busLineRtFromFile: string = 'this is some text';

  public fileNameforSave: string = "test.txt";

  recordBusRouteInterval: any;
  data: any;

  public root:any;

  constructor(public nav: NavController, private busProvider: BusProvider) {
    this.data = {};
    this.data.lineName = '18A3';
    this.data.recordButtonName = '开始'
    this.data.busCount = 0;
    this.data.gpsCount = 0;

    setTimeout(() => { this.busLineRtFromFile = 'new text'; console.log('xxxx=' + this.busLineRtFromFile); }, 5000);
  }

  recordButton() {
    console.log(this.data.lineName);

    if(this.data.recordButtonName == '开始'){

         this.InputFileName();
         
　　　　}else if(this.data.recordButtonName == '停止'){
	    this.data.recordButtonName = '开始'
　　　　　　　this.stopRecord();
　　　　}　　　　
  }

　　startRecord(){
	 this.busStop = new BStop();
	    this.busGps = new Coords();
	    // Only reset the route array. Keep the city and line no.
	    this.busLineRoute.resetRoute();

	     var recordBusRouteCb = function(position) {
	      this.data.lon = position.coords.longitude;
	      this.data.lat = position.coords.latitude;
	      this.busGps.lat = position.coords.latitude;
	      this.busGps.long = position.coords.longitude;
	      this.busLineRoute.addPathCoords(this.busGps);
	      this.data.gpsCount = this.busLineRoute.path.length;
	    };

	    
	    this.recordBusRouteInterval = setInterval(() => {
	      navigator.geolocation.getCurrentPosition(recordBusRouteCb.bind(this), logError('addBusStop: '));
	    }, 1000);
  }

  stopRecord(){
  	  clearInterval(this.recordBusRouteInterval);
    　　console.log('route is:' + JSON.stringify(this.busLineRoute));
  }
　　

  addBusStop() {
    var addBusStopCb = function(position) {
      console.log('addBusStop success'+position.coords.latitude);
      this.busStop.coords.lat = position.coords.latitude;
      this.busStop.coords.long = position.coords.longitude;
      this.busStop.name = this.data.stop;
      this.busLineRoute.addStop(this.busStop);
      this.data.busCount = this.busLineRoute.stops.length;
    };

    console.log('busStop Name' + JSON.stringify(this.data.stop));
    navigator.geolocation.getCurrentPosition(addBusStopCb.bind(this), logError('addBusStop: '));
  }


   saveBusRoute() {
   	 if(this.data.recordButtonName == '停止'){
	     this.data.recordButtonName = '开始'
　　　     this.stopRecord();
     }

     var that = this;
     var busRte = this.busLineRoute;
     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
       console.log('file system open: ' + fs.name);
       fs.root.getFile(that.fileNameforSave, { create: true, exclusive: false }, function (fileEntry) {

          console.log("fileEntry is file?" + fileEntry.isFile.toString());
          console.log('bus in saveBusRoute' + JSON.stringify(busRte));
          overWriteFile(fileEntry, JSON.stringify(busRte));
       }, function(error) {});
     }, function(error) {});

     console.log('readBusRoute ======================================================================================');

     //this.readBusRoute();
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
      fs.root.getFile(that.fileNameforSave, { create: false }, function(fileEntry) {

        console.log("fileEntry is file?" + fileEntry.isFile.toString());
        // fileEntry.name == 'someFile.txt'
        // fileEntry.fullPath == '/someFile.txt'
        readFile(fileEntry, readFileCb);
      }, function(error) { });
    }, function(error) { });
  }


  uploadBusRoute(){
  	 this.nav.push(FileListPage);
  } 

  InputFileName(){

    let prompt = Alert.create({
      title: '路线文件名',
      message: "请输入路线文件名以便保存数据线信息",
      inputs: [
        {
          name: 'fileName',
          placeholder: '文件名',
          value: this.data.lineName + '_'
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
    		this.fileNameforSave = this.data.lineName + '_';
            console.log('取消');
          }
        },
        {
          text: '保存',
          handler: data => {
             this.fileNameforSave = data.fileName + ".txt";
             if(this.fileNameforSave == (this.data.lineName + '_' + ".txt")){
         	   return;
             } else{

	　　　         this.data.recordButtonName = '停止'
                this.startRecord();

             }
          }
        }
      ]
    });
    this.nav.present(prompt);
  }

  getDirectionFilelist(path){
    var that = this; 
	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
		function(fileSystem){ // success get file system
			//this.root = fileSystem.root;
			console.log(fileSystem.root);
			that.listDir(fileSystem.root);
		}, function(evt){ // error get file system
			console.log("File System Error: "+evt.target.error.code);
		}
	);


  }


  listDir(directoryEntry){

	if( !directoryEntry.isDirectory )
	{ 
		console.log('listDir incorrect type');
		return;
	}
	
	
	var directoryReader = directoryEntry.createReader();
	directoryReader.readEntries(function(entries){
		
		var fileArr = new Array();
		for(var i=0; i<entries.length; ++i){ // sort entries
			var entry = entries[i];
		    if( entry.isFile && entry.name[0] != '.' ) {
		    	//fileArr.push(entry);
		    	console.log('fileName='+entry.name);
		    }
		}
	 });
  }

}
