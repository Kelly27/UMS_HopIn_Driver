import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { ReportProvider } from '../../providers/report/report';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  private subjects = [
    {value: 'Bus has broken down.', name: 'Bus has broken down.'},
    {value: 'I need some help.', name: 'I need some help.'},
    {value: 'More buses are required now!', name: 'More buses are required now!'}
    ];
  public driver;
  private reportForm: FormGroup;
  public show_subject_err: boolean = false;
  public show_content_err: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public reportsProv: ReportProvider,
    public authService: AuthServiceProvider
  ) {
    this.reportForm = this.formBuilder.group({
      subject: ['', Validators.compose([Validators.required])],
      content: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
    this.setDriver();
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

  logForm(){
    if(!this.reportForm.controls.subject.valid && !this.reportForm.controls.content.valid){
        this.show_subject_err = true;
        this.show_content_err = true;
    }
    else if(!this.reportForm.controls.subject.valid){
        this.show_subject_err = true;
        this.show_content_err = false;
    }
    else if(!this.reportForm.controls.content.valid){
        this.show_subject_err = false;
        this.show_content_err = true;
    }
    else{
        let prompt = this.alertCtrl.create({
            title: "Submit",
            message: "Your report has been submitted. Thank you.",
            buttons:[
            {
                text: 'OK',
            }
            ]
        });

        let error = this.alertCtrl.create({
            title: 'Submit Error',
            message: "Please try again later.",
            buttons:[
            {
                text: 'OK'
            }
            ]
        })

        let data = {
            subject: '[' + this.driver.name + '] - ' + this.reportForm.value.subject,
            content: '[' + this.driver.name + '] - ' + this.reportForm.value.content,
            type: 'DRIVER'
        }
        console.log(data);
        this.reportsProv.storeReport(data);
        if(this.reportsProv.hasError){
            this.reportForm.reset();
            error.present();
        }
        else{
            prompt.present();
        }
    }
  }
}
