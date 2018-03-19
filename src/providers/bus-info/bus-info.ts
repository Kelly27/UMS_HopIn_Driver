import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the BusInfoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BusInfoProvider {

    public driver:any;

    constructor(public http: Http) {
        console.log('Hello BusInfoProvider Provider');
    }

    setDriver(driver){
        this.driver = driver;
    }

    getAssignedBus(){
      console.log(this.driver.id);
        return this.http.get('http://umshopin.com/umshopin_admin/api/driver/' + this.driver.id + '/getAssignedInfo')
        .map(response => response.json());
    }

}
