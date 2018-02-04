// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let apiUrl = 'http://umshopin.com/umshopin_admin/api/driver_login';

@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
  }

    login(credentials) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            this.http.post(apiUrl, JSON.stringify(credentials), {headers: headers}).subscribe(res => {
                resolve(res.json());
            }, (err) => {
                reject(err);
            });
        });
    }

    logout(){
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('X-Auth-Token', localStorage.getItem('token'));

            this.http.post(apiUrl+'logout', {}, {headers: headers}).subscribe(res => {
                localStorage.clear();
            }, (err) => {
                reject(err);
            });
        });
    }
}
