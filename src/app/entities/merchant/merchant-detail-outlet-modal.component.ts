import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupDto } from '../lookup/lookup-dto.model';
import * as _ from 'lodash';
import { MerchantOutlet } from './merchant-outlet.model';

@Component({
  selector: 'op-merchant-detail-outlet-modal',
  templateUrl: './merchant-detail-outlet-modal.component.html',
  styleUrls: ['./merchant-detail-outlet-modal.component.css']
})
export class MerchantDetailOutletModalComponent implements OnInit {
    @Input() outlet: MerchantOutlet;
    @Input() lookupDeviceType: LookupDto[];
    @Input() lookupDeviceGroup;
    @Input() lookupDeviceBrand;
    @Input() lookupHostType;
    @Input() statusRec;
    @Input() enableSave: Boolean = true;

    metodePembayaran = {
        QR: false,
        EMV: false,
        NFC: false,
    };

    deviceTypeSelected: LookupDto;
    hostTypeSelected: LookupDto;

    submitted = false;

    constructor(
        private modalService: NgbModal,
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {

        // this.metodePembayaran = JSON.parse(this.outlet.metodePembayaran);
        console.log(this.metodePembayaran);
        console.log('host type ----> ', this.lookupHostType);
        // if (this.outlet.id === 0 ) {
            // this.outlet.metodePembayaran = '0000';
            // this.defaultTypePembayaran(true);
            // return ;
        // }
        // this.setJenisUsahaSelected(this.outlet.deviceType);
        this.defaultTypePembayaran();
    }

    defaultTypePembayaran() {

        this.metodePembayaran.QR = false;
        this.metodePembayaran.EMV = false;
        this.metodePembayaran.NFC = false;
        console.log('method pembayaran =>', this.outlet.metodePembayaran);
        if (this.outlet.metodePembayaran.length >= 1) {
            console.log('qr =>', this.outlet.metodePembayaran.substr(0, 1));
            if (this.outlet.metodePembayaran.substr(0, 1) === '1') {
                this.metodePembayaran.QR = true;
            }
        }

        if (this.outlet.metodePembayaran.length >= 2) {
            console.log('emv =>', this.outlet.metodePembayaran.substr(1, 1));
            if (this.outlet.metodePembayaran.substr(1, 1) === '1') {
                this.metodePembayaran.EMV = true;
            }
        }

        if (this.outlet.metodePembayaran.length >= 3) {
            console.log('nfc =>', this.outlet.metodePembayaran.substr(2, 1));
            if (this.outlet.metodePembayaran.substr(2, 1) === '1') {
                this.metodePembayaran.NFC = true;
            }
        }
    }

    validate(): void {
        this.submitted = true;
        this.outlet.merchantOutletSign = '-';
        let iter = 0;
        _.forOwn(this.outlet, function (value, key) {
            // console.log(key);
            if (key === 'merchantName' || key === 'merchantOutletSign' || key === 'terminalLabel' ||
                key === 'terminalPhoneNumber' || key === 'terminalProvider' ||
                key === 'deviceOwnerName' || key === 'deviceOwnerAddress' ||
                key === 'terminalSerialNo' || key === 'mid' || key === 'tid'
            ) {
                // console.log('test 1 ', value);
                if (value === '' || value === null || value === undefined) {
                    iter++;
                }
            }
        });

        console.log('iter : ', iter);
        if (iter > 0) {
            return;
        }

        this.onConfirm();
    }

    onConfirm() {
        let paymentMethod ;
        if (this.metodePembayaran.QR === true) {
            paymentMethod = '1';
        } else {
            paymentMethod = '0';
        }
        if (this.metodePembayaran.EMV === true) {
            paymentMethod = paymentMethod  + '1';
        } else {
            paymentMethod = paymentMethod  + '0';
        }
        if (this.metodePembayaran.NFC === true) {
            paymentMethod = paymentMethod  + '1';
        } else {
            paymentMethod = paymentMethod  + '0';
        }
        this.outlet.metodePembayaran = paymentMethod;
        console.log('on confirm =>', this.outlet);
        this.activeModal.close(this.outlet);
    }

    closeForm() {
        this.modalService.dismissAll('refresh');
    }

    // setJenisUsahaSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupDeviceType, (lookup) => lookup.name == name);
    //     console.log('hasil lodash jenis usaha -> ', result);
    //     this.deviceTypeSelected = result;
    // }
}
