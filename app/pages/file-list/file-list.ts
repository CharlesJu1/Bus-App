import {Page, NavController, NavParams} from 'ionic-angular';
import {logError, overWriteFile, readFile} from '../../util/logUtil';
import {BusProvider} from '../../providers/bus-provider/bus-provider';

/*
  Generated class for the FileListPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var window: any;
declare var LocalFileSystem: any;

@Page({
  templateUrl: 'build/pages/file-list/file-list.html',
})
export class FileListPage {

  selectedItem: any;
 
  items: Array<{title: string, checked: boolean}>;

  rootPath: string;

  constructor(private nav: NavController, navParams: NavParams, private busProvider: BusProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.items = [];

    this.getDirectionFilelist();
   
  }

  getDirectionFilelist(){
    var that = this; 
	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
		function(fileSystem){ // success get file system
			//this.root = fileSystem.root;
			that.rootPath = fileSystem.root.fullPath;
			console.log(fileSystem.root);
			that.listDir(fileSystem.root);
			console.log("==========================="+fileSystem.root.fullPath);
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
	
	var that = this; 
	var directoryReader = directoryEntry.createReader();
	directoryReader.readEntries(function(entries){
		
		var fileArr = new Array();
		for(var i=0; i<entries.length; ++i){ // sort entries
			var entry = entries[i];
		    if( entry.isFile && entry.name[0] != '.' ) {
		    	console.log('fileName=' + entry.name);
		    	that.items.push({title: entry.name, checked:false});
		    }
		}
	 });
  }


  uploadBusRoute() {

     for (var index in this.items) {
        console.log('------------------------------'+this.items[index].title + this.items[index].checked); 
        if(this.items[index].checked){
            this.uploadByHttp(this.items[index].title);
        }
     }
  }

  uploadByHttp(fileName) {
    var that = this;  // that is a reference to this (RecordRoutePage)
    var readFileCb = function(fileContent: string) {
      that.busProvider.uploadBusRoute(fileContent);
      console.log('uploadBusRoute callback: ' + fileContent);
    }

    //check https://github.com/apache/cordova-plugin-file for details
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
      console.log('file system open: ' + fs.name);
      fs.root.getFile(fileName, { create: false }, function(fileEntry) {
        console.log("fileEntry is file?" + fileEntry.isFile.toString());
        readFile(fileEntry, readFileCb);
      }, function(error) { });
    }, function(error) { });
  }

  deleteFiles(){

     for (var index in this.items) {
        if(this.items[index].checked){
            this.deleteFile(this.items[index].title);

			this.items.splice(parseInt(index), 1);
        }
     }
  	   
  }

  
  deleteFile(fileName){
  	  var relativeFilePath = this.rootPath + fileName;

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
		    fileSystem.root.getFile(relativeFilePath, {create:false}, function(fileEntry){
		        fileEntry.remove(function(file){
		            console.log("File removed!");
		        },function(){
		            console.log("error deleting the file ");
		            });
		        },function(){
		            console.log("file does not exist");
		        });
		    },function(evt){
		        console.log(evt.target.error.code);
		});
  }

}
