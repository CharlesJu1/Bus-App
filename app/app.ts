import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {RecordRoutePage} from './pages/record-route/record-route';
import {ShowPositionPage} from './pages/show-position/show-position';
import {BusProvider} from './providers/bus-provider/bus-provider';
import {AppSetting} from './app-setting';

@App({
  template: '<ion-nav id="rootNav" [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [AppSetting, BusProvider]
})
export class MyApp {
  rootPage: any = ShowPositionPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
