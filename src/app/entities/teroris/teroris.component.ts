import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TerorisModalComponent } from './teroris.modal.component';
import { TerorisService } from './teroris.service';
import { Teroris } from './teroris.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { SharedService } from 'src/app/shared/sidebar/share.service';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
    selector: 'op-teroris',
    templateUrl: './teroris.component.html',
    styleUrls: ['./teroris.component.css']
})
export class TerorisComponent implements OnInit {

    listTypeIds: string[];
    terorisList: Teroris[];
    teroris: Teroris;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        name: '',
    };

    closeResult: string;
    constructor(private modalService: NgbModal,
        private terorisService: TerorisService,
        private shareModule: SharedService,
        private ngxService: NgxUiLoaderService) { }

    ngOnInit() {
        this.shareModule.getStatus()
            .subscribe(
                (res: HttpResponse<string[]>) => {
                    this.listTypeIds = res.body;
                    console.log('--->', this.listTypeIds);
                }
            );
        this.curPage = 1;
        this.loadAll(this.curPage);
    }

    onFilter() {
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'You wont be refresh this page !',
        //     type: 'warning',
        //     timer: 1500,
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: 'Yes, doit !'}).then(() => {
        //         console.log('page ->', this.curPage);
        //         this.loadAll(this.curPage);
        //     });

        this.loadAll(this.curPage);

        // Swal.fire({
        //     title: 'Tanya dulu gan?',
        //     text: 'Refresh data ?',
        //     type: 'question',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'just duit gaes!'
        // }).then((result) => {
        //     if (result.value) {
        //         console.log(result.value);
        //         this.loadAll(this.curPage);
        //     }
        //     console.log(result.value);
        // });
    }

  open(status, pesan) {
    // const modalRef = this.modalService.open(TerorisModalComponent, { size: 'lg' });
    // modalRef.componentInstance.name = 'World';
    // console.log('pesannn->', pesan);
    // return;

    // pub sub
    this.terorisService.updateData(this.terorisList[0]);

        // pub sub
        this.terorisService.updateData(this.terorisList[0]);

        const modalRef = this.modalService.open(TerorisModalComponent, { size: 'lg' });
        modalRef.componentInstance.statusRec = status;
        modalRef.componentInstance.objEdit = pesan;
        modalRef.componentInstance.listTypeIds = this.listTypeIds;
        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log(this.closeResult);
            // if (this.closeResult === 'refresh') {
            //   this.curPage = 1 ;
            //   this.loadAll(this.curPage);
            // }
            this.curPage = 1;
            this.loadAll(this.curPage);
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
            this.curPage = 1;
            this.loadAll(this.curPage);
        });

    }

    loadAll(page) {
        this.ngxService.start();
        console.log('Start call function all header');
        this.terorisService.filter({
                filter: this.searchTerm,
                page: page,
                count: this.totalRecord,
            })
            .subscribe(
                (res: HttpResponse<Teroris[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
            );
    }

    private onSuccess(data, headers) {
        if (data.content.length < 0) {
            return;
        }
        this.terorisList = data.content;
        this.totalData = data.totalElements;
        this.ngxService.stop();
    }

    private onError(error) {
        console.log('error..');
        this.ngxService.stop();
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }


    loadPage() {
        this.loadAll(this.curPage);
        console.log(this.curPage);
    }

}

