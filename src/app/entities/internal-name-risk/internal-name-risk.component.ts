import { Component, OnInit } from '@angular/core';
import { InternalNameRiskService } from './internal-name-risk.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { InternalNameRisk } from './internal-name-risk.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InternalNameRiskModalComponent } from './internal-name-risk.modal.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'op-internal-name-risk',
    templateUrl: './internal-name-risk.component.html',
    styleUrls: ['./internal-name-risk.component.css']
})
export class InternalNameRiskComponent implements OnInit {


    internalNameRiskList: InternalNameRisk[];
    curPage = 1;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    totalData = 0;


    searchTerm = {
        name: '',
    };

    closeResult: string;

    constructor(private internalNameRiskService: InternalNameRiskService,
                private modalService: NgbModal,
                private ngxService: NgxUiLoaderService) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.ngxService.start(); // start loader
        this.internalNameRiskService.filter({
            filter : this.searchTerm,
            page: page,
            count: this.totalRecord
        })
        .subscribe(
                    (res: HttpResponse<InternalNameRisk[]>) => this.onSuccess(res.body, res.headers),
                    (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    open(status, message) {
        const modalRef = this.modalService.open(InternalNameRiskModalComponent, { size: 'lg' });
        modalRef.componentInstance.statusRec = status;
        modalRef.componentInstance.objEdit = message;
        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log(this.closeResult);
            this.curPage = 1;
            this.loadAll(this.curPage);
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.curPage = 1;
            this.loadAll(this.curPage);
        });
    }

    private getDismissReason(reason: any): string {
        console.log(reason);
        return reason;
    }

    private onSuccess(data, headers) {
        this.ngxService.stop();
        if (data.content.length < 0) {
            return;
        }
        console.log(data);
        this.internalNameRiskList = data.content;
        this.totalData = data.totalElements;
    }

    private onError(error) {
        this.ngxService.stop();
        console.log('error..', error);
    }

    loadPage() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    resetFilter() {
        this.searchTerm = {
            name: '',
        };
        this.loadAll(1);
    }

}
