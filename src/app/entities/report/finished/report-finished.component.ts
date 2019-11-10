import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReportFinishedService } from './report-finished.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ReportFinished } from './report-finished.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'op-report-finished',
    templateUrl: './report-finished.component.html',
    styleUrls: ['./report-finished.component.css']
})
export class ReportFinishedComponent implements OnInit {

    reportList: ReportFinished[];
    curPage = 1;
    totalData = 0;
    // totalRecord = TOTAL_RECORD_PER_PAGE;
    totalRecord = 999999;
    dateStartMdl: NgbDateStruct;
    dateEndMdl: NgbDateStruct;
    searchTerm = {
        name: '',
    };

    constructor(private ngxService: NgxUiLoaderService,
                private reportFinishedService: ReportFinishedService) {}

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.ngxService.start();
        console.log('Start load all');
        this.reportFinishedService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
            (res: HttpResponse<ReportFinished[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );


    }

    private onSuccess(data, headers) {
        if (data.content.length < 0) {
            return;
        }
        this.reportList = data.content;
        this.totalData = data.totalElements;
        this.ngxService.stop();
    }

    private onError(error) {
        console.log('error..');
        this.ngxService.stop();
    }

    loadPage() {
        this.loadAll(this.curPage);
        console.log(this.curPage);
    }

    onFilter() {
        console.log('on filter');
    }


}
