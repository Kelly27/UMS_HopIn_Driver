import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ReportPage } from '../report/report';
import { OthersPage } from '../others/others';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

    homePage = HomePage;
    reportPage = ReportPage;
    othersPage = OthersPage;

}
