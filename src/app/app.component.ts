import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
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
    public alertShown:boolean = false;

    constructor(
        public platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        public alertCtrl: AlertController
    ) {
        platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();

        platform.registerBackButtonAction(() => {
            if (this.alertShown==false) {
                this.presentConfirm();
            }
        }, 0);
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


    presentConfirm(){
        let alrt = this.alertCtrl.create({
            title: 'Are you sure to exit?',
            message: 'Your tracking is switched on. Exit the app will switch off the tracking service.',
            buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                handler: ()=>{
                    console.log('clicked cancel');
                    this.alertShown = false;
                }
            },
            {
                text: 'Yes',
                handler: () =>{
                    console.log('clicked yes');
                    this.platform.exitApp();
                }
            }
            ]
        });

        alrt.present().then(() => {
            this.alertShown = true;
        })
    }
}

