import {Page, NavController} from 'ionic-angular';
import {logError} from '../../util/logUtil';
import {SpotlightBaiduMap} from './spotlight-baidu-map';
import {Component, SimpleChange, Input, OnInit, OnChanges, ChangeDetectionStrategy, ElementRef} from 'angular2/core';

/*
  Generated class for the BaiduMapPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Page({
  templateUrl: 'build/pages/baidu-map/baidu-map.html',
  directives:[SpotlightBaiduMap]
})

export class BaiduMapPage implements OnInit {
	spotlightMap: SpotlightBaiduMap;

	constructor(public nav: NavController) {
		this.nav = nav;
	}

    ngOnInit() {

  		this.spotlightMap = new SpotlightBaiduMap(document.getElementById('map-container'));

	  	this.spotlightMap.mapKey = "fDUEKjmQHlSmxNFvznHSBLGvYRNzp7E5";
        this.spotlightMap.options = {
            center: {
                longitude: 121.506191,
                latitude: 31.245554
            },
            zoom: 17,
            markers: [{
                longitude: 121.506191,
                latitude: 31.245554,
                title: 'Where',
                content: 'Put description here'
            }]
        };

        this.spotlightMap.drawBaiduMap();
    }

    // http://lbsyun.baidu.com/index.php?title=webapi/direction-api
    
    locateCurrentPosition(){
   		console.log("enter locateCurrentPosition function");

   		var lo = 113.5889010000;
   		var la = 22.2610410000;
   		var opt = {
		            center: {
		                longitude: lo,
		                latitude: la
		            },
		            zoom: 17,
		            markers: [{
		                longitude: lo,
		                latitude: la,
		                title: 'YOU',
		                content: 'your location!',
		                width: 20,
		                height: 20,
		                enableMessage: true
		            }]
		        };

	   			console.log(opt);

	   			if (this.spotlightMap) {
	   				this.spotlightMap.center(opt);
	   			}

   		if (navigator){
   			navigator.geolocation.getCurrentPosition(function (position){
   				console.log(position);

	   			var lat = position.coords.latitude;
	   			var long = position.coords.longitude;
	   			var options = {
		            center: {
		                longitude: long,
		                latitude: lat
		            },
		            zoom: 17,
		            markers: [{
		                longitude: long,
		                latitude: lat,
		                title: 'YOU',
		                content: 'your location!'
		            }]
		        };

	   			console.log(options);

	   			if (this.spotlightMap) {
	   				this.spotlightMap.center(options);
	   			}
	   		}, function (error){
	   			console.log(error);
	   		});
   		}
   }
}
