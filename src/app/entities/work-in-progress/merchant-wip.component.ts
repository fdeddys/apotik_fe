import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { MerchantGroupService } from '../merchant-group/merchant-group.service';
import { LookupDto } from '../lookup/lookup-dto.model';
import { LOOKUP_JENIS_USAHA, LOOKUP_PROVINCE, ID_TYPE, GENDER, PEKERJAAN, HOST_TYPE,
         LOOKUP_MERCHANT_CATEGORY_CODE, 
         LOOKUP_DISTRICT} from 'src/app/shared/constants/base-constant';
import { SETTLEMENT_CONFIG, LOOKUP_SEND_RPT_VIA, LOOKUP_RPT_SETT_CFG, LOOKUP_SETT_EXEC_CFG} from 'src/app/shared/constants/base-constant';
import { LOOKUP_PROCESSING_FEE, LOOKUP_MDR, LOOKUP_DEVICE_TYPE, LOOKUP_DEVICE_GROUP } from 'src/app/shared/constants/base-constant';
import { LOOKUP_DEVICE_BRAND, LOOKUP_PROCESSING_CONFIG  } from 'src/app/shared/constants/base-constant';
import { SERVER_PATH, TO_REGISTERED, TO_REGISTERED_MSG } from 'src/app/shared/constants/base-constant';
import { LOOKUP_TIPE_MERCHANT, LOOKUP_CITY, OWNER_TITLE } from 'src/app/shared/constants/base-constant';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../lookup/lookup.service';
import { MerchantService } from '../merchant/merchant.service';
import { Merchant } from '../merchant/merchant.model';
import { MerchantDetailOutletModalComponent } from '../merchant/merchant-detail-outlet-modal.component';
import { MerchantOutlet } from '../merchant/merchant-outlet.model';
import { MerchantWip } from './merchant-wip.model';
import { WorkInProgressService } from './work-in-progress.service';
import { MerchantDetailOutletService } from '../merchant/merchant-detail-outlet.service';
import Swal from 'sweetalert2';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MerchantGroup } from '../merchant-group/merchant-group.model';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Lookup } from '../lookup/lookup.model';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Dati2Service } from '../dati2/dati2.service';
import { Provinsi } from '../provinsi/provinsi.model';
import { ProvinsiService } from '../provinsi/provinsi.service';
import { Dati2 } from '../dati2/dati2.model';
import { KecamatanService } from '../kecamatan/kecamatan.service';
import { Kecamatan } from '../kecamatan/kecamatan.model';
import { Kelurahan } from '../kelurahan/kelurahan.model';
import { KelurahanService } from '../kelurahan/kelurahan.service'; 

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'op-merchant-wip',
  templateUrl: './merchant-wip.component.html',
  styleUrls: ['./merchant-wip.component.css']
})
export class MerchantWipComponent implements OnInit {

    provinsiSelected = '0';
    citySelected2 = '0';
    kecamatanSelected2 = '0';
    kelurahanSelected2 = '0';
    provinceOwnerSelected2 = '0';
    kabupatenOwnerSelected2 = '0';
    kecamatanOwnerSelected2 ='0';
    kelurahanOwnerSelected2 = '0';

    listProvince: Provinsi[] = [];
    listCity: Dati2[] = [];
    listKecamatan: Kecamatan[] = [];
    listKelurahan: Kelurahan[] = [];
    listOwnerProvince: Provinsi[] = [];
    listOwnerCity: Dati2[] = [];
    listOwnerKecamatan: Kecamatan[] = [];
    listOwnerKelurahan: Kelurahan[] = [];

    //==========================================

    // Fill Default Data
    fillDefaultData = false;

    provinceSelected3: string;
    citySelected3: string;
    kecamatanSelected3: string;
    kelurahanSelected3: string;

    moduleName = '';
    statusView = 'Registered';

    imgKtpPath = 'mr_ktp';
    imgLocationPath = 'mr_image_location';
    imgLocation2Path = 'mr_image_location2';
    imgOutletPath = 'mr_outlet_path';
    imgSelfie = 'mr_selfie';
    imgSignPath = 'mr_sign_path';

    addMerchantOutlet = true;
    idMerchant: number;
    buttonSuspense = false;
    statusSuspense = true;
    merchant: Merchant;
    merchantOutlet: MerchantOutlet;
    merchantOutletList: MerchantOutlet[];

    merchantWip: MerchantWip;
    statusRec: string  ;

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
    pathImgMerchantServer: String = SERVER_PATH + 'images/previewImageMerchant?data=';


    // imgUrl
    imgUrlMerchantKtpPath;
    imgUrlMerchantSelfiePath;
    imgUrlMerchantPhotoLocPath;
    imgUrlMerchantPhotoLoc2Path;
    imgUrlMerchantSignaturePath;
    imgUrlMerchantLogoPath;

    selectedFileImgMerchantKtpPath: ImageSnippet;
    selectedFileImgSelfiePath: ImageSnippet;
    selectedFileImgPhotoLocPath: ImageSnippet;
    selectedFileImgPhotoLoc2Path: ImageSnippet;
    selectedFileImgSignaturePath: ImageSnippet;
    selectedFileImgLogoPath: ImageSnippet;

    imageMerchantKtpPathChange: Boolean = false;
    imageMerchantSelfiePathChange: Boolean = false;
    imageMerchantPhotoLocPathChange: Boolean = false;
    imageMerchantPhotoLoc2PathChange: Boolean = false;
    imageMerchantSignaturePathChange: Boolean = false;
    imageMerchantLogoPathChange: Boolean = false;

    // initial for check button
    storeDataChecked = true;
    ownerDataChecked = false;
    settlementChecked = false;
    otherInfoChecked = false;
    outletChecked = false;
    otherChecked = false;

    lookupTempl: LookupDto[];

    lookupTipeMerchant: LookupDto[] = [];
    lookupProvince: LookupDto[] = [];
    lookupJenisUsaha: LookupDto[] = [];
    lookupCity: LookupDto[] = [];
    // lookupKecamatan: LookupDto[] = [];
    lookupOwnerTitle: LookupDto[] = [];
    lookupIdType: LookupDto[] = [];
    lookupGender: LookupDto[] = [];
    lookupPekerjaan: LookupDto[] = [];
    lookupSettlementConfig: LookupDto[] = [];
    lookupReportSettlementConfig: LookupDto[] = [];
    lookupSettlementExecutionConfig: LookupDto[] = [];
    lookupSendRptVia: LookupDto[] = [];
    lookupMerchantCategoryCode: LookupDto[] = [];
    lookupCity2: LookupDto[] = [];

    lookupProcessingConfig: LookupDto[] = [];
    lookupProcessingFee: LookupDto[] = [];
    lookupMDR: LookupDto[] = [];
    lookupDeviceType: LookupDto[] = [];
    lookupDeviceGroup: LookupDto[] = [];
    lookupDeviceBrand: LookupDto[] = [];
    lookupHostType: LookupDto[] = [];

    lookupMerchantGroup: MerchantGroup[] = [];

    tipeMerchantUmkm: string;
    tipeMerchantModern: string;
    tipeMerchantECommerce: string;

    tipeMerchantSelected: string;
    jenisUsahaSelected: string;
    provinceSelected: string;
    citySelected: string;
    kecamatanSelected: string;
    kelurahanSelected: string;
    ownerTitleSelected: string;

    provinceOwnerSelected: string;
    kabupatenOwnerSelected: string;
    idTypeSelected: string;
    genderSelected: string;
    pekerjaanselected: string;
    settlementConfigSelected: string;
    reportSettlementConfigSelected: string;
    settlementExecutionConfigSelected: string;
    sendRptViaSelected: string;
    processingConfigSelected: string;
    processingFeeSelected: string;
    merchantCategoryCodeSelected: string;

    mdrSelected: string;
    deviceTypeSelected: string;
    deviceGroupSelected: string;
    deviceBrandSelected: string;

    merchantGroupSelected: number;

    ownerTanggalExpiredID: NgbDateStruct; // temp var for this.merchant.owner.ownerTangalExpiredID
    ownerTanggalLahir: NgbDateStruct; // temp var for this.merchant.owner.ownerTanggalLahir
    seumurHidupChecked = false;

    closeResult: string;

    totalDataOutlets = 0;
    totalRecordOutlets = 5;
    curPageOutlets = 1;

    // defaultBelumDipilih: LookupDto = {
    //     name: "-- BELUM DI PILIH --",
    //     id: null
    // }

    submitted = false;
    mdtArrMWip = ['storeName', 'jenisUsaha', 'alamat', 'kelurahan', 'kecamatan',
    'postalCode', 'longitude', 'latitude', 'jamOperasional',
    'merchantOutletID', 'merchantPan', 'referralCode',
    'merchantCategoryCode', 'apiKey', 'secretID', 'notes'];

    mdtArrMWipLokasiBisnis = ['lokasiBisnis',
        'jenisLokasiBisnis'];

    // storePhoneNumber

    // mdtArrOwnWip = ['ownerFirstName', 'ownerLastName', 'ownerAddress',
    // 'ownerKelurahan', 'ownerKecamatan', 'ownerNoID', 'ownerNoTelp',
    // 'ownerTelpLain', 'ownerTempatLahir', 'ownerNamaIbuKandung'];

    mdtArrOwnWip = ['ownerFirstName', 'ownerLastName', 'ownerAddress', 'ownerNoID', 'ownerNoTelp',
        'ownerTelpLain', 'ownerTempatLahir', 'ownerNamaIbuKandung'];

    mdtArrSetConfWIP = ['processingFeeValue', 'rentalEdcFee', 'mdrEmoneyOnUs', 'mdrEmoneyOffUs',
    'mdrDebitOnUs', 'mdrDebitOffUs', 'mdrCreditOnUs', 'mdrCreditOffUs', 'otherFee', 'fmsFee'];

    merchantLevelSelected;
    levels = [
        { code: '0', name: 'Silver' },
        { code: '10', name: 'Gold' }
    ];
    constructor(
        private merchantService: MerchantService,
        private merchantWipService: WorkInProgressService,
        private router: Router,
        private merchantGroupService: MerchantGroupService,
        private modalService: NgbModal,
        private lookupService: LookupService,
        private ngxService: NgxUiLoaderService,
        private merchantDetailOutletService: MerchantDetailOutletService,
        private toastrService: ToastrService,
        private dati2Service: Dati2Service,
        private provinceService: ProvinsiService,
        private kecamatanService: KecamatanService,
        private kelurahanService: KelurahanService
    ) { }

    ngOnInit() {

        this.merchantLevelSelected = this.levels[0].code;
        
        // load all data provinces
        this.loadListProvince();
        

        this.moduleName = 'Merchant View';
        this.merchantOutlet = new MerchantOutlet();
        this.merchantOutletList = [];
        this.merchantService.dataSharing.subscribe(
            data => this.idMerchant = data
        );

        //==========================================================

        console.log('id merchant -->', this.idMerchant);
        if (this.idMerchant !== 0) { // EDIT

            this.buttonSuspense = true;
            this.find(this.idMerchant);

        } else { // ADD NEW
            
            this.loadLookup();
            this.loadLookupMerchantGroup();
            this.merchantWip = {};
            this.merchantWip.ownerWIP = {};
            this.merchantWip.merchantGroupId = 0;
            this.merchantWip.settlementConfigWIP = {};
            
            this.defaultTglExpiredId();
            this.defaultTglLahir();
            // this.merchantWip.merchantPan = 'Generated by system';

            if (this.fillDefaultData) {
                this.loadDefaultData();
            } else {
                this.loadDefaultSettlemenConfig();
            }

        }

        console.log(this.merchantWip);
        console.log('hasil find --------->', this.merchantWip);
        this.statusRec = '';
    }

    loadDefaultSettlemenConfig() {
        this.merchantWip.settlementConfigWIP = {
            processingFeeValue: 0,
            rentalEdcFee: 0,
            mdrCreditOffUs: 0,
            mdrCreditOnUs: 0,
            mdrDebitOffUs: 0,
            mdrDebitOnUs: 0,
            mdrEmoneyOffUs: 0,
            mdrEmoneyOnUs: 0,
            otherFee: 0,
            fmsFee: 0,
        };
    }

    private loadListProvince() {
        // this.ngxService.start();
        this.provinceService.getAll()
            .subscribe(
                (res: HttpResponse<Provinsi[]>) => this.onSuccessProvince(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
            );
    }

    private loadListCity(id) {

        this.dati2Service.getByProvinsiId(id)
            .subscribe(
                (res: HttpResponse<MerchantGroup[]>) => this.onSuccessFilterCity(res.body),
                (res: HttpErrorResponse) => this.onErrorMG(res.message),
                () => { this.ngxService.stop(); console.log('Finally Dati2'); }
            )
    }

    private loadListKecamatan(id) {

        this.kecamatanService.getByDati2Id(id).subscribe(
            (res: HttpResponse<MerchantGroup[]>) => this.onSuccessFilterKecamatan(res.body),
            (res: HttpErrorResponse) => this.onErrorMG(res.message),
            () => { this.ngxService.stop(); console.log('Finally Kecamatan'); }
        )
    }

    private loadListKelurahan(id) {

        this.kelurahanService.getByKecamatanId(id).subscribe(
            (res: HttpResponse<MerchantGroup[]>) => this.onSuccessFilterKelurahan(res.body),
            (res: HttpErrorResponse) => this.onErrorMG(res.message),
            () => { this.ngxService.stop(); console.log('Finally Kelurahan'); }
        )
    }
    
    private loadListOwnerCity(id) {

        this.dati2Service.getByProvinsiId(id)
            .subscribe(
                (res: HttpResponse<MerchantGroup[]>) => this.onSuccessFilterCity2(res.body),
                (res: HttpErrorResponse) => this.onErrorMG(res.message),
                () => { this.ngxService.stop(); console.log('Finally Dati2'); }
            )
    }

    private loadListOwnerKecamatan(id) {

        this.kecamatanService.getByDati2Id(id).subscribe(
            (res: HttpResponse<MerchantGroup[]>) => this.onSuccessFilterKecamatan2(res.body),
            (res: HttpErrorResponse) => this.onErrorMG(res.message),
            () => { this.ngxService.stop(); console.log('Finally Kecamatan'); }
        )
    }

    private loadListOwnerKelurahan(id) {

        this.kelurahanService.getByKecamatanId(id).subscribe(
            (res: HttpResponse<MerchantGroup[]>) => this.onSuccessFilterKelurahan2(res.body),
            (res: HttpErrorResponse) => this.onErrorMG(res.message),
            () => { this.ngxService.stop(); console.log('Finally Kelurahan'); }
        )
    }

    private onSuccessProvince(data, headers) {
        this.listProvince = data; 
        this.listOwnerProvince = data;
    }

    private onSuccessFilterCity(data) {
        this.listCity = data;
    }

    private onSuccessFilterKecamatan(data) {
        this.listKecamatan = data;
    }

    private onSuccessFilterKelurahan(data) {
        this.listKelurahan = data;
    }

    private onSuccessProvince2(data, headers) {
        this.listOwnerProvince = data;

    }

    private onSuccessFilterCity2(data) {
        this.listOwnerCity = data;
    }

    private onSuccessFilterKecamatan2(data) {
        this.listOwnerKecamatan = data;
    }

    private onSuccessFilterKelurahan2(data) {
        this.listOwnerKelurahan = data;
    }

    loadDefaultData() {
        this.merchantWip = {
            agentID: 'DEFAULT',
            agentName: 'DEFAULT',
            alamat: 'jl. jalanan',
            apiKey: 'http://18.138.15.214:8080/rose/#/main/merchant/det',
            hostStatus: null,
            idMerchant: 354,
            institutionID: null,
            jamOperasional: '08.00-22.00',
            jenisLokasiBisnis: 'Toko bebas',
            jenisUsaha: 'AC dan Jasa Perbaikan Rumah',
            jenisUsahaName: null,
            kabupatenKota: 'KOTA BEKASI',
            kabupatenKotaName: null,
            kecamatan: 'jalanan',
            kelurahan: 'jalan',
            ktpPath: 'merchant/ktp',
            latitude: 'tunggu',
            logoPath: 'zjajhaha',
            lokasiBisnis: 'Planet bekasi',
            longitude: 'belum',
            merchantCategoryCode: '019010101',
            merchantGroupId: 7,
            merchantOutletID: '123123',
            merchantPhoto2Path: 'ansnam',
            merchantPhotoPath: 'janjanzjanz',
            merchantType: 'Modern',
            notes: 'notes',
            ownerWIP: {
                ownerAddress: 'jl. jalanan',
                ownerEmail: 'direktu@gmail.com',
                ownerFirstName: 'Echo',
                ownerJenisKelamin: 'Perempuan',
                ownerKabupaten: 'KOTA BEKASI',
                ownerKabupatenName: null,
                ownerKecamatan: 'suka suka',
                ownerKelurahan: 'jl. jalanan',
                ownerKodePos: '17131',
                ownerLastName: 'Echo',
                ownerNamaIbuKandung: 'Aisyha',
                ownerNoID: '123444',
                ownerNoTelp: '085342920295',
                ownerPekerjaan: 'Direktur',
                ownerProvinsi: 'Jawa Barat',
                ownerProvinsiName: null,
                ownerRt: '4',
                ownerRw: '3',
                ownerTanggalExpiredID: '2999-12-01T00:00:00.000Z',
                ownerTanggalLahir: '2019-06-15T00:00:00.000Z',
                ownerTelpLain: '1244',
                ownerTempatLahir: 'planet',
                ownerTipeID: 'Others',
                ownerTitle: 'Ibu'
            },
            postalCode: '17131',
            provinsi: 'Jawa Barat',
            provinsiName: null,
            reason: null,
            referralCode: '8989989898',
            secretID: '1233ww',
            secretQuestion: null,
            secretQuestionAnswer: null,
            selfiePath: 'qghsqhjs',
            settlementConfigWIP: {
                mdr: 'Percentage',
                mdrCreditOffUs: -10,
                mdrCreditOnUs: 5,
                mdrDebitOffUs: -10,
                mdrDebitOnUs: -10,
                mdrEmoneyOffUs: 10,
                mdrEmoneyOnUs: 10,
                namaBankTujuanSettlement: 'Mandisendiri',
                namaPemilikRekening: 'Echo',
                noRekeningToko: '12345678910',
                otherFee: 5,
                fmsFee: 3,
                processingConfiguration: 'Individual',
                processingConfigurationName: null,
                processingFee: 'Percentage',
                processingFeeValue: 6,
                rentalEdcFee: 20000,
                reportSettlementConfig: 'H+3',
                reportSettlementConfigName: null,
                sendReportUrl: 'Doc',
                sendReportVia: 'FTP',
                settlementConfig: 'Individual',
                settlementConfigName: null,
                settlementExecutionConfig: 'H+2',
                settlementExecutionConfigName: null,
                status: 1,
                tipeRekening: 'Apaaja'
            },
            signPath: 'anbahghs',
            statusRegistration: 'REGISTERED',
            storeName: 'toko default',
            storePhoneNumber: '085342920295'
        };
    }

  // load all lookup data for merchant
    loadLookup() {
        this.ngxService.start();
        console.log('Start call lookup');
        this.lookupService.findForMerchantGroup()
        .subscribe(
            (res: HttpResponse<LookupDto[]>) => this.onSuccessLookup({ data: res.body, headers: res.headers }),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { this.ngxService.stop(); console.log('finally'); }
        );
    }

    loadLookupMerchantGroup() {
        this.ngxService.start();
        this.merchantGroupService.query({
            page: 1,
            count: 1000,
        }).subscribe(
                (res: HttpResponse<MerchantGroup[]>) => this.onSuccessMG(res.body, res.headers),
                (res: HttpErrorResponse ) => this.onErrorMG(res.message),
                () => { this.ngxService.stop(); console.log('Finally MG'); }
        );
    }

    private onSuccessMG(data, headers) {
        this.lookupMerchantGroup = data.content;
        if (this.idMerchant === 0) {
            this.merchantGroupSelected = this.lookupMerchantGroup[0].id;

        } else {
            this.merchantGroupSelected = this.merchantWip.merchantGroupId;
        }
    }

  // fill data on merchant group service if success
    private onSuccessLookup({ data, headers }) {
        this.lookupTempl = data;
        this.breakLookup();
    }

  // start break lookup
    breakLookup() {
        this.lookupTempl.forEach(lookupdt => {
        if (lookupdt.lookupGroupString === LOOKUP_JENIS_USAHA) {
            this.lookupJenisUsaha.push(lookupdt);
        }
        if (lookupdt.lookupGroupString === LOOKUP_PROVINCE) {
            this.lookupProvince.push(lookupdt);
        }
        if (lookupdt.lookupGroupString === LOOKUP_TIPE_MERCHANT) {
            // tslint:disable-next-line:triple-equals
            if (lookupdt.name == 'UMKM') {
                this.tipeMerchantUmkm = lookupdt.id;
                console.log('Tipemerchant umkm', this.tipeMerchantUmkm);
            }
            // tslint:disable-next-line:triple-equals
            if (lookupdt.name == 'Modern') {
                this.tipeMerchantModern = lookupdt.id;
            }
            // tslint:disable-next-line:triple-equals
            if (lookupdt.name == 'eCommerce') {
                this.tipeMerchantECommerce = lookupdt.id;
            }
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
            // console.log('settlement configgg ', lookupdt);
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
        if (lookupdt.lookupGroupString === LOOKUP_PROCESSING_CONFIG) {
            this.lookupProcessingConfig.push(lookupdt);
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
        if (lookupdt.lookupGroupString === HOST_TYPE) {
            this.lookupHostType.push(lookupdt);
        }
        if (lookupdt.lookupGroupString === LOOKUP_MERCHANT_CATEGORY_CODE) {
            this.lookupMerchantCategoryCode.push(lookupdt);
        }


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
        console.log('finish breakLookup ');
        // if (this.lookupJenisUsaha.length < 1) {
        //     console.log('Lookup kosong ');
        // }
        // this.toastrService.success('Finish', 'Breaklookup finish');
        this.checkLookupValid();
        this.defaultConfig();

    }

    checkLookupValid(): void {
        if ( this.lookupTipeMerchant.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Type Merchant EMPTY');
        }

        if (this.lookupProvince.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Province EMPTY');
        }

        if (this.lookupJenisUsaha.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Jenis Usaha EMPTY');
        }
        if (this.lookupCity.length < 1 ) {
            this.toastrService.error('Error', 'Lookup City EMPTY');
        }
        
        if (this.lookupOwnerTitle.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Owner Title EMPTY');
        }
        if (this.lookupIdType.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Id Type EMPTY');
        }
        if (this.lookupGender.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Gender EMPTY');
        }
        if (this.lookupPekerjaan.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Pekerjaan EMPTY');
        }
        if (this.lookupSettlementConfig.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Settlement Confg EMPTY');
        }
        if (this.lookupReportSettlementConfig.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Report Settlement EMPTY');
        }
        if (this.lookupSettlementExecutionConfig.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Settlement Exec Config EMPTY');
        }
        if (this.lookupSendRptVia.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Send Rpt Via EMPTY');
        }
        if (this.lookupMerchantCategoryCode.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Merchant Category EMPTY');
        }

        if (this.lookupProcessingConfig.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Processing Cfg EMPTY');
        }
        if (this.lookupProcessingFee.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Proccesing Fee EMPTY');
        }
        if (this.lookupMDR.length < 1 ) {
            this.toastrService.error('Error', 'Lookup MDR EMPTY');
        }
        if (this.lookupDeviceType.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Device Type EMPTY');
        }
        if (this.lookupDeviceGroup.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Device Group EMPTY');
        }
        if (this.lookupDeviceBrand.length < 1 ) {
            this.toastrService.error('Error', 'Lookup Device Brand EMPTY');
        }
        if (this.lookupHostType.length < 1 ) {
            this.toastrService.success('Error', 'Lookup Host Type EMPTY');
        }
    }

    defaultConfig(): void {
        console.log('next proc after break lookup ===> ', this.merchantWip);
        console.log('idMerchant', this.idMerchant)
        if (this.idMerchant === 0) {
            console.log('params == 0');
            this.tipeMerchantSelected = this.lookupTipeMerchant[0].id;
            this.jenisUsahaSelected = this.lookupJenisUsaha[0].id;
            this.provinceSelected = this.lookupProvince[0].id;
            this.citySelected = this.lookupCity[0].id;
            // this.kecamatanSelected = this.lookupKecamatan[0].id;
            // this.kelurahanSelected = this.kelurahanSelected[0].id;
            this.ownerTitleSelected = this.lookupOwnerTitle[0].id;
            console.log('owner title selected-->', this.lookupOwnerTitle[0].id)
            this.provinceOwnerSelected = this.lookupProvince[0].id;
            this.kabupatenOwnerSelected = this.lookupCity[0].id;
            this.mdrSelected = this.lookupMDR[0].id;
            this.processingConfigSelected = this.lookupProcessingConfig[1].id;
            this.processingFeeSelected = this.lookupProcessingFee[0].id;
            this.settlementConfigSelected = this.lookupSettlementConfig[1].id;
            this.reportSettlementConfigSelected = this.lookupReportSettlementConfig[0].id;
            this.settlementExecutionConfigSelected = this.lookupSettlementExecutionConfig[0].id;
            this.sendRptViaSelected = this.lookupSendRptVia[0].id;
            this.merchantCategoryCodeSelected = this.lookupMerchantCategoryCode[0].id;

            this.idTypeSelected = this.lookupIdType[0].id;
            this.genderSelected = this.lookupGender[0].id;
            this.pekerjaanselected = this.lookupPekerjaan[0].id;

            // this.merchantGroup = new MerchantGroup();
            // this.merchantGroup.id = 0;
            console.log('finish selected');
        } else {
            if (this.merchantWip !== undefined) {

                this.setComboSelected(this.merchantWip);

                // DONE this.setTipeMerchantSelected(this.merchantWip.merchantType);
                // this.setProvinceSelected(this.merchantWip.provinsi);
                // this.setCitySelected(this.merchantWip.kabupatenKota);
                // this.setOwnerTitleSelectedSelected(this.merchantWip.ownerWIP.ownerTitle);
                // this.setProvinceOwnerSelected(this.merchantWip.ownerWIP.ownerProvinsi);
                // this.setKabupatenSelected(this.merchantWip.ownerWIP.ownerKabupaten);
                // this.setIdTypeSelected(this.merchantWip.ownerWIP.ownerTipeID);
                // this.setGenderSelected(this.merchantWip.ownerWIP.ownerJenisKelamin);
                // this.setPekerjaanselected(this.merchantWip.ownerWIP.ownerPekerjaan);

                // this.setProccessingFeeSelected(this.merchantWip.settlementConfigWIP.processingFee);
                // this.setMdrSelected(this.merchantWip.settlementConfigWIP.mdr);
                // this.setProcessingConfigSelected(this.merchantWip.settlementConfigWIP.processingConfiguration);
                // this.setReportSettlementConfigSelected(this.merchantWip.settlementConfigWIP.reportSettlementConfig);
                // this.setSettlementExecutionConfigSelected(this.merchantWip.settlementConfigWIP.settlementExecutionConfig);
                // this.setSendRptViaSelected(this.merchantWip.settlementConfigWIP.sendReportVia);
                // this.setSettlementConfigSelected(this.merchantWip.settlementConfigWIP.settlementConfig);
                console.log('finish set selected ');
            }

        }
    }

    setComboSelected(merchantWip: MerchantWip): void {
        console.log(merchantWip);
        // this.setComboSelectedTipeMerchant(merchantWip.merchantType);
        // this.setComboSelectedJenisUsaha(merchantWip.jenisUsaha);
        // this.setComboSelectedProvince(merchantWip.provinsi);
        // this.setComboSeletedCity(merchantWip.kabupatenKota);

        this.tipeMerchantSelected = this.setComboSelectedLookup(this.lookupTipeMerchant, merchantWip.merchantType);
        this.jenisUsahaSelected = this.setComboSelectedLookup(this.lookupJenisUsaha, merchantWip.jenisUsaha);
        this.provinceSelected = this.setComboSelectedLookup(this.lookupProvince, merchantWip.provinsi);
        this.citySelected = this.setComboSelectedLookup(this.lookupCity, merchantWip.kabupatenKota);
        // this.kecamatanSelected = this.setComboSelectedLookup(this.lookupKecamatan, merchantWip.merchantType);
        this.ownerTitleSelected = this.setComboSelectedLookup(this.lookupOwnerTitle, merchantWip.ownerWIP.ownerTitle);
        this.provinceOwnerSelected = this.setComboSelectedLookup(this.lookupProvince, merchantWip.ownerWIP.ownerProvinsi);
        this.kabupatenOwnerSelected = this.setComboSelectedLookup(this.lookupCity, merchantWip.ownerWIP.ownerKabupaten);
        this.idTypeSelected = this.setComboSelectedLookup(this.lookupIdType, merchantWip.ownerWIP.ownerTipeID);
        this.genderSelected = this.setComboSelectedLookup(this.lookupGender, merchantWip.ownerWIP.ownerJenisKelamin);
        this.pekerjaanselected = this.setComboSelectedLookup(this.lookupPekerjaan, merchantWip.ownerWIP.ownerPekerjaan);
        this.settlementConfigSelected =
                this.setComboSelectedLookup(this.lookupSettlementConfig, merchantWip.settlementConfigWIP.settlementConfig);
        this.reportSettlementConfigSelected =
                this.setComboSelectedLookup(this.lookupReportSettlementConfig, merchantWip.settlementConfigWIP.reportSettlementConfig);
        this.settlementExecutionConfigSelected =
                    this.setComboSelectedLookup(this.lookupSettlementExecutionConfig,
                         merchantWip.settlementConfigWIP.settlementExecutionConfig);
        this.sendRptViaSelected = this.setComboSelectedLookup(this.lookupSendRptVia, merchantWip.settlementConfigWIP.sendReportVia);
        this.processingConfigSelected =
                    this.setComboSelectedLookup(this.lookupProcessingConfig, merchantWip.settlementConfigWIP.processingConfiguration);
        this.processingFeeSelected = this.setComboSelectedLookup(this.lookupProcessingFee, merchantWip.settlementConfigWIP.processingFee);
        this.mdrSelected = this.setComboSelectedLookup(this.lookupMDR, merchantWip.settlementConfigWIP.mdr);

        console.log('merch cat code ', this.merchantWip.merchantCategoryCode);
        console.log('merch lookup cat code ', this.lookupMerchantCategoryCode);

        this.merchantCategoryCodeSelected = this.setComboSelectedLookup(this.lookupMerchantCategoryCode, merchantWip.merchantCategoryCode);

    }

    setComboSelectedLookup(lookupData: LookupDto[], name: string) {
        console.log('rescombo222--->', lookupData, name);
        const result = _.find(lookupData, (lookup) => String(lookup.id) === name);
        // console.log('Finishhhh .... =====??', result);
        if (result === undefined) {
            this.toastrService.error('Error', 'Set combo ERROR, data-ID [' + name + '] not Found in Lookup ' +
                lookupData[0].lookupGroupString);
            // return lookupData[0].id;
        }
        if (lookupData.length < 1) {
            const data = new LookupDto();
            // ('0', '999', 'A', 'A');

            data.id = '0';
            data.code = '999';
            data.lookupGroupString = 'DATA NOT FOUND !!!!';
            data.name = 'DATA NOT FOUND IN DATABASE !!!';
            lookupData.push(data);
        }
        if (result === undefined) {
            // this.toastrService.error('Error', 'Set combo ERROR, data-ID [' + name + '] not Found in Lookup ' +
            //     lookupData[0].lookupGroupString);
            return lookupData[0].id;
        }
        return result.id;
    }

    // setComboSelectedTipeMerchant(name: string) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupTipeMerchant, (lookup) => lookup.name === name);
    //     this.tipeMerchantSelected = result.id;
    // }

    // setComboSelectedJenisUsaha(name: string): void {
    //     const result = _.find(this.lookupJenisUsaha, (lookup) => lookup.name === name);
    //     this.jenisUsahaSelected = result.id;

    // }

    // setComboSelectedProvince(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupProvince, (lookup) => lookup.name === name);
    //     console.log('hasil lodash province -> ', result);
    //     this.provinceSelected = result.id;
    // }

    // setComboSeletedCity(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupCity, (lookup) => lookup.name === name);
    //     this.citySelected = result.id;
    // }


    // setSendRptViaSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupSendRptVia, (lookup) => lookup.name == name);
    //     this.sendRptViaSelected = _.clone(result);
    // }

    // setSettlementConfigSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupSettlementConfig, (lookup) => lookup.name == name);
    //     this.settlementConfigSelected = _.clone(result);
    // }

    // setSettlementExecutionConfigSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupSettlementExecutionConfig, (lookup) => lookup.name == name);
    //     this.settlementExecutionConfigSelected = _.clone(result);
    // }

    // setReportSettlementConfigSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupReportSettlementConfig, (lookup) => lookup.name == name);
    //     this.reportSettlementConfigSelected = _.clone(result);
    // }

    // setProcessingConfigSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupProcessingConfig, (lookup) => lookup.name == name);
    //     this.processingConfigSelected = _.clone(result);
    // }

    // setMdrSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupMDR, (lookup) => lookup.name == name);
    //     this.mdrSelected = _.clone(result);
    // }

    // setProccessingFeeSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupProcessingFee, (lookup) => lookup.name == name);
    //     this.processingFeeSelected = _.clone(result);
    // }


    // setPekerjaanselected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupPekerjaan, (lookup) => lookup.name == name);
    //     this.pekerjaanselected = _.clone(result);
    // }

    // setGenderSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupGender, (lookup) => lookup.name == name);
    //     this.genderSelected = _.clone(result);
    // }

    // setIdTypeSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupIdType, (lookup) => lookup.name == name);
    //     this.idTypeSelected = _.clone(result);
    // }

    // setKabupatenSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupCity, (lookup) => lookup.name == name);
    //     this.kabupatenOwnerSelected = _.clone(result);
    // }

    // setProvinceOwnerSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupProvince, (lookup) => lookup.name == name);
    //     this.provinceOwnerSelected = _.clone(result);
    // }

    // setOwnerTitleSelectedSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupOwnerTitle, (lookup) => lookup.name == name);
    //     this.ownerTitleSelected = _.clone(result);
    // }

    // setCitySelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupCity, (lookup) => lookup.name == name);
    //     this.citySelected = _.clone(result);
    // }

    // setProvinceSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupProvince, (lookup) => lookup.name == name);
    //     this.provinceSelected = _.clone(result);
    // }

    // setJenisUsahaSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupJenisUsaha, (lookup) => lookup.name == name);
    //     console.log('hasil lodash jenis usaha -> ', result);
    //     this.jenisUsahaSelected = _.clone(result);
    // }

    // setTipeMerchantSelected(name) {
    //     // tslint:disable-next-line:triple-equals
    //     const result = _.find(this.lookupTipeMerchant, (lookup) => lookup.name == name);
    //     this.tipeMerchantSelected = _.clone(result);
    // }

    find(id) {
        // start loader
        this.ngxService.start();

        this.merchantService.find(id)
        .subscribe(
            (res: HttpResponse<Merchant>) => this.onSuccess(res.body),
            (res: HttpErrorResponse) => { this.ngxService.stop(); this.onError(res.message); } ,
        );
    }

    // fill data merchant after load
    onSuccess(merchant) {
        // stop loader
        this.ngxService.stop();
        console.log("merchant di onSuccess:", merchant)

        this.loadLookup();
        this.loadLookupMerchantGroup();
        this.merchant = merchant;
        this.statusSuspense = merchant.statusSuspense;
        this.merchantWip = merchant;
        this.loadImageMerchant(merchant);
        this.merchantWip.ownerWIP = this.merchant.owner;
        this.merchantWip.settlementConfigWIP = this.merchant.settlementConfig;
        this.merchantWip.merchantGroupId = this.merchant.merchantGroup.id;

        this.provinsiSelected = merchant.provinsi;
        this.citySelected2 = merchant.kabupatenKota;
        this.kecamatanSelected2 = merchant.kecamatan;
        this.kelurahanSelected2 = merchant.kelurahan;
        this.provinceOwnerSelected2 = merchant.owner.ownerProvinsi;
        this.kabupatenOwnerSelected2 = merchant.owner.ownerKabupaten;
        this.kecamatanOwnerSelected2 = merchant.owner.ownerKecamatan;
        this.kelurahanOwnerSelected2 = merchant.owner.ownerKelurahan;

        this.loadListCity(this.provinsiSelected);
        this.loadListKecamatan(this.citySelected2);
        this.loadListKelurahan(this.kecamatanSelected2);
        this.loadListOwnerCity(this.provinceOwnerSelected2);
        this.loadListOwnerKecamatan(this.kabupatenOwnerSelected2);
        this.loadListOwnerKelurahan(this.kecamatanOwnerSelected2);


        // this.defaultConfig();
        this.merchantLevelSelected = merchant.level;
        console.log(this.merchantWip);
        // if WIP

        // else
        this.loadMerchantOutletByMerchant(this.merchant.id);
        // this.loadMerchantOutlet(0);

        // convert all string date to date
        this.convertToDate();
    }

    loadMerchantOutletByMerchant(id) {
        console.log('loading merchant outlet');
        this.merchantDetailOutletService.findByMerchantPage({
            page: this.curPageOutlets ,
            count: this.totalRecordOutlets,
            merchantId: id,
        }).subscribe(
            (res: HttpResponse<MerchantOutlet[]>) => this.onSuccessMerchantOutlet(res.body),
            (res: HttpErrorResponse) => { this.onError(res.message); } ,
        );
    }

    onSuccessMerchantOutlet(data) {

        this.merchantOutletList = data.content;
        this.totalDataOutlets = data.totalElements;
        console.log('loading merchant outlet list finish ', this.merchantOutlet);

    }

    // convert string to date
    private convertToDate() {
        if (this.merchantWip.ownerWIP.ownerTanggalExpiredID !== null) {
            this.ownerTanggalExpiredID = {
                year: Number(this.merchantWip.ownerWIP.ownerTanggalExpiredID.substr(0, 4)),
                month: Number(this.merchantWip.ownerWIP.ownerTanggalExpiredID.substr(5, 2)),
                day: Number(this.merchantWip.ownerWIP.ownerTanggalExpiredID.substr(8, 2))
            };
            // set checked if expire seumur hidup
            if (this.merchantWip.ownerWIP.ownerTanggalExpiredID.substr(0, 4) === '2999') {
                this.seumurHidupChecked = true;
            }
        }

        if (this.merchantWip.ownerWIP.ownerTanggalLahir !== null) {
            this.ownerTanggalLahir = {
                year: Number(this.merchantWip.ownerWIP.ownerTanggalLahir.substr(0, 4)),
                month: Number(this.merchantWip.ownerWIP.ownerTanggalLahir.substr(5, 2)),
                day: Number(this.merchantWip.ownerWIP.ownerTanggalLahir.substr(8, 2))
            };
        }

    }


    private onError(error) {
        console.log('error lookup..', error);
    }

    private onErrorMG(error) {
        console.log('Error load MG ', error);
    }

    // open modal merchant oulet
    loadMerchantOutlet(i) {

        console.log('load edit merchant, host type ====> ', this.lookupHostType);
        const modalRef = this.modalService.open(MerchantDetailOutletModalComponent, { size: 'lg' });
        modalRef.componentInstance.outlet = this.merchantOutletList[i];
        modalRef.componentInstance.lookupDeviceType = this.lookupDeviceType;
        modalRef.componentInstance.lookupDeviceGroup = this.lookupDeviceGroup;
        modalRef.componentInstance.lookupDeviceBrand = this.lookupDeviceBrand;
        modalRef.componentInstance.lookupHostType = this.lookupHostType;
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

    longitudeChecker(data: any) {
        console.log('longitude change', data);
    }

    defaultTglExpiredId() {

        const currentTime = new Date();
        const curMonth = currentTime.getMonth() + 1;
        const curDay = currentTime.getDate();
        const curYear = currentTime.getFullYear();

        this.ownerTanggalExpiredID = {
            year: curYear,
            month: curMonth,
            day: curDay,
        };
    }

    defaultTglLahir() {

        this.ownerTanggalLahir = {
            year: 2000,
            month: 1,
            day: 1,
        };
    }

    private getDismissReason(reason: any): string {
        console.log(reason);
        return reason;
    }

    onBack() {
        this.router.navigate(['/main/merchant']);
    }

    suspense(): void {
        this.merchantService.suspense(this.idMerchant)
            .subscribe(
                (res: HttpResponse<Merchant>) => this.onSuccess(res.body),
                (res: HttpErrorResponse) => { this.ngxService.stop(); this.onError(res.message); } ,
            );
    }

    validate() {

        this.merchantWip.level = this.merchantLevelSelected;

        console.log('validate');
        console.log(this.merchantWip);
        // // convert date format to string

        this.submitted = true;
        if (this.ownerTanggalExpiredID === null || this.ownerTanggalExpiredID === undefined) {
            return;
        }
        if (this.ownerTanggalLahir === null || this.ownerTanggalLahir === undefined) {
            return;
        }
        this.merchantWip.ownerWIP.ownerTanggalLahir = this.ownerTanggalLahir.year + '-' +
            ('0' + this.ownerTanggalLahir.month).slice(-2) + '-' +
            ('0' + this.ownerTanggalLahir.day).slice(-2) + 'T00:00:00.000Z';
        this.merchantWip.ownerWIP.ownerTanggalExpiredID = this.ownerTanggalExpiredID.year + '-' +
            ('0' + this.ownerTanggalExpiredID.month).slice(-2) + '-' +
            ('0' + this.ownerTanggalExpiredID.day).slice(-2) + 'T00:00:00.000Z';

        this.merchantWip.merchantType = this.tipeMerchantSelected;
        this.merchantWip.jenisUsaha = this.jenisUsahaSelected;
        this.merchantWip.provinsi = this.provinsiSelected;
        this.merchantWip.kabupatenKota = this.citySelected2;
        this.merchantWip.kecamatan = this.kecamatanSelected2;
        this.merchantWip.kelurahan = this.kelurahanSelected2;
        this.merchantWip.ownerWIP.ownerTitle = this.ownerTitleSelected;
        this.merchantWip.ownerWIP.ownerProvinsi = this.provinceOwnerSelected2;
        this.merchantWip.ownerWIP.ownerKabupaten = this.kabupatenOwnerSelected2;
        this.merchantWip.ownerWIP.ownerKecamatan = this.kecamatanOwnerSelected2;
        this.merchantWip.ownerWIP.ownerKelurahan = this.kelurahanOwnerSelected2;
        this.merchantWip.ownerWIP.ownerTipeID = this.idTypeSelected;
        this.merchantWip.ownerWIP.ownerJenisKelamin = this.genderSelected;
        this.merchantWip.ownerWIP.ownerPekerjaan = this.pekerjaanselected;
        this.merchantWip.settlementConfigWIP.settlementConfig = this.settlementConfigSelected;
        this.merchantWip.settlementConfigWIP.reportSettlementConfig = this.reportSettlementConfigSelected;
        this.merchantWip.settlementConfigWIP.settlementExecutionConfig = this.settlementExecutionConfigSelected;
        this.merchantWip.settlementConfigWIP.sendReportVia = this.sendRptViaSelected;
        this.merchantWip.settlementConfigWIP.processingConfiguration = this.processingConfigSelected;
        this.merchantWip.settlementConfigWIP.processingFee = this.processingFeeSelected;
        this.merchantWip.settlementConfigWIP.mdr = this.mdrSelected;
        this.merchantWip.merchantPan = 'Generate by system';
        this.merchantWip.merchantCategoryCode = this.merchantCategoryCodeSelected;


        console.log('id merchant ==>', this.idMerchant, ' wip id ', this.merchantWip.id);
        if (this.idMerchant === 0 ) {
            this.merchantWip.idMerchant = 0;
        } else {
            this.merchantWip.idMerchant = this.idMerchant;
        }
        this.merchantWip.merchantGroupId = this.merchantGroupSelected;
        this.merchantWip.statusRegistration = TO_REGISTERED_MSG;

        let iter = 0;
        this.mdtArrMWip.forEach(el => {
            if (this.merchantWip[el] === '' || this.merchantWip[el] === null || this.merchantWip[el] === undefined) {
                console.log('mdtArrMWip iter++');
                console.log('MerchantWip yang kosong', el);
                iter++;
            }
        });

        // tslint:disable-next-line:triple-equals
        if (this.tipeMerchantSelected == this.tipeMerchantUmkm) {
            this.mdtArrMWipLokasiBisnis.forEach(el => {
                if (this.merchantWip[el] === '' || this.merchantWip[el] === null || this.merchantWip[el] === undefined) {
                    console.log('mdtArrMWipLokasiBisnis iter++');
                    iter++;
                }
            });
        }

        this.mdtArrOwnWip.forEach(el => {
            if (this.merchantWip.ownerWIP[el] === '' || this.merchantWip.ownerWIP[el] === null ||
            this.merchantWip.ownerWIP[el] === undefined) {
                console.log('mdtArrOwnWip iter++', el);
                iter++;
            }
        });

        this.mdtArrSetConfWIP.forEach(el => {
            if (this.merchantWip.settlementConfigWIP[el] === '' || this.merchantWip.settlementConfigWIP[el] === null ||
                this.merchantWip.settlementConfigWIP[el] === undefined) {
                console.log('mdtArrSetConfWIP iter++');
                iter++;
            }
        });

        console.log('tipeMerchantUmkm', this.tipeMerchantUmkm);
        console.log('tipeMerchantSelected', this.tipeMerchantSelected);
        // tslint:disable-next-line:triple-equals
        if (this.tipeMerchantUmkm == this.tipeMerchantSelected) {
            console.log('start umkm');
            console.log(this.imgUrlMerchantKtpPath);
            console.log(this.imgUrlMerchantSelfiePath);
            console.log(this.imgUrlMerchantPhotoLocPath);
            console.log(this.imgUrlMerchantPhotoLoc2Path);
            console.log(this.imgUrlMerchantSignaturePath);
            if (this.imgUrlMerchantKtpPath === '' || this.imgUrlMerchantKtpPath === null ||
                this.imgUrlMerchantKtpPath === undefined) {
                console.log('imgUrlMerchantKtpPath iter++');
                iter++;
            }
            if (this.imgUrlMerchantSelfiePath === '' || this.imgUrlMerchantSelfiePath === null ||
                this.imgUrlMerchantSelfiePath === undefined) {
                console.log('imgUrlMerchantSelfiePath iter++');
                iter++;
            }
            if (this.imgUrlMerchantPhotoLocPath === '' || this.imgUrlMerchantPhotoLocPath === null ||
                this.imgUrlMerchantPhotoLocPath === undefined) {
                console.log('imgUrlMerchantPhotoLocPath iter++');
                iter++;
            }
            if (this.imgUrlMerchantPhotoLoc2Path === '' || this.imgUrlMerchantPhotoLoc2Path === null ||
                this.imgUrlMerchantPhotoLoc2Path === undefined) {
                console.log('imgUrlMerchantPhotoLoc2Path iter++');
                iter++;
            }
            if (this.imgUrlMerchantSignaturePath === '' || this.imgUrlMerchantSignaturePath === null ||
                this.imgUrlMerchantSignaturePath === undefined) {
                console.log('imgUrlMerchantSignaturePath iter++');
                iter++;
            }
        }

        console.log('iter : ', iter);
        if (iter > 0) {
            Swal.fire('Error', 'Silahkan periksa semua field sudah terisi [' + iter + ' fields]  !', 'error');
            return;
        }

        this.onConfirm();
    }

    onConfirm() {
        this.ngxService.start();
        console.log(this.merchantWip);
        this.merchantWipService.saveWip(this.merchantWip, TO_REGISTERED).subscribe(
            (res: HttpResponse<MerchantWip>) => this.onSuccessConfirm(res.body),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }


    // load image
    loadImageMerchant(merchant: Merchant) {
        // this.imgUrlMerchantKtpPath = this.pathImgServer + merchant.ktpPath;
        // this.imgUrlMerchantSelfiePath = this.pathImgServer + merchant.selfiePath;
        // this.imgUrlMerchantPhotoLocPath = this.pathImgServer + merchant.merchantPhotoPath;
        // this.imgUrlMerchantPhotoLoc2Path = this.pathImgServer + merchant.merchantPhoto2Path;
        // this.imgUrlMerchantSignaturePath = this.pathImgServer + merchant.signPath;
        // this.imgUrlMerchantLogoPath = this.pathImgServer + merchant.logoPath;
        console.log('Get image merchant ', merchant);
        this.imgUrlMerchantKtpPath = this.pathImgMerchantServer + merchant.id.toString() + '&tipePict=ktp';
        this.imgUrlMerchantSelfiePath = this.pathImgMerchantServer + merchant.id.toString() + '&tipePict=selfie';
        this.imgUrlMerchantPhotoLocPath = this.pathImgMerchantServer + merchant.id.toString() + '&tipePict=loc';
        this.imgUrlMerchantPhotoLoc2Path = this.pathImgMerchantServer + merchant.id.toString() + '&tipePict=loc2';
        this.imgUrlMerchantSignaturePath = this.pathImgMerchantServer + merchant.id.toString() + '&tipePict=sign';
        this.imgUrlMerchantLogoPath = this.pathImgMerchantServer + merchant.id.toString() + '&tipePict=logo';
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

    // upload file
    processFileImageMerchantSelfie(imageInput: any) {
        console.log(imageInput);
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgSelfiePath  = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            console.log(reader.result);
            this.imgUrlMerchantSelfiePath = reader.result;
            this.imageMerchantSelfiePathChange = true;
        };
    }

    processFileImagePathLoc(imageInput: any) {
        console.log(imageInput);
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgPhotoLocPath = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            console.log(reader.result);
            this.imgUrlMerchantPhotoLocPath = reader.result;
            this.imageMerchantPhotoLocPathChange = true;
        };
    }

    processFileImagePathLoc2(imageInput: any) {
        console.log(imageInput);
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgPhotoLoc2Path = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            console.log(reader.result);
            this.imgUrlMerchantPhotoLoc2Path = reader.result;
            this.imageMerchantPhotoLoc2PathChange = true;
        };
    }

    processFileImageSignaturePath(imageInput: any) {
        console.log(imageInput);
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgSignaturePath  = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            console.log(reader.result);
            this.imgUrlMerchantSignaturePath = reader.result;
            this.imageMerchantSignaturePathChange = true;
        };
    }

    processFileImageLogoPath(imageInput: any) {
        console.log(imageInput);
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgLogoPath = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            console.log(reader.result);
            this.imgUrlMerchantLogoPath = reader.result;
            this.imageMerchantLogoPathChange = true;
        };
    }

    // success message after confirm data merchant
    onSuccessConfirm (res) {

        // success will direct to merchant list
        console.log('confirm ', res);
        this.ngxService.stop();
        if (res.errCode === '00') {

            if (this.imageMerchantKtpPathChange === true) {
                this.merchantService.uploadImageMerchant(this.selectedFileImgMerchantKtpPath.file, 'mr_ktp', res.id.toString());
            } else {
                // if edit, copy juga pict ktp Merchant  MDA
                console.log('cek img ktp ', res);
                if (res.id !== 0 && this.idMerchant !== 0) {
                    console.log('cp from merchant to mda img ktp ');
                    this.merchantService.copyFromMrToMda('mr_ktp', res.id, this.merchant.id);
                }
            }

            if (this.imageMerchantPhotoLocPathChange === true) {
                this.merchantService.uploadImageMerchant(this.selectedFileImgPhotoLocPath.file, 'mr_image_location', res.id.toString());
            } else {
                // if edit, copy juga pict ktp Merchant  MDA
                console.log('cek img loc ', res);
                if (res.id !== 0 && this.idMerchant !== 0) {
                    console.log('cp from merchant to mda img path ');
                    this.merchantService.copyFromMrToMda('mr_image_location', res.id, this.merchant.id);
                }
            }

            if (this.imageMerchantPhotoLoc2PathChange === true) {
                this.merchantService.uploadImageMerchant(this.selectedFileImgPhotoLoc2Path.file, 'mr_image_location2', res.id.toString());
            } else {
                // if edit, copy juga pict ktp Merchant  MDA
                console.log('cek img loc 2 ', res);
                if (res.id !== 0 && this.idMerchant !== 0) {
                    console.log('cp from merchant to mda img path ');
                    this.merchantService.copyFromMrToMda('mr_image_location2', res.id, this.merchant.id);
                }
            }

            if (this.imageMerchantSelfiePathChange  === true) {
                this.merchantService.uploadImageMerchant(this.selectedFileImgSelfiePath.file, 'mr_selfie', res.id.toString());
            } else {
                // if edit, copy juga pict ktp Merchant  MDA
                console.log('cek img selfie ', res);
                if (res.id !== 0 && this.idMerchant !== 0) {
                    console.log('cp from merchant to mda img path ');
                    this.merchantService.copyFromMrToMda('mr_selfie', res.id, this.merchant.id);
                }
            }

            if (this.imageMerchantSignaturePathChange === true) {
                this.merchantService.uploadImageMerchant(this.selectedFileImgSignaturePath.file, 'mr_sign_path', res.id.toString());
            } else {
                // if edit, copy juga pict ktp Merchant  MDA
                console.log('cek img signature ', res);
                if (res.id !== 0 && this.idMerchant !== 0) {
                    console.log('cp from merchant to mda img path ');
                    this.merchantService.copyFromMrToMda('mr_sign_path', res.id, this.merchant.id);
                }
            }

            if (this.imageMerchantLogoPathChange === true) {
                this.merchantService.uploadImageMerchant(this.selectedFileImgLogoPath.file, 'mr_outlet_path', res.id.toString());
            } else {
                // if edit, copy juga pict ktp Merchant  MDA
                console.log('cek img logo ', res);
                if (res.id !== 0 && this.idMerchant !== 0) {
                    console.log('cp from merchant to mda img path ');
                    this.merchantService.copyFromMrToMda('mr_outlet_path', res.id, this.merchant.id);
                }
            }

            // save merchant outlet
            this.merchantWipService.saveMchtOutlet(this.merchantOutletList, res.id).subscribe(
                (xres: HttpResponse<any>) => this.onSuccessOutlet(xres),
                (xres: HttpErrorResponse) => this.onError(xres)
            );
            //

            Swal.fire('Success', 'Success add/edit Merchant', 'success').then(
                result => this.onBack()
            );
        } else { // something wrong
            console.log('Error ', res);
            Swal.fire('Failed', 'Error ....' , 'error');
        }
    }

    onSuccessOutlet(res) {
        console.log(res);
    }

    loadPageOutlets() {
        console.log('load next page ');
    }

    deleteOutlet(outlet) {
        // const result = _.find(this.lookupDeviceType, (lookup) => lookup.name === outlet.deviceType);
        // this.merchantOutletList.splice(this.merchantOutletList.indexOf(result[0]) );
        // const result = _.find(this.merchantOutletList, (merchantOutlet) => merchantOutlet.id === outlet.id);
        // this.merchantOutletList.splice(this.merchantOutletList.indexOf(result[0]));
        console.log('outlet di delete : ', outlet);
        _.pull(this.merchantOutletList, outlet);
        Swal.fire('Success', outlet.name, 'info');
    }

    addnewOutlet() {

        const merchantOutlet = new MerchantOutlet();
        merchantOutlet.id = 0;
        merchantOutlet.deviceBrand = this.lookupDeviceBrand[0].name;
        merchantOutlet.deviceGroup = this.lookupDeviceGroup[0].name;
        merchantOutlet.deviceType = this.lookupDeviceType[0].name;
        merchantOutlet.hostType = this.lookupHostType[0].code;
        merchantOutlet.metodePembayaran = '000';

        const modalRef = this.modalService.open(MerchantDetailOutletModalComponent, { size: 'lg' });
        modalRef.componentInstance.outlet = merchantOutlet;
        modalRef.componentInstance.lookupDeviceType = this.lookupDeviceType;
        modalRef.componentInstance.lookupDeviceGroup = this.lookupDeviceGroup;
        modalRef.componentInstance.lookupDeviceBrand = this.lookupDeviceBrand;
        modalRef.componentInstance.lookupHostType = this.lookupHostType;

        modalRef.result.then((result) => {
            console.log('result : ', result);
            this.merchantOutletList.push(result);
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }



    // settlementConfigChanged
    merchantGroupChanged() {
        console.log(this.settlementConfigSelected);
        this.settlementConfigChanged();
        this.processingConfigChanged();
        console.log('change yaa');
        console.log(this.merchantGroupSelected);
    }

    // settlementConfigChanged
    settlementConfigChanged() {
        console.log(this.settlementConfigSelected);
        if (this.settlementConfigSelected === '8075') {
            console.log('follow group');
            // tslint:disable-next-line:triple-equals
            const result = _.find(this.lookupMerchantGroup, (merchantGroup) => merchantGroup.id == this.merchantGroupSelected);
            let newMerhcantGroup = new MerchantGroup();
            newMerhcantGroup = _.clone(result);
            this.setSettlementFollowGroup(newMerhcantGroup);
        }
        console.log('change yaa');
        console.log(this.merchantGroupSelected);
        // if
    }

    // processingConfigChanged
    processingConfigChanged() {
        if (this.processingConfigSelected === '7993') {
            // tslint:disable-next-line:triple-equals
            const result = _.find(this.lookupMerchantGroup, (merchantGroup) => merchantGroup.id == this.merchantGroupSelected);
            let newMerhcantGroup = new MerchantGroup();
            newMerhcantGroup = _.clone(result);
            this.setFeeFollowGroup(newMerhcantGroup);
        }
    }

    setSettlementFollowGroup(merchantGroup: MerchantGroup) {
        console.log(merchantGroup);
        this.merchantWip.settlementConfigWIP.noRekeningToko = merchantGroup.merchantGroupSettlementInfo.nomorRekening;
        this.merchantWip.settlementConfigWIP.namaBankTujuanSettlement = merchantGroup.merchantGroupSettlementInfo.namaBankTujuanSettlement;
        this.merchantWip.settlementConfigWIP.namaPemilikRekening = merchantGroup.merchantGroupSettlementInfo.namaPemilikRekening;
        this.merchantWip.settlementConfigWIP.tipeRekening = merchantGroup.merchantGroupSettlementInfo.tipeRekening;
        this.reportSettlementConfigSelected = merchantGroup.merchantGroupSettlementInfo.reportSettlementConfigLookup;
        this.settlementExecutionConfigSelected = merchantGroup.merchantGroupSettlementInfo.settlementExecutionConfigLookup;
        this.sendRptViaSelected = merchantGroup.merchantGroupSettlementInfo.sendReportViaLookup;
        this.merchantWip.settlementConfigWIP.sendReportUrl = merchantGroup.merchantGroupSettlementInfo.sendReportUrl;
    }

    setFeeFollowGroup(merchantGroup: MerchantGroup) {
        this.processingFeeSelected = merchantGroup.merchantGroupFeeInfo.processingFeeLookup;
        this.merchantWip.settlementConfigWIP.processingFeeValue = merchantGroup.merchantGroupFeeInfo.processingFeeValue;
        this.merchantWip.settlementConfigWIP.rentalEdcFee = merchantGroup.merchantGroupFeeInfo.rentalEdcFee;
        this.mdrSelected = merchantGroup.merchantGroupFeeInfo.mdrLookup;
        this.merchantWip.settlementConfigWIP.mdrEmoneyOnUs = merchantGroup.merchantGroupFeeInfo.mdrEmoneyOnUs;
        this.merchantWip.settlementConfigWIP.mdrEmoneyOffUs = merchantGroup.merchantGroupFeeInfo.mdrEmoneyOffUs;
        this.merchantWip.settlementConfigWIP.mdrDebitOnUs = merchantGroup.merchantGroupFeeInfo.mdrDebitOnUs;
        this.merchantWip.settlementConfigWIP.mdrDebitOffUs = merchantGroup.merchantGroupFeeInfo.mdrDebitOffUs;
        this.merchantWip.settlementConfigWIP.mdrCreditOnUs = merchantGroup.merchantGroupFeeInfo.mdrCreditOnUs;
        this.merchantWip.settlementConfigWIP.mdrCreditOffUs = merchantGroup.merchantGroupFeeInfo.mdrCreditOffUs;
        this.merchantWip.settlementConfigWIP.otherFee = merchantGroup.merchantGroupFeeInfo.otherFee;
        this.merchantWip.settlementConfigWIP.fmsFee = merchantGroup.merchantGroupFeeInfo.fmsFee;

    }

    onFilterCity(id) {
        this.citySelected2 = '0';
        this.listKecamatan = null;
        this.kecamatanSelected2 = '0';
        this.listKelurahan = null;
        this.kelurahanSelected2 = '0';

        this.loadListCity(id);
    }

    onFilterKecamatan(id) {
        this.listKelurahan = null;
        this.kelurahanSelected2 = '0';

        this.loadListKecamatan(id);
    }

    onFilterKelurahan(id) {
        this.loadListKelurahan(id);
    }

    onFilterOwnerCity(id) {
        this.listOwnerKecamatan = null;
        this.kecamatanOwnerSelected2 = '0';
        this.listOwnerKelurahan = null;
        this.kelurahanOwnerSelected2= '0';

        this.loadListOwnerCity(id);
    }

    onFilterOwnerKecamatan(id) {
        this.listOwnerKelurahan = null;
        this.kelurahanOwnerSelected2= '0';

        this.loadListOwnerKecamatan(id);
    }

    onFilterOwnerKelurahan(id) {
        this.loadListOwnerKelurahan(id);
    }


}
