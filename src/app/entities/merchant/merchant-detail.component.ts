import { Component, OnInit } from '@angular/core';
import { MerchantService } from './merchant.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Merchant } from './merchant.model';
import { MerchantOutlet } from './merchant-outlet.model';
import { Router } from '@angular/router';
import { MerchantGroupService } from '../merchant-group/merchant-group.service';
import { LookupDto } from '../lookup/lookup-dto.model';
import { LOOKUP_JENIS_USAHA, LOOKUP_PROVINCE, ID_TYPE, GENDER } from 'src/app/shared/constants/base-constant';
import { PEKERJAAN, SETTLEMENT_CONFIG, LOOKUP_SEND_RPT_VIA } from 'src/app/shared/constants/base-constant';
import { LOOKUP_RPT_SETT_CFG, LOOKUP_SETT_EXEC_CFG } from 'src/app/shared/constants/base-constant';
import { LOOKUP_PROCESSING_FEE, LOOKUP_MDR, LOOKUP_DEVICE_TYPE } from 'src/app/shared/constants/base-constant';
import { LOOKUP_DEVICE_GROUP, LOOKUP_DEVICE_BRAND, SERVER_PATH, TO_REGISTERED } from 'src/app/shared/constants/base-constant';
import { LOOKUP_TIPE_MERCHANT, LOOKUP_CITY, OWNER_TITLE } from 'src/app/shared/constants/base-constant';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MerchantDetailOutletModalComponent } from './merchant-detail-outlet-modal.component';
import { Location } from '@angular/common';
import { LookupService } from '../lookup/lookup.service';
import { MerchantGroup } from '../merchant-group/merchant-group.model';

class ImageSnippet {
    constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'op-merchant-detail',
  templateUrl: './merchant-detail.component.html',
  styleUrls: ['./merchant-detail.component.css']
})
export class MerchantDetailComponent implements OnInit {

    idMerchant: number;
    merchant: Merchant;
    merchantOutlet: MerchantOutlet ;

    // model for metodePembayaran
    metodePembayaran = {};

    // metodePembayaran = {
    //     'QR': false,
    //     'CHIP_BASED_E_MONEY': false,
    //     'DEBIT_CARD': false,
    //     'CREDIT_CARD': false
    // }

    // images config
    pathImgServer: String = SERVER_PATH + 'images/previewImage?data=';
    // imgUrl
    imgUrlMerchantKtpPath;
    selectedFileImgMerchantKtpPath: ImageSnippet;
    imageMerchantKtpPathChange: Boolean = false;


    // initial for check button
    storeDataChecked = true;
    ownerDataChecked = false;
    settlementChecked = false;
    otherInfoChecked = false;
    outletChecked = false;
    otherChecked = false;

    lookupTempl: LookupDto[];

    lookupTipeMerchant: LookupDto [] = [];
    tipeMerchantSelected: LookupDto;

    lookupProvince: LookupDto [] = [];
    provinceSelected: LookupDto;

    lookupJenisUsaha: LookupDto [] = [];
    jenisUsahaSelected: LookupDto;

    lookupCity: LookupDto [] = [];
    citySelected: LookupDto;

    lookupOwnerTitle: LookupDto [] = [];
    ownerTitleSelected: LookupDto;

    lookupIdType: LookupDto [] = [];
    idTypeSelected: LookupDto;

    lookupGender: LookupDto[] = [];
    genderSelected: LookupDto;

    lookupPekerjaan: LookupDto[] = [];
    pekerjaanselected: LookupDto;

    lookupSettlementConfig: LookupDto[] = [];
    settlementConfigSelected: LookupDto;

    lookupReportSettlementConfig: LookupDto[] = [];
    reportSettlementConfigSelected: LookupDto;

    lookupSettlementExecutionConfig: LookupDto[] = [];
    settlementExecutionConfig: LookupDto;

    lookupSendRptVia: LookupDto[] = [];
    sendRptViaSelected: LookupDto;

    lookupProcessingFee: LookupDto[] = [];
    processingFeeSelected: LookupDto;

    lookupMDR: LookupDto[] = [];
    mdrSelected: LookupDto;

    lookupDeviceType: LookupDto[] = [];
    deviceTypeSelected: LookupDto;

    lookupDeviceGroup: LookupDto[] = [];
    deviceGroupSelected: LookupDto;

    lookupDeviceBrand: LookupDto [] = [];
    deviceBrandSelected: LookupDto;

    merchantGroup: MerchantGroup;

    ownerTanggalExpiredID: NgbDateStruct; // temp var for this.merchant.owner.ownerTangalExpiredID
    ownerTanggalLahir: NgbDateStruct; // temp var for this.merchant.owner.ownerTanggalLahir
    seumurHidupChecked = false;

    closeResult: string;

    constructor(private merchantService: MerchantService,
                private router: Router,
                private merchantGroupService: MerchantGroupService,
                private modalService: NgbModal,
                private lookupService: LookupService) { }

    ngOnInit() {
        console.log('Ng On Init start ');
        this.merchantOutlet = new MerchantOutlet();
        this.merchantService.dataSharing.subscribe(
            data => this.idMerchant = data
        );

        console.log('isi id merchant ', this.idMerchant);
        if (this.idMerchant !== 0 ) {
            // console.log(this.merchant);
            this.find(this.idMerchant);
        } else {
            // this.router.navigate(['main/merchant']);
            this.merchant = {};
            this.merchant.owner = {};
            this.merchant.merchantGroup = {};
            this.merchant.merchantGroup.merchantGroupSettlementInfo = {};
            this.merchant.merchantGroup.merchantGroupFeeInfo = {};
            this.merchant.settlementConfig = {};
        }
        this.loadLookup();

    }

    // load all lookup data for merchant
    loadLookup() {
        console.log('Start call lookup');
        this.lookupService.findForMerchantGroup()
            .subscribe(
                (res: HttpResponse<LookupDto[]>) => this.onSuccessLookup(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
            );
    }

    // fill data on merchant group service if success
    private onSuccessLookup(data, headers) {
        this.lookupTempl = data;
        this.breakLookup();
    }

    // start break lookup
    breakLookup() {
        this.lookupTempl.forEach(lookupdt  => {
            if (lookupdt.lookupGroupString === LOOKUP_JENIS_USAHA) {
                this.lookupJenisUsaha.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_PROVINCE) {
                this.lookupProvince.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_TIPE_MERCHANT) {
                this.lookupTipeMerchant.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_CITY) {
                this.lookupCity.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === OWNER_TITLE) {
                this.lookupOwnerTitle.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === ID_TYPE) {
                this.lookupIdType.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === GENDER) {
                this.lookupGender.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === PEKERJAAN) {
                this.lookupPekerjaan.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === SETTLEMENT_CONFIG) {
                this.lookupSettlementConfig.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_RPT_SETT_CFG) {
                this.lookupReportSettlementConfig.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_SETT_EXEC_CFG) {
                this.lookupSettlementExecutionConfig.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_SEND_RPT_VIA) {
                this.lookupSendRptVia.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_PROCESSING_FEE) {
                this.lookupProcessingFee.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_MDR) {
                this.lookupMDR.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_DEVICE_TYPE) {
                this.lookupDeviceType.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_DEVICE_GROUP) {
                this.lookupDeviceGroup.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_DEVICE_BRAND) {
                this.lookupDeviceBrand.push(lookupdt);
            }

            console.log('finish breakLookup ');
            this.defaultConfig();


            // if (lookupdt.lookupGroupString === LOOKUP_RPT_SETT_CFG) {
            //     // console.log(lookupdt);
            //     this.lookupRptSetCfg.push(lookupdt);
            // }
            // if (lookupdt.lookupGroupString === LOOKUP_SETT_EXEC_CFG) {
            //     // console.log(lookupdt);
            //     this.lookupSettExecCfg.push(lookupdt);
            // }
            // if (lookupdt.lookupGroupString === LOOKUP_SEND_RPT_VIA) {
            //     // console.log(lookupdt);
            //     this.lookupSendRptVia.push(lookupdt);
            // }
        });
    }

    defaultConfig(): void {
        console.log('next proc after break lookup');
            if (this.idMerchant !== 0) {
                console.log('params ==0');
                this.jenisUsahaSelected = this.lookupJenisUsaha[0];
                this.provinceSelected = this.lookupProvince[0];
                this.tipeMerchantSelected = this.lookupTipeMerchant[0];
                this.citySelected = this.lookupCity[0];
                this.mdrSelected = this.lookupMDR[0];
                this.processingFeeSelected = this.lookupProcessingFee[0];
                this.reportSettlementConfigSelected = this.lookupSettlementConfig[0];
                this.settlementExecutionConfig = this.lookupSettlementExecutionConfig[0];
                this.sendRptViaSelected = this.lookupSendRptVia[0];
                this.merchantGroup = new MerchantGroup();
                this.merchantGroup.id = 0;
                console.log('finish selected');
            }
    }

    find(id) {
        this.merchantService.find(id)
            .subscribe(
                (res: HttpResponse<Merchant>) => this.onSuccess(res.body),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    // fill data merchant after load
    onSuccess(merchant) {
        console.log(merchant);
        this.merchant = merchant;
        this.loadImageMerchant(merchant);
        // this.loadMerchantOutlet(0);

        // convert all string date to date
        this.convertToDate();

    }

    // convert string to date
    private convertToDate() {
        if (this.merchant.owner.ownerTanggalExpiredID !== null) {
            this.ownerTanggalExpiredID = {
                year: Number(this.merchant.owner.ownerTanggalExpiredID.substr(0, 4)),
                month: Number(this.merchant.owner.ownerTanggalExpiredID.substr(5, 2)),
                day: Number(this.merchant.owner.ownerTanggalExpiredID.substr(8, 2))
            };
            // set checked if expire seumur hidup
            if (this.merchant.owner.ownerTanggalExpiredID.substr(0, 4) === '2999') {
                this.seumurHidupChecked = true;
            }
        }

        if (this.merchant.owner.ownerTanggalLahir !== null) {
            this.ownerTanggalLahir = {
                year: Number(this.merchant.owner.ownerTanggalLahir.substr(0, 4)),
                month: Number(this.merchant.owner.ownerTanggalLahir.substr(5, 2)),
                day: Number(this.merchant.owner.ownerTanggalLahir.substr(8, 2))
            };
        }

    }

    private onError(error) {
        console.log('error..');
    }


    // open modal merchant oulet
    loadMerchantOutlet(i) {

        const modalRef = this.modalService.open(MerchantDetailOutletModalComponent, { size: 'lg' });
        modalRef.componentInstance.outlet = this.merchant.merchantOutlets[i];
        modalRef.componentInstance.lookupDeviceType = this.lookupDeviceType;
        modalRef.componentInstance.lookupDeviceGroup = this.lookupDeviceGroup;
        modalRef.componentInstance.lookupDeviceBrand = this.lookupDeviceBrand;
        modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    // function for load merchant outlet
    // loadMerchantOutlet(i) {
    //     if (this.merchant.merchantOutlets[0]) {
    //         this.merchantOutlet = this.merchant.merchantOutlets[i];
    //         console.log(this.merchant);
    //         this.metodePembayaran = JSON.parse(this.merchantOutlet.metodePembayaran);
    //         console.log(this.metodePembayaran);
    //     }
    // }

    // checked data after click tab
    ownerDataCheck() {
        this.ownerDataChecked = true;
    }

    // checked settlement after click tab
    settlementCheck() {
        this.settlementChecked = true;
    }

    // checked otherInfoCheck after click tab
    otherInfoCheck() {
        this.otherInfoChecked = true;
    }

    // checked otherInfoCheck after click tab
    outletCheck() {
        this.outletChecked = true;
    }

    // checked otherInfoCheck after click tab
    otherCheck() {
        this.otherChecked = true;
    }

    // enable / disable checked input
    seumurHidupCheckSelected() {
        this.ownerTanggalExpiredID = {
            year: Number('2999'),
            month: Number('12'),
            day: Number('31')
        };
        this.seumurHidupChecked = !this.seumurHidupChecked;
        // console.log(data);
    }

    private getDismissReason(reason: any): string {
        console.log(reason);
        return reason;
    }

    onBack() {
        this.router.navigate(['/main/merchant']);
    }

    onConfirm() {
        // this.workInProgress = this.merchant;
        // this.workInProgress.ownerWip = this.merchant.owner;
        // this.workInProgress.settlementConfigWIP = this.merchant.settlementConfig;

        // fill owner wip from owner
        // this.merchant.ownerWIP = this.merchant.owner;
        // // fill settlementconfig wip from settlementconfig
        // this.merchant.settlementConfigWip = this.merchant.settlementConfig;

        // // convert date format to string
        // this.merchant.ownerWIP.ownerTanggalLahir = this.ownerTanggalLahir.year + '-' +
        //     ('0' + this.ownerTanggalLahir.month).slice(-2) + '-' +
        //     ('0' + this.ownerTanggalLahir.day).slice(-2) + 'T00:00:00.000Z';
        // this.merchant.ownerWIP.ownerTanggalExpiredID = this.ownerTanggalExpiredID.year + '-' +
        //     ('0' + this.ownerTanggalExpiredID.month).slice(-2) + '-' +
        //     ('0' + this.ownerTanggalExpiredID.day).slice(-2) + 'T00:00:00.000Z';

        // this.merchantService.save(this.merchant, TO_REGISTERED).subscribe(result => {
        //     console.log(result);
        // });

        // // Image
        // if (this.imageMerchantKtpPathChange === true) {
        //     this.merchant.ktpPath = this.selectedFileImgMerchantKtpPath.file.name;
        // }

        // if (this.imageMerchantKtpPathChange === true) {
        //     this.merchantService.uploadImage(this.selectedFileImgMerchantKtpPath.file, 'siup', result.body.idMda.toString());
        // }

        // console.log(this.merchant.ktpPath);
    }


    // load image
    loadImageMerchant(merchant: Merchant) {
        this.imgUrlMerchantKtpPath = this.pathImgServer + merchant.ktpPath;
    }

    // upload file
    processFileImageMerchantKtp(imageInput: any) {
        console.log(imageInput);
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgMerchantKtpPath = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            console.log(reader.result);
            this.imgUrlMerchantKtpPath = reader.result;
            this.imageMerchantKtpPathChange = true;
        };
    }

}
