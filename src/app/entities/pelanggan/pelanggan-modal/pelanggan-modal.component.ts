import { Component, OnInit, Input } from '@angular/core';
import { Pelanggan } from '../pelanggan.model';
import { PelangganService } from '../pelanggan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
    selector: 'op-pelanggan-modal',
    templateUrl: './pelanggan-modal.component.html',
    styleUrls: ['./pelanggan-modal.component.css']
})
export class PelangganModalComponent implements OnInit {

    @Input() statusRec;
    @Input() objEdit: Pelanggan;
    @Input() viewMsg;

    pelanggan: Pelanggan;
    isFormDirty: Boolean = false;

    tglMasukFormatted: string;

    constructor(
        public pelangganService: PelangganService,
        public modalService: NgbModal
    ) { }

    ngOnInit() {
        console.log('obj to edit -> ', this.objEdit);
        console.log(this.statusRec);
        if (this.statusRec === 'addnew') {
            this.setDefaultValue();
        } else {
            this.pelanggan = Object.assign({}, this.objEdit);
            if (this.pelanggan.tglMasuk) {
                this.tglMasukFormatted = this.pelanggan.tglMasuk.substring(0, 10);
            }
        }
    }

    setDefaultValue() {
        this.pelanggan = new Pelanggan();
        this.tglMasukFormatted = '';
    }

    save(): void {
        if (this.tglMasukFormatted) {
            this.pelanggan.tglMasuk = this.tglMasukFormatted + 'T00:00:00Z';
        } else {
            this.pelanggan.tglMasuk = null;
        }

        if (!this.pelanggan.nama || this.pelanggan.nama.trim() === '') {
            Swal.fire('Error', 'Nama pelanggan tidak boleh kosong', 'error');
            return;
        }

        this.pelangganService.save(this.pelanggan).subscribe(result => {
            this.isFormDirty = true;
            if (result.body.errCode === '00') {
                Swal.fire('Success', 'Save success', 'info');
                this.modalService.dismissAll('refresh');
            } else {
                Swal.fire('Error', result.body.errDesc, 'error');
            }
        });
    }

    closeForm(): void {
        if (this.isFormDirty === true) {
            this.modalService.dismissAll('refresh');
        } else {
            this.modalService.dismissAll('close');
        }
    }
}
