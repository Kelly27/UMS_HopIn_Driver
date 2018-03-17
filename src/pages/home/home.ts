import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BusInfoProvider } from '../../providers/bus-info/bus-info';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    public driver:any;

    public next_stop = [];

    constructor(
        public navCtrl: NavController,
        public locationTracker: LocationTrackerProvider,
        public authService: AuthServiceProvider,
        public busInfoProvider: BusInfoProvider
    ){
        this.setDriver();
    }

    ionViewDidLoad() {
        console.log('home', this.driver);
        this.getAssignedBus();
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

    getAssignedBus(){
        this.busInfoProvider.getAssignedBus()
           .subscribe(res => {
                let assignedBus = res.assigned_bus;
                let assignedRoute = assignedBus.routes;
                let route_name = assignedRoute.title;

                //init first bus stop
                let bus_stop_arr = JSON.parse(assignedRoute.route_arr);
                this.locationTracker.setBusStopArr(bus_stop_arr);
                this.updateBusStop();
        });
    }

    updateBusStop(){
        setInterval(() => {
            this.next_stop = this.locationTracker.nextStop
        }, 2000);
    }
}
