import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupDto } from '../lookup/lookup-dto.model';
import * as _ from 'lodash';
import { MerchantWip } from './merchant-wip.model';
import { APPROVED_BY_EDD_MSG } from 'src/app/shared/constants/base-constant';
import { MerchantWipConfirmModel } from './merchant-wip-confirm.model';
// import Swal from 'sweetalert2';

@Component({
  selector: 'op-merchant-wip-confirm-modal',
  templateUrl: './merchant-wip-confirm-modal.component.html',
    styleUrls: ['./merchant-wip-confirm-modal.css']
})
export class MerchantWipConfirmModalComponent implements OnInit {
    @Input() merchantWip: MerchantWip;
    @Input() lookupApproveReason: LookupDto[];
    @Input() lookupRejectReason: LookupDto[];
    @Input() lookupReturnReason: LookupDto[];

    // edd
    // eform
    @Input() sendFromModule: String;
    actionSelected;
    reasonApprove;
    reasonReject;
    reasonReturn;
    catatanKeputusan = '-';
    merchantWipConfirmModel: MerchantWipConfirmModel;

    actions = [
        { name: 'Disetujui', id: '0' },
        { name: 'Ditolak', id : '1'  },
        { name: 'Dikembalikan ke Verifier', id: '2' },
    ];

    constructor(private modalService: NgbModal) { }

    ngOnInit() {
        this.actionSelected = '0';
        // console.log('Lookup approvr ', this.lookupApproveReason);
        // console.log('Lookup reject ', this.lookupRejectReason);
        this.reasonApprove = this.lookupApproveReason[0];
        this.reasonReject = this.lookupRejectReason[0];
        this.reasonReturn = this.lookupReturnReason[0];
    }

    closeForm() {
        this.modalService.dismissAll('close');
    }

    save() {
        // this.modalService.
        // this.merchantWip.listMerchantOutletWIP = [];

        // action
        // 0 = approve
        // 1 = reject
        // 2 = back to verifier
        this.merchantWip.reason = this.catatanKeputusan;
        // 0 = approve
        if ( this.actionSelected === '0') {
            this.merchantWip.approvalNote = this.reasonApprove.code;
            // this.merchantWip.approvalStatus = this.reasonApprove.code ;
            // Swal.fire('Sucess', 'Save success', 'info');
            this.merchantWipConfirmModel = {
                merchantWIP : this.merchantWip,
                action : 0,
            };
            this.modalService.dismissAll(this.merchantWipConfirmModel);
            // this.modalService.dismissAll(this.merchantWip);
        }
        if (this.actionSelected === '1') {
            this.merchantWip.approvalNote = this.reasonReject.code;
            // this.merchantWip.approvalStatus = this.reasonReject.code;
            this.merchantWipConfirmModel = {
                merchantWIP: this.merchantWip,
                action: 1,
            };
            // Swal.fire('Sucess', 'Save success', 'info');
            this.modalService.dismissAll(this.merchantWipConfirmModel);
        }
        if (this.actionSelected === '2') {
            this.merchantWip.approvalNote = this.reasonReturn.code;
            // this.merchantWip.approvalStatus = this.reasonReturn.code;
            // Swal.fire('Sucess', 'Save success', 'info');
            this.merchantWipConfirmModel = {
                merchantWIP: this.merchantWip,
                action: 2,
            };
            this.modalService.dismissAll(this.merchantWipConfirmModel);
        }
        // this.merchantWip.statusRegistration = APPROVED_BY_EDD_MSG;

        // this.merchantWipService.saveWip(this.merchantWip, APPROVED_BY_EDD).subscribe(
        //     (res: HttpResponse<MerchantWip>) => this.onSuccessEdd('confirm', res.body),
        //     (res: HttpErrorResponse) => this.onError(res.message)
        // );
    }

}
