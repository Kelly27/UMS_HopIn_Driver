import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
/**
 * Generated class for the OthersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-others',
  templateUrl: 'others.html',
})
export class OthersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OthersPage');
  }

  logout(){
      this.authService.logout();
      //set page back to login page - without bring the tab together
      this.app.getRootNav().setRoot(LoginPage);
  }
}
