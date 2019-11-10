import { Component, OnInit } from '@angular/core';
import { MerchantGroup } from './merchant-group.model';
import { TOTAL_RECORD_PER_PAGE, LOOKUP_JENIS_USAHA } from 'src/app/shared/constants/base-constant';
import { MerchantGroupService } from './merchant-group.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LookupService } from '../lookup/lookup.service';
import { LookupDto } from '../lookup/lookup-dto.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'op-merchant-group',
    templateUrl: './merchant-group.component.html',
    styleUrls: ['./merchant-group.component.css']
})
export class MerchantGroupComponent implements OnInit {

    merchantGroupList: MerchantGroup[];
    merchantGroup: MerchantGroup;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        name: '',
    };

    lookupTemplate: LookupDto[];

    closeResult: string;
    constructor(private merchantGroupService: MerchantGroupService,
        private router: Router,
        private lookupService: LookupService,
        private ngxService: NgxUiLoaderService
    ) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    open(idMerchantGroup) {
        // this.merchantGroupService.updateData(merchantGroup);
        // this.loadLookup();
        console.log('id merchant ', idMerchantGroup);
        this.router.navigate(['/main/merchantGroup/', idMerchantGroup]);
    }

    loadAll(page) {
        // start loader
        this.ngxService.start();

        console.log('Start call function all header');
        this.merchantGroupService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
            (res: HttpResponse<MerchantGroup[]>) => this.onSuccess(res.body, res.headers),
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
        this.merchantGroupList = data.content;
        this.totalData = data.totalElements;
    }

    private onError(error) {
        // stop loader
        this.ngxService.stop();
        console.log('error..');
    }
    loadPage() {
        this.loadAll(this.curPage);
        console.log(this.curPage);
    }

}
