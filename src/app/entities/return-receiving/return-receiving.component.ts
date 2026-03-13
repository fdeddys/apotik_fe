import { Component, OnInit } from '@angular/core';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { ReturnReceive, ReturnReceivePageDto } from './return-receiving.model';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReturnReceivingService } from './return-receiving.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LookupStatusRR } from '../lookup/lookup.model';

@Component({
  selector: 'op-return-receiving',
  templateUrl: './return-receiving.component.html',
  styleUrls: ['./return-receiving.component.css']
})
export class ReturnReceivingComponent implements OnInit {

    returnReceives: ReturnReceive[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        returnNo: '',
        name: '',
        startDate:'',
        endDate:'',
        status: 0,
    };
    closeResult: string;
    startDate: NgbDateStruct;
    endDate : NgbDateStruct;
    listStatuses: LookupStatusRR[]=[];
    statusSelected: number;
    constructor(
        private route: Router,
        private returnReceiveService: ReturnReceivingService,
        private location: Location,
        private spinner: NgxSpinnerService,
    ) { }

    setToday() {
        const today = new Date();
        
       
        this.startDate = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
         
        
        this.endDate = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
        

        
    }

    ngOnInit() {
        let name = sessionStorage.getItem("return-receive:name")
        if (name!==null) {
            this.searchTerm.name = name
        }

        let no = sessionStorage.getItem("return-receive:no")
        if (no!==null) {
            this.searchTerm.returnNo = no
        }
        this.setToday();
        this.setListStatus();

        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.spinner.show();
        this.searchTerm.startDate = '';
        if (this.startDate !== null) {
            this.searchTerm.startDate = this.getStartDate();
        } 
        this.searchTerm.endDate = '';
        if (this.endDate !== null) {
            this.searchTerm.endDate = this.getEndDate();
        }
        this.searchTerm.status = +this.statusSelected;
        sessionStorage.setItem("return-receive:startDate",this.searchTerm.startDate )
        sessionStorage.setItem("return-receive:endDate",this.searchTerm.endDate)
        sessionStorage.setItem("return-receive:name",this.searchTerm.name)
        sessionStorage.setItem("return-receive:no",this.searchTerm.returnNo)
        this.returnReceiveService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<ReturnReceivePageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {
                this.spinner.hide();
             }
        );
        console.log(page);
    }

    setListStatus(){
        var statusAll =new LookupStatusRR(0, 'ALL');
        var status1 = new LookupStatusRR(10, 'Outstanding');
        var status2 = new LookupStatusRR(20, 'Submit');
        var status3 = new LookupStatusRR(30, 'Cancel');

        this.listStatuses.push(statusAll);
        this.listStatuses.push(status1);
        this.listStatuses.push(status2);
        this.listStatuses.push(status3);
        let rrstatus = sessionStorage.getItem("return-receive:status")
        if (rrstatus==null) {
            this.statusSelected = 0;
        } else{
            this.statusSelected = Number(rrstatus)
        }
        // console.log('all status ', this.listStatuses)
    }  

    addNew() {
        this.route.navigate(['/main/return-receive/', 0 ]);
    }

    open(obj: ReturnReceive) {
        console.log("nav ", obj);
        this.route.navigate(['/main/return-receive/' +  obj.id ]);
    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.returnReceives = data.contents;
        this.totalData = data.totalRow;
        console.log("total row " + data.totalRow);
    }

    private onError(error) {
        console.log('error..');
    }

    resetFilter() {
        this.searchTerm = {
            returnNo: '',
            name: '',
            startDate:'',
            endDate:'',
            status:0,
        };
        this.loadAll(1);
    }

    loadPage() {
        this.loadAll(this.curPage);
    }

    goBack() {
        this.location.back();
    }

    getStatus(id): string {
        let statusName = "Unknown [" + id + "]"
        switch (id) {
            case 0:
            case 1:
            case 10:
                statusName = 'Outstanding';
                break;
            case 20:
                statusName = 'Submit';
                break;
            case 30:
                statusName = 'Cancel';
                break;
        }
        return statusName;
    }

    getStartDate(): string{

        const month = ('0' + this.startDate.month).slice(-2);
        const day = ('0' + this.startDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';

        return this.startDate.year + '-' + month + '-' + day + tz;
    }

    getEndDate(): string{

        const month = ('0' + this.endDate.month).slice(-2);
        const day = ('0' + this.endDate.day).slice(-2);
        const tz = 'T00:00:00+07:00';

        return this.endDate.year + '-' + month + '-' + day + tz;
    }
}
