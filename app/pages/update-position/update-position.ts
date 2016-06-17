import {Page, NavController} from 'ionic-angular';
import {BusProvider} from '../../providers/bus-provider/bus-provider';
import {BLinePosition} from '../../providers/bus-provider/bus';
import {logError} from '../../util/logUtil';
import {GpsTestPage} from '../gps-test/gps-test';

/*
  Generated class for the UpdatePositionPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/update-position/update-position.html',
})
export class UpdatePositionPage {

  lat: number;
  long: number;
  accuracy: number;
  constructor(public nav: NavController, private busProvider: BusProvider) {}

  updatePosition() {
    var update = function(position) {
      var bLinePosition = new BLinePosition();

      // TODO Need a better way to initialize BLinePosition
      bLinePosition.city = 'ZH';
      bLinePosition.line = 88;
      bLinePosition.plate = 'YC12345';
      bLinePosition.position.coords.lat = position.coords.latitude;
      bLinePosition.position.coords.long = position.coords.longitude;
      bLinePosition.position.heading = position.coords.heading;
      bLinePosition.position.speed = position.coords.speed;

      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      this.accuracy = position.coords.accuracy;

      console.log('UpdatePositionPage:updatePosition bLinePosition =' + JSON.stringify(bLinePosition));
      var t = new Date().getTime();
      console.log('xxxxx time:' + t);
      this.busProvider.updateBusPosition(bLinePosition)
    };
    var t = new Date().getTime();
    console.log('updating position. Time=' + t);

    navigator.geolocation.getCurrentPosition(update.bind(this), logError('updatePosition: '));

  }

  gotoGpsTestPage() {
    this.nav.push(GpsTestPage);
  }
}
