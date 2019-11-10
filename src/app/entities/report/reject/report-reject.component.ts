import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReportRejectService } from './report-reject.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ReportReject } from './report-reject.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'op-report-reject',
    templateUrl: './report-reject.component.html',
    styleUrls: ['./report-reject.component.css']
})
export class ReportRejectComponent implements OnInit {

    reportList: ReportReject[];
    curPage = 1;
    totalData = 0;
    // totalRecord = TOTAL_RECORD_PER_PAGE;
    totalRecord = 999999;
    searchTerm = {
        name: '',
    };
    dateStartMdl: NgbDateStruct;
    dateEndMdl: NgbDateStruct;

    constructor(private ngxService: NgxUiLoaderService,
                private reportService: ReportRejectService) {}

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.ngxService.start();
        console.log('Start load all');
        this.reportService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
            (res: HttpResponse<ReportReject[]>) => this.onSuccess(res.body, res.headers),
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
