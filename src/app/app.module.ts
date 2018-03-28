import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ReportPage } from '../pages/report/report';
import { OthersPage } from '../pages/others/others';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { BusInfoProvider } from '../providers/bus-info/bus-info';

import { 
  TimelineComponent, 
  TimelineItemComponent, 
  TimelineTimeComponent 
} from '../components/timeline/timeline';
import { ReportProvider } from '../providers/report/report';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    ReportPage,
    OthersPage,

    TimelineComponent,
    TimelineItemComponent,
    TimelineTimeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    TabsPage,
    ReportPage,
    OthersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    LocationTrackerProvider,
    BackgroundGeolocation,
    Geolocation,
    BusInfoProvider,
    ReportProvider,
  ]
})
export class AppModule {}
