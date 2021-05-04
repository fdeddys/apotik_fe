import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { Router } from '@angular/router';
import { SalesOrderService } from './sales-order.service';
import { SalesOrder, SalesOrderPageDto } from './sales-order.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'op-sales-order',
    templateUrl: './sales-order.component.html',
    styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit {

    salesOrders: SalesOrder[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        code: '',
        name: '',
    };
    closeResult: string;
    constructor(
        private route: Router,
        private salesOrderService: SalesOrderService,
        private location: Location,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.spinner.show();
        this.salesOrderService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<SalesOrderPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {
                this.spinner.hide();
             }
        );
        console.log(page);
        // console.log(this.brand);
    }

    addNew() {
        this.route.navigate(['/main/sales-order/', 0 ]);
    }

    open(obj: SalesOrder) {
        console.log("nav ", obj);
        this.route.navigate(['/main/sales-order/' +  obj.id ]);

        // const modalRef = this.modalService.open(BrandModalComponent, { size: 'lg' });
        // modalRef.componentInstance.statusRec = status;
        // modalRef.componentInstance.objEdit = obj;

        // modalRef.result.then((result) => {
        //     this.closeResult = `Closed with: ${result}`;
        //     console.log(this.closeResult);
        //     this.curPage = 1;
        //     this.loadAll(this.curPage);
        // }, (reason) => {
        //     console.log(reason);
        //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        //     console.log(this.closeResult);
        //     this.loadAll(this.curPage);
        // });
    }

    // private getDismissReason(reason: any): string {
    //     if (reason === ModalDismissReasons.ESC) {
    //         return 'by pressing ESC';
    //     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //         return 'by clicking on a backdrop';
    //     } else {
    //         return `with: ${reason}`;
    //     }
    // }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.salesOrders = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..');
    }

    resetFilter() {
        this.searchTerm = {
            code: '',
            name: '',
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
                statusName = 'Approved';
                break;
            case 30:
                statusName = 'Rejected';
                break;
            case 40:
                statusName = 'Invoice';
                break;
        }
        return statusName;
    }

}
