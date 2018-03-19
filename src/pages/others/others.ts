import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
import { BusInfoProvider } from '../../providers/bus-info/bus-info';
// import { 
//   TimelineComponent, 
//   TimelineItemComponent, 
//   TimelineTimeComponent 
// } from '../../components/timeline/timeline';

/* Generated class for the OthersPage page.
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
    
    public assignedBus:any;
    public assignedRoute: any;
    public routeArr:any; 

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService: AuthServiceProvider, 
    public app: App,
    public busInfoProvider: BusInfoProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OthersPage');
    this.getAssignedBus();
  }

  logout(){
      this.authService.logout();
      //set page back to login page - without bring the tab together
      this.app.getRootNav().setRoot(LoginPage);
  }

  getAssignedBus(){
        this.busInfoProvider.getAssignedBus().subscribe(res => {
            this.assignedBus = res.assigned_bus;
            this.assignedRoute = this.assignedBus.routes;
            this.routeArr = JSON.parse(this.assignedRoute.route_arr);
        })
    }
}
