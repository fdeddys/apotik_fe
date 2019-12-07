import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReceivingService } from './receiving.service';
import { Receive, ReceivingPageDto } from './receiving.model';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { Location } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';


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
        code: '',
        name: '',
    };
    closeResult: string;
    constructor(
        private route: Router,
        private receiveService: ReceivingService,
        private location: Location,
    ) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
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
