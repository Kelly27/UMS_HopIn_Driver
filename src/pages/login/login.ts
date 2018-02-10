import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    loading: any;
    loginData = { staff_number:'', password:'' };
    data: any;
    hasToken: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public authService: AuthServiceProvider,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
        console.log('locast', localStorage);
        this.checkToken();
        console.log(this.hasToken);
        if(this.hasToken){ //if local storage has token, keep user logged in
            this.navCtrl.setRoot(TabsPage);
        }
        // else{ //else, do login
        //     // this.doLogin();
        // }
    }

    doLogin(){
        this.showLoader();
        this.authService.login(this.loginData).then((result) => {
            this.data = result;
            console.log('this.data', result);
            if(this.data.result != false){
                this.loading.dismiss();
                this.data = result;
                localStorage.setItem('token', this.data.result);
                console.log('localstorage', localStorage);
                this.navCtrl.setRoot(TabsPage);
            }
            else{
                this.loading.dismiss();
                this.presentToast('Invalid Staff Number or Password. Please try again.');
            }
        });
    }

    showLoader(){
        this.loading = this.loadingCtrl.create({
            content: 'Authenticating...'
        })

        this.loading.present();
    }

    presentToast(msg){
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom',
            dismissOnPageChange: true
        })

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        })

        toast.present();
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
