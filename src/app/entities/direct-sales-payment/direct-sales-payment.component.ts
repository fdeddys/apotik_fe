import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { SalesOrder } from '../sales-order/sales-order.model';

@Component({
  selector: 'op-direct-sales-payment',
  templateUrl: './direct-sales-payment.component.html',
  styleUrls: ['./direct-sales-payment.component.css']
})
export class DirectSalesPaymentComponent implements OnInit {

    searchTerm = {
        code: '',
        name: '',
        description : '',
        isCash: false
    };
    salesOrders: SalesOrder[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    dateStart: NgbDateStruct;
    dateEnd: NgbDateStruct;
    statuses = ['Approved', 'Invoice'];
    statusSelected: string;
    constructor() { }

    ngOnInit() {
        this.statusSelected = this.statuses[0];
        this.setToday();
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


    resetFilter(){
        this.statusSelected = this.statuses[0];
        this.setToday();
    }

}
