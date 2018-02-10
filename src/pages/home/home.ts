import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { Http, Headers } from '@angular/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    public driver;

    constructor(
        public navCtrl: NavController,
        public locationTracker: LocationTrackerProvider,
        public http: Http,
        public authService: AuthServiceProvider
    ){
        this.setDriver();
    }

    ionViewDidLoad() {
        console.log('home', this.driver);
    }
    start(){
        this.locationTracker.startTracking();
    }

    stop(){
        this.locationTracker.stopTracking();
    }

    setDriver(){
        //if local storage has remember me token and remember me token is true, then get driver info from local storage
        if(localStorage.rmbToken == 'true'){ //local storage will also turn boolean to string ...
            this.driver = JSON.parse(localStorage.driver);
        }
        //else get driver info from auth service
        else{
            this.driver = this.authService.driver;
        }
    }

}
