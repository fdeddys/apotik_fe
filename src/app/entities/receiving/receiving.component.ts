import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReceivingService } from './receiving.service';
import { Receive, ReceivingPageDto } from './receiving.model';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { Location } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LookupTemplate } from '../lookup/lookup.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';


@Component({
    selector: 'op-receiving',
    templateUrl: './receiving.component.html',
    styleUrls: ['./receiving.component.css']
})
export class ReceivingComponent implements OnInit {

    receivings: Receive[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        receiveNumber: '',
        status: -1,
        startDate:'',
        endDate:'',
        supplierName: '',
    };
    closeResult: string;

    listStatuses: LookupTemplate[]=[];
    statusSelected: number;
    startDate: NgbDateStruct;
    endDate : NgbDateStruct;
    setListStatus(){
        var statusAll =new LookupTemplate(-1, '', 'ALL',0);
        var status1 = new LookupTemplate(10, '', 'Outstanding',0);
        var status2 = new LookupTemplate(20, '', 'Submit',0);
        var status3 = new LookupTemplate(30, '', 'Cancel',0);

        this.listStatuses.push(statusAll);
        this.listStatuses.push(status1);
        this.listStatuses.push(status2);
        this.listStatuses.push(status3);
        
        this.statusSelected = -1;
    }   

    
    constructor(
        private route: Router,
        private receiveService: ReceivingService,
        private location: Location,
        private purchaseOrderService: PurchaseOrderService
    ) { }

    ngOnInit() {
        this.setToday();
        this.setListStatus();
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

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

    loadAll(page) {

        this.searchTerm.startDate = '';
        if (this.startDate !== null) {
            this.searchTerm.startDate = this.getStartDate();
        } 
        this.searchTerm.endDate = '';
        if (this.endDate !== null) {
            this.searchTerm.endDate = this.getEndDate();
        } 
        // if (this.statusSelected.id != -1 ) {
        this.searchTerm.status = +this.statusSelected;
        // }

        this.receiveService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<ReceivingPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );
        console.log(page);
        // console.log(this.brand);
    }

    addNew() {
        this.route.navigate(['/main/receive/', 0 ]);
    }

    open(obj: Receive) {
        console.log("nav ", obj);
        this.route.navigate(['/main/receive/' +  obj.id ]);
    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.receivings = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..');
    }

    resetFilter() {
        this.searchTerm = {
            receiveNumber: '',
            status: -1,
            startDate:'',
            endDate:'',
            supplierName:'',
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
        let statusName = 'Unknown';
        switch (id) {
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
            case 50:
                statusName = 'Paid';
                break;
            case 60:
                statusName = 'Payment Cancel';
                break;
        }
        return statusName;
    }

    onExport() {
        this.searchTerm.startDate = '';
        if (this.startDate !== null) {
            this.searchTerm.startDate = this.getStartDate();
        } 
        this.searchTerm.endDate = '';
        if (this.endDate !== null) {
            this.searchTerm.endDate = this.getEndDate();
        } 
        // if (this.statusSelected.id != -1 ) {
        this.searchTerm.status = +this.statusSelected;
        // }
        // this.spinner.show();
        this.receiveService.export({
            filter: this.searchTerm,
        }).subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const objBlob = window.URL.createObjectURL(newBlob);
                const element = document.createElement("a");
                element.href = objBlob;
                element.download = "data.xlsx"
                element.click();
                // this.spinner.hide();

                // window.open(objBlob);
            }
        );
    }

    previewPo(pono){
        this.purchaseOrderService
            .previewByPONo(pono)
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);

                window.open(objBlob);
            });
    }

    previewReceive(receiveId){
        this.receiveService
            .preview(receiveId)
            .subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/pdf' });
                const objBlob = window.URL.createObjectURL(newBlob);
                window.open(objBlob);
            });
    }

}
