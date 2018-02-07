import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        public navCtrl: NavController,
        public locationTracker: LocationTrackerProvider,
        public http: Http
    ){
    }

    start(){
        this.locationTracker.startTracking();
    }

    stop(){
        this.locationTracker.stopTracking();
    }

}
