import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PurchaseOrder, PurchaseOrderPageDto } from './purchase-order.model';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { PurchaseOrderService } from './purchase-order.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LookupTemplate } from '../lookup/lookup.model';

@Component({
  selector: 'op-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

    purchaseOrders: PurchaseOrder[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        pono: '',
        status: -1,
        startDate:'',
        endDate:'',
    };
    startDate: NgbDateStruct;
    endDate : NgbDateStruct;
    listStatuses: LookupTemplate[]=[];
    statusSelected: number;
    closeResult: string;
    constructor(
        private route: Router,
        private purchaseOrderService: PurchaseOrderService,
        private location: Location,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit() {
        this.setToday();
        this.setListStatus();
        this.loadAll(this.curPage);
    }

    setListStatus(){
        var statusAll =new LookupTemplate(-1, '', 'ALL',0);
        var status1 = new LookupTemplate(10, '', 'Outstanding',0);
        var status2 = new LookupTemplate(20, '', 'Submit',0);
        var status3 = new LookupTemplate(30, '', 'Cancel',0);
        var status4 = new LookupTemplate(40, '', 'Receiving',0);

        this.listStatuses.push(statusAll);
        this.listStatuses.push(status1);
        this.listStatuses.push(status2);
        this.listStatuses.push(status3);
        this.listStatuses.push(status4);
        this.statusSelected = -1;
        // console.log('all status ', this.listStatuses)
    }   

    onFilter() {
        this.loadAll(this.curPage);
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
        this.spinner.show();
        this.purchaseOrderService.export({
            filter: this.searchTerm,
        }).subscribe(dataBlob => {
                console.log('data blob ==> ', dataBlob);
                const newBlob = new Blob([dataBlob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                // const name = dataBlob.
                const objBlob = window.URL.createObjectURL(newBlob);
                const element = document.createElement("a");
                element.href = objBlob;
                element.download = "data.xlsx"
                element.click();
                this.spinner.hide();

                // window.open(objBlob);
            }
        );
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
        this.spinner.show();
        this.purchaseOrderService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<PurchaseOrderPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {
                this.spinner.hide();
             }
        );
        console.log(page);
        // console.log(this.brand);
    }

    addNew() {
        this.route.navigate(['/main/purchase-order/', 0 ]);
    }

    open(obj: PurchaseOrder) {
        console.log("nav ", obj);
        this.route.navigate(['/main/purchase-order/' +  obj.id ]);

    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.purchaseOrders = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..');
    }

    resetFilter() {
        this.searchTerm = {
            pono: '',
            status: -1,
            startDate:'',
            endDate:''
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
            case 40:
                statusName = 'Receiving';
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
