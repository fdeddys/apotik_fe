import { Component, OnInit } from '@angular/core';
import { Adjustment, AdjustmentPageDto } from './adjustment.model';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { Router } from '@angular/router';
import { AdjustmentService } from './adjustment.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
    selector: 'op-adjustment',
    templateUrl: './adjustment.component.html',
    styleUrls: ['./adjustment.component.css']
})
export class AdjustmentComponent implements OnInit {

    adjustments: Adjustment[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        code: '',
        name: '',
        description : '',
    };
    closeResult: string;
    constructor(
        private route: Router,
        private adjustmentService: AdjustmentService,
        private location: Location,
    ) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.adjustmentService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<AdjustmentPageDto[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { }
        );
        console.log(page);
        // console.log(this.brand);
    }

    addNew() {
        this.route.navigate(['/main/adjustment/', 0 ]);
    }

    open(obj: Adjustment) {
        console.log("nav ", obj);
        this.route.navigate(['/main/adjustment/' +  obj.id ]);

    }

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.adjustments = data.contents;
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
            case 0:
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
