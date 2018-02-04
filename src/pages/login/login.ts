import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { HomePage} from '../home/home';
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
    }

    doLogin(){
        this.showLoader();
        this.authService.login(this.loginData).then((result) => {
            console.log('login data:' + this.loginData);
            this.loading.dismiss();
            this.data = result;
            console.log('result:' + result);
            console.log('access token:' + this.data.access_token);
            localStorage.setItem('token', this.data.access_token);
            this.navCtrl.setRoot(HomePage);
        }, (err) => {
            this.loading.dismiss();
            this.presentToast(err);
        })
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

}
