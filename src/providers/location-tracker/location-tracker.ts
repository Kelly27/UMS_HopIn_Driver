// import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/filter';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Http, Headers, Response } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {

    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    public bus_stop_arr:any;
    public nextStop: any;
    public isFull:boolean = false;

    public driver:any;

    constructor(
        public zone: NgZone,
        public backgroundGeolocation: BackgroundGeolocation,
        public geolocation: Geolocation,
        public http: Http,
        private alertCtrl: AlertController,
        ) {
        console.log('Hello LocationTrackerProvider Provider');
    }

    setDriver(driver){
        this.driver = driver;
    }
    startTracking(){
        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 10,
            debug: true,
            interval: 500
        }

        this.backgroundGeolocation.configure(config).subscribe((location) => {
            console.log('Background Geolocation: ' + location.latitude + location.longitude);

            //Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = location.latitude;
                this.lng = location.longitude;
                this.updateLocation();
                this.nearBusStop(this.nextStop);
            });
        }, (err) => {
            console.log(err);
        });

        //Turn ON the background-geolocation system
        this.backgroundGeolocation.start();

        //Foreground Tracking
        let options = {
            frequency: 3000,
            enableHighAccuracy: true
        }

        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
            console.log(position);

            //Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.updateLocation();
                this.nearBusStop(this.nextStop);
            });
        });
    }

    stopTracking(){
        console.log('stopTracking');

        this.isFull = false;
        this.stopUpdateLoc();
        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();
    }

    updateLocation(){
        let location = {
            lat: this.lat,
            lng: this.lng
        };

        let data = {
            bus_location : JSON.stringify(location),
            next_stop: JSON.stringify(this.nextStop),
            isFull: this.isFull
        } //when send data using post request, the data variable must same as the datatable column name

        // console.log('data', data);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return new Promise(resolve => {
            this.http.post('http://umshopin.com/umshopin_admin/api/bus/' + this.driver.id + '/updateLocation', JSON.stringify(data), {headers: headers})
            // .map(this.extractData)
            .subscribe(data => {
                resolve(data);
                console.log('succes: ' , data);
            }, (err) => {
                resolve(true);
                console.log('failed: ' + err);
                window.location.reload();
            });
        })
    }

    stopUpdateLoc(){
        let data = {
            bus_location : null,
            next_stop: null,
            isFull: this.isFull
        }

        this.lat = 0;
        this.lng = 0;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return new Promise(resolve => {
            this.http.post('http://umshopin.com/umshopin_admin/api/bus/1/updateLocation', JSON.stringify(data), {headers: headers})
            .subscribe(data => {
                resolve(data);
                console.log('success', data);
            }, (err) => {
                resolve(true);
                alert('failed' + err);
                window.location.reload();
            })
        })
    }

    setBusStopArr(bus_stop_arr){
        this.bus_stop_arr = bus_stop_arr;
        this.nextStop = this.bus_stop_arr[0];
    }

    setNextStop(currentStop){
        let i = this.bus_stop_arr.indexOf(currentStop);
        console.log(i);
        if(this.bus_stop_arr[i + 1]){
            this.nextStop = this.bus_stop_arr[i + 1];
        }
        else{
            this.stopTracking(); //pause tracking
            this.presentEndRouteAlert();
            console.log('end of route');

        }
    }

    changeNextStop(stop){
        this.nextStop = stop;
    }

    nearBusStop(nextStop){
        console.log('next', nextStop);
        let isNear:boolean = false;
        let location = nextStop.location;
        if(this.lat < location.lat + 0.0005 && this.lat > location.lat - 0.0005){
            if(this.lng < location.lng + 0.0005 && this.lng > location.lng - 0.0005){
                console.log('it is near!');
                isNear = true;
                let currentStop = nextStop;
                this.setNextStop(currentStop);
            }
            else{
                console.log('lng not reach yet', this.lng);
            }
        }
        else{
            console.log('lat not reach yet', this.lat);
            isNear = false;
        }
    }

    presentEndRouteAlert(){
        let alert = this.alertCtrl.create({
            title: 'End of Route',
            message: "You have reached the last bus stop on this route. Do you want to stop sending your location to the server?",
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.startTracking();
                    }
                },
                {
                    text: 'OK',
                    handler: () => {
                        this.stopTracking();
                    }
                }
            ]
        });
        alert.present();
    }
}
