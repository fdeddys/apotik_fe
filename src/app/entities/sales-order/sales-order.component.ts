import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { ActivatedRoute, Router } from '@angular/router';
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
        description : '',
        isCash: false
    };
    moduleTitle: string = "";
    isCash: boolean = false;
    closeResult: string;

    constructor(
        private route: Router,
        private router: ActivatedRoute,
        private salesOrderService: SalesOrderService,
        private location: Location,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit() {

        this.router.data.subscribe(
            data => {
                console.log("data===>",data.cash);

                this.moduleTitle ="Sales Order";
                this.isCash = data.cash;
                if (this.isCash) {
                    this.moduleTitle ="Direct Sales";
                }
                this.loadAll(this.curPage);
            }
        );
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.spinner.show();
        this.searchTerm.isCash = this.isCash;
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
    }

    addNew() {
        
        if (this.isCash) {
            this.route.navigate(['/main/direct-sales/', 0 ]);
            return
        } 
        this.route.navigate(['/main/sales-order/', 0 ]);
        
    }

    open(obj: SalesOrder) {
        console.log("nav ", obj);
        if (this.isCash) {
            this.route.navigate(['/main/direct-sales/' +  obj.id ]);
            return
        }
        this.route.navigate(['/main/sales-order/' +  obj.id ]);
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
            description : '',
            isCash: false,
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
                statusName = 'Invoice';
                break;
            case 50:
                statusName = 'Paid';
                break;
        }
        return statusName;
    }

}
