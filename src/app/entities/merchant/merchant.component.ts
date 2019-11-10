import { Component, OnInit } from '@angular/core';
import { MerchantService } from './merchant.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Merchant } from './merchant.model';
import { Router } from '@angular/router';
import { LookupService } from '../lookup/lookup.service';
import { LookupDto } from '../lookup/lookup-dto.model';
import { MerchantGroupService } from '../merchant-group/merchant-group.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'op-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {

    searchTerm = {
        name: '',
    };

    constructor(private merchantService: MerchantService,
            private router: Router,
            private lookupService: LookupService,
            private merchantGroupService: MerchantGroupService,
            private ngxService: NgxUiLoaderService) { }


    totalRecord = TOTAL_RECORD_PER_PAGE;
    curPage = 1;
    merchantList: Merchant[];
    totalData = 0;


    ngOnInit() {
        this.loadAll(this.curPage);
        // this.loadLookup();
    }

    loadAll(page) {
        // start loader
        this.ngxService.start();

        this.merchantService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord
        }).subscribe(
            (res: HttpResponse<Merchant[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );

    }

    // add new merchant and direct to merchant/detail
    addNew() {
        this.merchantService.sendData(0);
        this.router.navigate(['/main/merchant/detail']);
    }

    private onSuccess(data, headers) {
        // stop loader
        this.ngxService.stop();

        if (data.content.length < 0) {
            return;
        }
        this.merchantList = data.content;
        this.totalData = data.totalElements;
    }

    private onError(error) {
        // stop loader
        this.ngxService.stop();
        console.log('error..');
    }


    openDetail(idMerchant) {
        this.merchantService.sendData(idMerchant);
        this.router.navigate(['main/merchant/detail']);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadPage() {
        this.loadAll(this.curPage);
        console.log(this.curPage);
    }

}
