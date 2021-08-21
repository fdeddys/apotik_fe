import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PurchaseOrder, PurchaseOrderPageDto } from './purchase-order.model';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { PurchaseOrderService } from './purchase-order.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

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
        code: '',
        name: '',
        description : '',
        status: -1,
    };
    closeResult: string;
    constructor(
        private route: Router,
        private purchaseOrderService: PurchaseOrderService,
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
            code: '',
            name: '',
            description : '',
            status: -1,
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

}
