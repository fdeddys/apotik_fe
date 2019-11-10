import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ReportProductivity, ReportProductivityView } from './report-productivity.model';
import { ReportProductivityService } from './report-productivity.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import * as _ from 'lodash';

@Component({
    selector: 'op-report-productivity',
    templateUrl: './report-productivity.component.html',
    styleUrls: ['./report-productivity.component.css']
})
export class ReportProductivityComponent implements OnInit {
    reportProdList: ReportProductivityView[];
    reportProd: ReportProductivity;
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
        private reportProdService: ReportProductivityService,
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

        this.reportProdService.query({
            filter: this.searchTerm,
        })
        .subscribe(
            (res: HttpResponse<ReportProductivity[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    private onSuccess(data, headers) {
        console.log(data);
        if (data.length < 0) {
            return;
        }
        this.reportProdList = this.groupingData(data);
        this.totalData = data.totalElements;
        this.ngxService.stop();
    }

    private onError(error) {
        console.log('error..');
        this.ngxService.stop();
    }

    groupingData(data) {
        console.log('groupingData : ', data);
        let tempArr: ReportProductivityView[];
        tempArr = [];
        const tempObj = {};
        data.forEach(element => {
            if (!tempObj[element.proccessDate]) {
                tempObj[element.proccessDate] = {};
            }
            if (!tempObj[element.proccessDate][element.userName]) {
                tempObj[element.proccessDate][element.userName] = {};
                tempObj[element.proccessDate][element.userName]['approved'] = 0;
                tempObj[element.proccessDate][element.userName]['rejected'] = 0;
                tempObj[element.proccessDate][element.userName]['verified'] = 0;
            }
            console.log('element.statusName : ', element.statusName);
            tempObj[element.proccessDate][element.userName]['roleName'] = element.roleName;

            if (_.includes(element.statusName, 'VERIFIED')) {
                tempObj[element.proccessDate][element.userName]['verified'] += element.total;
            }
            if (_.includes(element.statusName, 'REJECTED')) {
                tempObj[element.proccessDate][element.userName]['rejected'] += element.total;
            }
            if (_.includes(element.statusName, 'APPROVED')) {
                tempObj[element.proccessDate][element.userName]['approved'] += element.total;
            }
        });
        console.log('tempObj : ', tempObj);

        Object.keys(tempObj).forEach((key, indx) => {
            Object.keys(tempObj[key]).forEach((xkey, xindx) => {
                let temp: ReportProductivityView;
                temp = {};
                temp.proccessDate = key;
                temp.userName = xkey;
                temp.roleName = tempObj[key][xkey]['roleName'];
                temp.verified = tempObj[key][xkey]['verified'];
                temp.approved = tempObj[key][xkey]['approved'];
                temp.rejected = tempObj[key][xkey]['rejected'];
                tempArr.push(temp);
            });
        });

        console.log('tempArr : ', tempArr);
        return tempArr;
    }

    loadPage() {
        this.loadAll(this.curPage);
        console.log(this.curPage);
    }
}
