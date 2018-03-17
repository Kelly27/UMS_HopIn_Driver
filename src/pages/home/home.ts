import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BusInfoProvider } from '../../providers/bus-info/bus-info';

import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    public driver:any;

    public next_stop = [];

    public assignedBus:any;
    public assignedRoute: any;
    public bus_stop_arr:any; 

    public trackingToggle:boolean = false;

    constructor(
        public navCtrl: NavController,
        public locationTracker: LocationTrackerProvider,
        public authService: AuthServiceProvider,
        public busInfoProvider: BusInfoProvider,
        private alertCtrl: AlertController
    ){
        this.setDriver();
        this.busInfoProvider.setDriver(this.driver);
    }

    ionViewDidLoad() {
        console.log('home', this.driver);
        this.getAssignedBus();
    }

    checkTrackingSwitch(){
        if(this.trackingToggle == true ){
            this.locationTracker.startTracking();
        }
        else{
            this.locationTracker.stopTracking();
        }
    }
    // start(){
    // }

    // stop(){
    //     this.locationTracker.stopTracking();
    // }

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
            this.assignedBus = res.assigned_bus;
            this.assignedRoute = this.assignedBus.routes;
            this.bus_stop_arr = JSON.parse(this.assignedRoute.route_arr);

            //init first bus stop
            this.locationTracker.setBusStopArr(this.bus_stop_arr);
            this.updateBusStop();
        });
    }

    updateBusStop(){
        setInterval(() => {
            this.next_stop = this.locationTracker.nextStop
        }, 2000);
    }

    changeStop(){
        let alr = this.alertCtrl.create({
            title: 'Change Next Stop',
            message: 'Which stop you would like to change to?',
        });
        for(var i = 0; i < this.bus_stop_arr.length; i++){
            alr.addInput({
                type: 'radio',
                label: this.bus_stop_arr[i].name,
                value: this.bus_stop_arr[i]
            });
        }

        alr.addButton({
            text: 'CANCEL',
        })

        alr.addButton({
            text: 'OK',
            handler: data => {
                console.log('data', data);
                this.locationTracker.changeNextStop(data);
                this.next_stop = data;
            }
        })

        alr.present();
    }
}
