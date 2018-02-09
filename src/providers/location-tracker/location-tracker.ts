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
            interval: 2000
        }

        this.backgroundGeolocation.configure(config).subscribe((location) => {
            console.log('Background Geolocation: ' + location.latitude + location.longitude);

            //Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = location.latitude;
                this.lng = location.longitude;
            });
            // this.updateLocation();
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
            });
            this.updateLocation();
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
            bus_location : JSON.stringify(location)
        } //when send data using post request, the data variable must same as the datatable column name

        // let body = {
        //     message: "Do you hear me?"
        // };

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
            bus_location : null
        }

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
}
