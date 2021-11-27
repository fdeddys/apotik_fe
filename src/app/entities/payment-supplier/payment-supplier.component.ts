import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { PaymentSupplier, PaymentSupplierPageDto } from './payment-supplier.model';
import { PaymentSupplierService } from './payment-supplier.service';

@Component({
  selector: 'op-payment-supplier',
  templateUrl: './payment-supplier.component.html',
  styleUrls: ['./payment-supplier.component.css']
})
export class PaymentSupplierComponent implements OnInit {

    moduleTitle = "Direct Sales Payment"
    searchTerm = {
        paymentNo: '',
        salesOrderNo: '',
        startDate : '',
        endDate: '',
        paymentStatus: 0,
    };

    paymentSuppliers: PaymentSupplier[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    dateStart: NgbDateStruct;
    dateEnd: NgbDateStruct;
    statuses = [
        { 'code': 0, 'desc': 'ALL'},
        { 'code': 10, 'desc': 'Outstanding'},
        { 'code': 20, 'desc': 'Approved'}, 
        // { 'code': 30, 'desc': 'Cancel'}, 
        // { 'code': 50, 'desc': 'Paid' }
    ];
    statusSelected: number;

    closeResult: string;
    constructor(
        private paymentSupplierService: PaymentSupplierService,
        private modalService: NgbModal,
        private route: Router,
    ) { }

    ngOnInit() {
        this.statusSelected = this.statuses[0].code;
        this.setToday();
        this.filterPayment();
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
        this.filterPayment();
    }

    resetFilter(){
        this.statusSelected = this.statuses[0].code;
        this.setToday();
    }

    getSelectedDateStart(): string{
        const month = ('0' + this.dateStart.month).slice(-2);
        const day = ('0' + this.dateStart.day).slice(-2);
        // const tz = 'T00:00:00+07:00';
        return this.dateStart.year + '-' + month + '-' + day ;
    }

    getSelectedDateEnd(): string{
        const month = ('0' + this.dateEnd.month).slice(-2);
        const day = ('0' + this.dateEnd.day).slice(-2);
        return this.dateEnd.year + '-' + month + '-' + day ;
    }


    filterPayment() {
        // this.searchTerm.stat= String(this.statusSelected);
        this.searchTerm.startDate = this.getSelectedDateStart() + " 00:00:00.000";
        this.searchTerm.endDate = this.getSelectedDateEnd() + " 23:59:59.999";
        this.searchTerm.paymentStatus =+this.statusSelected;
        this.paymentSupplierService.filter({
            filter: this.searchTerm,
            page: this.curPage,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<PaymentSupplierPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );

    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.paymentSuppliers = data.contents;
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

    addNew() {
        this.route.navigate(['/main/payment-supplier/', 0 ]);
    }

    edit(id) {
        this.route.navigate(['/main/payment-supplier/', id ]);
    }

}
