// import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/filter';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Http, Headers, Response } from '@angular/http';
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

    constructor(
        public zone: NgZone,
        public backgroundGeolocation: BackgroundGeolocation,
        public geolocation: Geolocation,
        public http: Http
        ) {
        console.log('Hello LocationTrackerProvider Provider');
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
            track_status : 'ON',
            bus_location : JSON.stringify(location),
            next_stop: JSON.stringify(this.nextStop)
        } //when send data using post request, the data variable must same as the datatable column name

        console.log('data', data);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return new Promise(resolve => {
            this.http.post('http://umshopin.com/umshopin_admin/api/bus/1/updateLocation', JSON.stringify(data), {headers: headers})
            // .map(this.extractData)
            .subscribe(data => {
                resolve(data);
                console.log('succes: ' , data);
            }, (err) => {
                resolve(true);
                alert('failed: ' + err);
                window.location.reload();
            });
        })
    }

    // private extractData(res: Response) {
    //     return res.text() ? res.json() : {}; ;
    // }
    //
    stopUpdateLoc(){
        let data = {
            track_status: 'OFF',
            bus_location : null,
            next_stop: null
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
            console.log('end of route');
        }
    }

    nearBusStop(nextStop){
        console.log('next', nextStop);
        let isNear:boolean = false;
        let location = nextStop.location;
        if(this.lat < location.lat + 0.0001 && this.lat > location.lat - 0.0001){
            if(this.lng < location.lng + 0.0001 && this.lng > location.lng - 0.0001){
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
}
