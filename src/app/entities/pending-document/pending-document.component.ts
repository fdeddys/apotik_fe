import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PendingDocumentService } from './pending-document.service';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PendingDocument } from './pending-document';

@Component({
  selector: 'op-pending-document',
  templateUrl: './pending-document.component.html',
  styleUrls: ['./pending-document.component.css']
})
export class PendingDocumentComponent implements OnInit {

    pendingDocumentList: PendingDocument[];
    searchTerm = {
        name: '',
        level: '',
        documentType: '',
        startDate: '',
        endDate: ''
    };

    levelList = [
        {
            code: '',
            name: 'All'
        },
        {
            code: 'merchant_group',
            name: 'Merchant Group'
        },
        {
            code: 'merchant',
            name: 'Merchant'
        },
    ];

    documentTypeList = [
        {
            code: '',
            name: 'All'
        },
        {
            code: '01',
            name: 'Photo Group'
        },
        {
            code: '02',
            name: 'SIUP'
        },
        {
            code: '03',
            name: 'NPWP'
        },
        {
            code: '04',
            name: 'PKS'
        },
        {
            code: '05',
            name: 'KTP Direksi'
        },
        {
            code: '06',
            name: 'Akta Pendirian'
        },
        {
            code: '07',
            name: 'KTP Penanggung Jawab'
        },
        {
            code: '08',
            name: 'Persetujuan Menkumham Untuk Akta'
        },
        {
            code: '09',
            name: 'Tanda Daftar Perusahaan'
        },
        {
            code: '10',
            name: 'KTP'
        },
        {
            code: '11',
            name: 'Selfie'
        },
        {
            code: '12',
            name: 'Photo Location'
        },
        {
            code: '13',
            name: 'Photo Location 2'
        },
        {
            code: '14',
            name: 'Signature'
        },
        {
            code: '15',
            name: 'Logo'
        },
    ];

    curPage = 1;
    totalData = 0;
    // totalRecord = TOTAL_RECORD_PER_PAGE;
    totalRecord = 5;

    dateStartMdl: NgbDateStruct;
    dateEndMdl: NgbDateStruct;


    constructor(private ngxService: NgxUiLoaderService,
                private pendingDocumentService: PendingDocumentService) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.ngxService.start();

        if (this.dateStartMdl && this.dateEndMdl) {
            this.searchTerm.startDate = this.dateStartMdl.year + '-' +
                ('0' + this.dateStartMdl.month).slice(-2) + '-' +
                ('0' + this.dateStartMdl.day).slice(-2);
            this.searchTerm.endDate = this.dateEndMdl.year + '-' +
                ('0' + this.dateEndMdl.month).slice(-2) + '-' +
                ('0' + this.dateEndMdl.day).slice(-2);
        }

        this.pendingDocumentService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord
        })
        .subscribe(
            (res: HttpResponse<PendingDocument[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    clearFilter() {
        this.searchTerm = {
            name: '',
            level: '',
            documentType: '',
            startDate: '',
            endDate: ''
        };
        this.loadAll(1);
    }

    private onSuccess(data, headers) {
        console.log(data);

        if (data.content.length < 0) {
            return;
        }
        this.pendingDocumentList = data.content;
        this.pendingDocumentList.forEach((element) => {
            const temp = element.documentPending.replace(/[|[]|]/g, ''); // remove char [ ]

            element.documentPendingData = temp.split(',');
            console.log(element);
        });
        this.totalData = data.totalElements;
        console.log('total data-->', this.totalData);
        this.ngxService.stop();
    }

    private onError(error) {
        console.log('error..');
        this.ngxService.stop();
    }

    loadPage() {
        this.loadAll(this.curPage);
        console.log(this.curPage);
    }


}
