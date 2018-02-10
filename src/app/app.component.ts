import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  public hasToken: boolean = false;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.checkToken();
    console.log('app', localStorage);
    if(localStorage.rmbToken){ //if local storage has token, when keeping user logged in
        this.rootPage = TabsPage;
    }
    else{
      this.rootPage = LoginPage
    }
  }

  checkToken(){
        if(localStorage.token == null|| localStorage.token == false){
            this.hasToken = false;
        }
        else{
            this.hasToken = true;
        }
    }
}

