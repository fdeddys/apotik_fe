import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ReportSLA } from './report-sla.model';
import { ReportSLAService } from './report-sla.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'op-report-sla',
    templateUrl: './report-sla.component.html',
    styleUrls: ['./report-sla.component.css']
})
export class ReportSLAComponent implements OnInit {
    reportSlaList: ReportSLA[];
    reportSla: ReportSLA;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    dateStartMdl: NgbDateStruct;
    dateEndMdl: NgbDateStruct;
    searchTerm = {
        dateStart: '',
        dateEnd: ''
    };

    constructor(
        private ngxService: NgxUiLoaderService,
        private reportSLAService: ReportSLAService,
        private calendar: NgbCalendar) { }

    ngOnInit() {
        this.dateStartMdl = this.calendar.getToday();
        this.dateEndMdl = this.calendar.getToday();
    }

    onFilter() {
        // Swal.fire({
        //     title: 'Tanya dulu gan?',
        //     text: 'Refresh data ?',
        //     type: 'question',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'just duit gaes!'
        // }).then((result) => {
        //     if (result.value) {
        //         console.log(result.value);
        //         this.loadAll(this.curPage);
        //     }
        //     console.log(result.value);
        // });
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.ngxService.start();
        this.searchTerm.dateStart = this.dateStartMdl.year + '-' +
            ('0' + this.dateStartMdl.month).slice(-2) + '-' +
            ('0' + this.dateStartMdl.day).slice(-2);
        this.searchTerm.dateEnd = this.dateEndMdl.year + '-' +
            ('0' + this.dateEndMdl.month).slice(-2) + '-' +
            ('0' + this.dateEndMdl.day).slice(-2);

        // this.reportSLAService.getDataReportSLAMock()
        // .subscribe(data => {
        //     // console.log('data : ', data);
        //     if (data.length < 0) {
        //         return;
        //     }
        //     const header = null;
        //     this.onSuccess(data, header);
        // });

        this.reportSLAService.query({
            filter: this.searchTerm,
        })
        .subscribe(
            (res: HttpResponse<ReportSLA[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    private onSuccess(data, headers) {
        console.log(data);
        if (data.length < 0) {
            return;
        }
        // this.reportSlaList = this.groupingData(data);
        this.reportSlaList = data;
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
}
