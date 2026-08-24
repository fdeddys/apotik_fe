import { Component, OnInit } from '@angular/core';
import { TOTAL_RECORD_PER_PAGE } from 'src/app/shared/constants/base-constant';
import { Pelanggan, PelangganPageDto } from './pelanggan.model';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PelangganService } from './pelanggan.service';
import { PelangganModalComponent } from './pelanggan-modal/pelanggan-modal.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'op-pelanggan',
    templateUrl: './pelanggan.component.html',
    styleUrls: ['./pelanggan.component.css']
})
export class PelangganComponent implements OnInit {

    pelanggans: Pelanggan[];
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    searchTerm = {
        name: '',
    };
    closeResult: string;

    constructor(
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private pelangganService: PelangganService,
        private location: Location,
    ) { }

    ngOnInit() {
        this.loadAll(this.curPage);
    }

    onFilter() {
        this.loadAll(this.curPage);
    }

    loadAll(page) {
        this.pelangganService.filter({
            filter: this.searchTerm,
            page: page,
            count: this.totalRecord,
        }).subscribe(
            (res: HttpResponse<PelangganPageDto>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    open(status, obj) {
        const modalRef = this.modalService.open(PelangganModalComponent, { size: 'lg' });
        modalRef.componentInstance.statusRec = status;
        modalRef.componentInstance.objEdit = obj;

        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            this.curPage = 1;
            this.loadAll(this.curPage);
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.loadAll(this.curPage);
        });
    }

    delete(pelanggan: Pelanggan) {
        Swal.fire({
            title: 'Delete',
            text: `Apakah anda yakin ingin menghapus pelanggan ${pelanggan.nama}?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.pelangganService.delete(pelanggan.id).subscribe((res) => {
                    if (res.body.errCode === '00') {
                        Swal.fire('Success', 'Pelanggan berhasil dihapus', 'success');
                        this.loadAll(this.curPage);
                    } else {
                        Swal.fire('Error', res.body.errDesc, 'error');
                    }
                });
            }
        });
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

    private onSuccess(data, headers) {
        if (data.contents.length < 0) {
            return;
        }
        this.pelanggans = data.contents;
        this.totalData = data.totalRow;
    }

    private onError(error) {
        console.log('error..', error);
    }

    resetFilter() {
        this.searchTerm = {
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
}
