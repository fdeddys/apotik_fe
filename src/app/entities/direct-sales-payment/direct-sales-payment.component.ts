import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, NgModuleRef, OnInit } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { DirectSalesPaymentModalComponent } from './direct-sales-payment-modal/direct-sales-payment-modal.component';
import { DirectSalesPayment, DirectSalesPaymentPageDto } from './direct-sales-payment.model';
import { DirectSalesPaymentService } from './direct-sales-payment.service';

@Component({
  selector: 'op-direct-sales-payment',
  templateUrl: './direct-sales-payment.component.html',
  styleUrls: ['./direct-sales-payment.component.css']
})
export class DirectSalesPaymentComponent implements OnInit {

    moduleTitle = "Direct Sales Payment"
    searchTerm = {
        paymentNo: '',
        salesOrderNo: '',
        startDate : '',
        endDate: '',
        paymentStatus: 0,
    };

    directSalesPayments: DirectSalesPayment[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    dateStart: NgbDateStruct;
    dateEnd: NgbDateStruct;
    statuses = [
        { 'code': 0, 'desc': 'ALL'},
        { 'code': 20, 'desc': 'Approved'}, 
        { 'code': 30, 'desc': 'Cancel'}, 
        // { 'code': 50, 'desc': 'Paid' }
    ];
    statusSelected: number;

    closeResult: string;
    constructor(
        private directSalesPaymentService: DirectSalesPaymentService,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {
        this.statusSelected = this.statuses[0].code;
        this.setToday();
        this.filterSales();
    }

    setToday() {
        const today = new Date();
        this.dateStart = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
        this.dateEnd = {
            year: today.getFullYear(),
            day: today.getDate(),
            month: today.getMonth() + 1,
        };
    }

    onFilter() {
        this.curPage=1;
        this.filterSales();
    }

    resetFilter(){
        this.statusSelected = this.statuses[0].code;
        this.setToday();
    }

    getSelectedDateStart(): string{
        const month = ('0' + this.dateStart.month).slice(-2);
        const day = ('0' + this.dateStart.day).slice(-2);
        // const tz = 'T00:00:00+07:00';
        return this.dateStart.year + '-' + month + '-' + day + ' 00:00:00.000 +0700' ;
    }

    getSelectedDateEnd(): string{
        const month = ('0' + this.dateEnd.month).slice(-2);
        const day = ('0' + this.dateEnd.day).slice(-2);
        return this.dateEnd.year + '-' + month + '-' + day + ' 23:59:59.999 +0700';
    }


    filterSales() {
        // this.searchTerm.stat= String(this.statusSelected);
        this.searchTerm.startDate = this.getSelectedDateStart();
        this.searchTerm.endDate = this.getSelectedDateEnd();
        this.searchTerm.paymentStatus =+this.statusSelected;
        this.directSalesPaymentService.filter({
            filter: this.searchTerm,
            page: this.curPage,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<DirectSalesPaymentPageDto>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );

    }

    private onSuccess(data, headers) {
        this.directSalesPayments = []
        if (data.contents.length < 0) {
            return;
        }
        this.directSalesPayments = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..');
    }

    getStatus(id): string {
        let statusName = '';
        switch (id) {
            case 1:
            case 10:
                statusName = 'Outstanding';
                break;
            case 20:
                statusName = 'Approved';
                break;
            case 30:
                statusName = 'Cancel';
                break;
            case 40:
                statusName = 'Invoice';
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

    open(obj) {
        console.log(obj);
        
        const modalRef = this.modalService.open(DirectSalesPaymentModalComponent, { size: 'lg' });
        modalRef.componentInstance.statusRec = status;
        modalRef.componentInstance.objEdit = obj;
        // modalRef.componentInstance

        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log(this.closeResult);
            this.onFilter();
        }, (reason) => {
            console.log(reason);
            console.log(this.closeResult);
            this.onFilter();
        });
    }

    loadPage(){
        this.filterSales();
    }

}
