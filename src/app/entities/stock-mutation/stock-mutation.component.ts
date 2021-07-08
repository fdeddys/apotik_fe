import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { StockMutation, StockMutationPageDto } from './stock-mutation.model';
import { StockMutationService } from './stock-mutation.service';
import { Location } from '@angular/common';

@Component({
  selector: 'op-stock-mutation',
  templateUrl: './stock-mutation.component.html',
  styleUrls: ['./stock-mutation.component.css']
})
export class StockMutationComponent implements OnInit {


    stockMutations: StockMutation[];
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
        private stockMutationService: StockMutationService,
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
        this.stockMutationService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<StockMutationPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => {
                this.spinner.hide();
             }
        );
        console.log(page);
    }

    addNew() {
        this.route.navigate(['/main/stock-mutation/', 0 ]);
    }

    open(obj: StockMutation) {
        console.log("nav ", obj);
        this.route.navigate(['/main/stock-mutation/' +  obj.id ]);
    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.stockMutations = data.contents;
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
        }
        return statusName;
    }

}
