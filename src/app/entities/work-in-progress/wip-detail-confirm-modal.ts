import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { WorkInProgressService } from './work-in-progress.service';
import { MerchantWipQueue } from './merchant-wip.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgbModal, NgbTypeahead, NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'op-wip-confirm-modal',
    templateUrl: './wip-detail-confirm-modal.html',
    styleUrls: ['./wip-detail-confirm-modal.css']
})
export class WipDetailConfirmModalComponent implements OnInit {
    @Input() priority;
    @Input() wipKey;

    @ViewChild('instance') instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    merchantWipQueue: MerchantWipQueue;

    constructor(private workInProgressService: WorkInProgressService,
                private modalService: NgbModal) { }

    ngOnInit() {
    }

    onKey() {

    }

    save(): void {
        let setKey = '"' + this.wipKey + '"';
        if(this.priority == 1){
            console.log("vip", );
            this.workInProgressService.setVip(setKey).subscribe(
                result => {
                    console.log("resultbody", result);
                    this.modalService.dismissAll('close');
                });;
        }else if (this.priority == 2){
            console.log("vvip", this.wipKey);
            this.workInProgressService.setVvip(setKey).subscribe(
                result => {
                    console.log("resultbody", result);
                    this.modalService.dismissAll('close');
                });;
        }
        // this.workInProgressService(this.userName, this.credential)
        //     .subscribe(
        //         result => {
        //             if (result.body.errCode === '00') {
        //                 Swal.fire('Success', 'Success change password', 'success');
        //                 this.closeForm('tutup save');
        //                 this.modalService.dismissAll('tutup save');
        //             } else {
        //                 Swal.fire('Failed', result.body.errDesc, 'error');
        //             }
        //         });
    }

    closeForm(reason): void {
        this.modalService.dismissAll(reason);
    }

}
