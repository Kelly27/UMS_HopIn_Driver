import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ReportProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReportProvider {

  public hasError:boolean = false;
  constructor(public http: Http) {
    console.log('Hello ReportsProvider Provider');
  }

  storeReport(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return new Promise(resolve => {
      this.http.post('http://umshopin.com/umshopin_admin/api/report/store', JSON.stringify(data), {headers: headers})
      .subscribe(data => {
        resolve(data);
        console.log('succes: ' , data);
      }, (err) => {
        resolve(true);
        this.hasError = true;
        console.log('failed: ' + err);
      });
    });
  }

}
