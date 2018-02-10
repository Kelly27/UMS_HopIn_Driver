import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

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
    rmbMeIsTrue: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public authService: AuthServiceProvider,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
    ) {
    }

    ionViewDidLoad() {
    }

    doLogin(){
        this.showLoader();
        this.authService.login(this.loginData).then((result) => {
            this.data = result;
            if(this.data.result != false){
                this.loading.dismiss();
                this.data = result;
                if(this.rmbMeIsTrue == true){
                    this.authService.rememberToken(this.rmbMeIsTrue);
                    localStorage.setItem('token', this.data.result);
                    localStorage.setItem('driver', JSON.stringify(this.authService.driver));
                }
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

    toggleRmbMe(){
        this.rmbMeIsTrue = !this.rmbMeIsTrue;
    }

}
