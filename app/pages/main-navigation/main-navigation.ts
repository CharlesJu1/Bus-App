import {Page, NavController} from 'ionic-angular';
import {BusRoutePage} from '../bus-route/bus-route';
import {DriverConsolePage} from '../driver-console/driver-console';
import {FileListPage} from '../file-list/file-list';
import {RecordRoutePage} from '../record-route/record-route';
import {GpsTestPage} from '../gps-test/gps-test';
import {ShowPositionPage} from '../show-position/show-position';
import {UpdatePositionPage} from '../update-position/update-position';
/*
  Generated class for the MainNavigationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/main-navigation/main-navigation.html',
})

export class MainNavigationPage {
    constructor(public nav: NavController) {}



	busRoute(){
		this.nav.push(BusRoutePage);
	} 


	driverConsole(){
		this.nav.push(DriverConsolePage);
	}


	fileList(){
		this.nav.push(FileListPage);
	}


	recodeRoute(){
		this.nav.push(RecordRoutePage);
	}


	gpsTest(){
		this.nav.push(GpsTestPage);
	}

	showPosition(){
		this.nav.push(ShowPositionPage);
	}

	updatePosition(){
		this.nav.push(UpdatePositionPage);
	}

}