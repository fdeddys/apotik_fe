import { Component, OnInit } from '@angular/core';
import { UseractivityService } from './useractivity.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Useractivity } from './useractivity.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'op-useractivity',
  templateUrl: './useractivity.component.html',
  styleUrls: ['./useractivity.component.css']
})
export class UseractivityComponent implements OnInit {

    useractivityList: Useractivity[];
    searchTerm = {
        name: '',
        action: '',
        startDate: '',
        endDate: ''
    };

    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;

    dateStartMdl: NgbDateStruct;
    dateEndMdl: NgbDateStruct;

    constructor(private useractivityService: UseractivityService,
                private ngxService: NgxUiLoaderService,
                private calendar: NgbCalendar) { }

    ngOnInit() {
        // this.dateStartMdl = this.calendar.getToday();
        // this.dateEndMdl = this.calendar.getToday();
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.ngxService.start();
        if (this.dateStartMdl && this.dateEndMdl) {
            this.searchTerm.startDate = this.dateStartMdl.year + '-' +
                ('0' + this.dateStartMdl.month).slice(-2) + '-' +
                ('0' + this.dateStartMdl.day).slice(-2);
            this.searchTerm.endDate = this.dateEndMdl.year + '-' +
                ('0' + this.dateEndMdl.month).slice(-2) + '-' +
                ('0' + this.dateEndMdl.day).slice(-2);
        }

        this.useractivityService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord
        })
        .subscribe(
            (res: HttpResponse<Useractivity[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    onFilter() {
        console.log(this.dateStartMdl);
        this.loadAll(this.curPage);
    }

    private onSuccess(data, headers) {
        console.log(data);
        if (data.content.length < 0) {
            return;
        }
        this.useractivityList = data.content;
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
