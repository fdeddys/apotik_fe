import { Component, OnInit } from '@angular/core';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { MasterDataApproval } from './master-data-approval.model';
import { MasterDataApprovalService } from './master-data-approval.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'op-master-data-approval',
    templateUrl: './master-data-approval.component.html',
    styleUrls: ['./master-data-approval.component.css']
})
export class MasterDataApprovalComponent implements OnInit {

    masterDataApprovalList: MasterDataApproval[];
    masterDataApproval: MasterDataApproval;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        moduleName: '',
    };
    closeResult: string;

    constructor(private masterDataApprovalService: MasterDataApprovalService,
                private modalService: NgbModal,
                private router: Router,
                private ngxService: NgxUiLoaderService) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    onFilter(): void {
        this.curPage = 1;
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        // start loader
        this.ngxService.start();

        console.log('Start call function all header');
        this.masterDataApprovalService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
            (res: HttpResponse<MasterDataApproval[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    private onSuccess(data, headers) {
        // stop loader
        this.ngxService.stop();

        if (data.content.length < 0) {
            return;
        }
        this.masterDataApprovalList = data.content;
        this.masterDataApprovalList.forEach(function(mda, index) {
            console.log(mda, index);
            mda.jsonApprovalData = JSON.parse(mda.jsonApprovalData);
            console.log(mda.jsonApprovalData.newData.name);
            if (!mda.jsonApprovalData.newData.name) {
                console.log('notfound');
                mda.jsonApprovalData.newData.name = mda.jsonApprovalData.newData.namaPT;
            }
        });
        this.totalData = data.totalElements;
    }

    private onError(error) {
        // start loader
        this.ngxService.stop();

        console.log('error..');
    }

    openDetail(id, moduleName, action) {
        this.masterDataApprovalService.sendData(id, moduleName, action);
        this.router.navigate(['main/masterDataApproval/detail']);
    }

    loadPage(event): void {
        this.loadAll(this.curPage);
    }
}
