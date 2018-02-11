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

    public driver: any;
    public rmbToken:boolean;

    constructor(public http: Http) {
        console.log('Hello AuthServiceProvider Provider');
    }

    login(credentials) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            // headers.append('Accept', 'application/json');
            headers.append('Content-Type', 'application/json');

            this.http.post(apiUrl, JSON.stringify(credentials), {headers: headers}).subscribe(res => {
                resolve(res.json());
                this.driver =  res.json().driver;
                console.log('auth', this.driver);
            }, (err) => {
                console.log('Something is wrong!', err);
            });
        });
    }

    logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('driver');
        localStorage.removeItem('rmbToken');
        console.log('logout', localStorage);
    }

    rememberToken(flag){
        this.rmbToken = flag;
        if(this.rmbToken){
            localStorage.setItem('rmbToken', flag);
            console.log('auth localStorage', localStorage);
        }
    }
}
