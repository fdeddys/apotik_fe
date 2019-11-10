import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, merge, Subject } from 'rxjs';
import { LOOKUP_JENIS_USAHA, LOOKUP_PROVINCE, LOOKUP_TIPE_MERCHANT} from 'src/app/shared/constants/base-constant';
import { LOOKUP_RPT_SETT_CFG, LOOKUP_SETT_EXEC_CFG, LOOKUP_SEND_RPT_VIA } from 'src/app/shared/constants/base-constant';
import { LOOKUP_CITY, LOOKUP_MDR, LOOKUP_PROCESSING_FEE } from 'src/app/shared/constants/base-constant';
import { SERVER_PATH } from 'src/app/shared/constants/base-constant';
import { LookupDto } from '../lookup/lookup-dto.model';
import { MerchantGroup } from './merchant-group.model';
import { MerchantGroupService } from './merchant-group.service';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import * as _ from 'lodash';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LookupService } from '../lookup/lookup.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';

class ImageSnippet {
    constructor(public src: string, public file: File) {}
}

// const HttpUploadOptions = {
//     headers: new HttpHeaders()
// };

@Component({
    selector: 'op-merchant-group',
    templateUrl: './merchant-group-detail.component.html',
    styles: [`
        .is-invalid {
            border: 1px solid #FF0000;
        }
    `]
})
export class MerchantGroupDetailComponent implements OnInit {
    @Input() statusRec: string;
    @Input() objEdit: MerchantGroup;
    @Input() listTypeIds: string[];
    @Input() viewMsg;
    @Input() idMda = 0;
    @Input() recAction: string;

    private sub: Subscription;
    private merchantGroup: MerchantGroup;

    idParams: number;
    // statusRec: string;

    lookupJenisUsaha: LookupDto [] = [];
    jenisUsahaSelected: String;

    lookupProvince: LookupDto [] = [];
    provinceSelected: String;

    lookupTipeMerchant: LookupDto [] = [];
    tipeMerchantSelected: string;

    lookupCity: LookupDto [] = [];
    citySelected: String;

    lookupMDR: LookupDto[] = [];
    mdrSelected: string;

    lookupProcessingFee: LookupDto[] = [];
    processingFeeSelected: string;

    lookupRptSetCfg: LookupDto[] = [];
    rptSetCfgSelected: string;

    lookupSettExecCfg: LookupDto[] = [];
    settExecCfgSelected: string;

    lookupSendRptVia: LookupDto[] = [];
    sendRptViaSelected: string;

    lookupTempl: LookupDto[];

    // imgURL;
    imgUrlSiup;
    imgUrlPks;
    imgUrlNpwp;
    imgUrlKtp;
    imgUrlGroupPhoto;
    imgUrlKtpPenanggungJawab;
    imgUrlAktaPendirian;
    imgUrlTandaDaftarPerusahaan;
    imgUrlPersetujuanMenkumham;
    selectedFileImgSiup: ImageSnippet;
    selectedFileImgNpwp: ImageSnippet;
    selectedFileImgPks: ImageSnippet;
    selectedFileImgKtp: ImageSnippet;
    selectedFileGroupPhoto: ImageSnippet;
    selectedFileImgKtpPenanggungJawab: ImageSnippet;
    selectedFileImgAktaPendirian: ImageSnippet;
    selectedFileImgTandaDaftarPerusahaan: ImageSnippet;
    selectedFileImgPersetujuanMenkumham: ImageSnippet;
    pathImgServer: String = SERVER_PATH + 'images/previewImage?data=';
    pathImgServerMDA: String = SERVER_PATH + 'images/previewImageMDA?data=';
    imageSiupChange: Boolean = false;
    imagePksChange: Boolean = false;
    imageNpwpChange: Boolean = false;
    imageKtpChange: Boolean = false;
    imageGroupPhotoChange: Boolean = false;

    imageKtpPenanggungJawabChange: Boolean = false;
    imageAktaPendirianChange: Boolean = false;
    imageTandaDaftarPerusahaanChange: Boolean = false;
    imagePersetujuanMenkumhamChange: Boolean = false;


    submitted = false;
    tempObj = new MerchantGroup();

    constructor(private route: ActivatedRoute,
        private router: Router,
        private merchantGroupService: MerchantGroupService,
        private http: HttpClient,
        private lookupService: LookupService,
        private ngxService: NgxUiLoaderService ) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.idParams = +params['id'];

            this.loadLookup();


        });

    }

    defaultConfig(): void {
        console.log('next proc after break lookup');
            if (this.idParams === 0) {
                console.log('params ==0');
                this.statusRec = 'addnew';
                this.jenisUsahaSelected = this.lookupJenisUsaha[0].id;
                this.provinceSelected = this.lookupProvince[0].id;
                this.tipeMerchantSelected = this.lookupTipeMerchant[0].id;
                this.citySelected = this.lookupCity[0].id;
                this.mdrSelected = this.lookupMDR[0].id;
                this.processingFeeSelected = this.lookupProcessingFee[0].id;
                this.rptSetCfgSelected = this.lookupRptSetCfg[0].id;
                this.settExecCfgSelected = this.lookupSettExecCfg[0].id;
                this.sendRptViaSelected = this.lookupSendRptVia[0].id;
                this.merchantGroup = new MerchantGroup();
                this.merchantGroup.id = 0;
                this.merchantGroup.merchantGroupFeeInfo.processingFeeValue = 0;
                this.merchantGroup.merchantGroupFeeInfo.rentalEdcFee = 0;
                this.merchantGroup.merchantGroupFeeInfo.mdrDebitOnUs = 0;
                this.merchantGroup.merchantGroupFeeInfo.mdrDebitOffUs = 0;
                this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOnUs = 0;
                this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOffUs = 0;
                this.merchantGroup.merchantGroupFeeInfo.mdrCreditOnUs = 0;
                this.merchantGroup.merchantGroupFeeInfo.mdrCreditOffUs = 0;
                this.merchantGroup.merchantGroupFeeInfo.otherFee = 0;
                this.merchantGroup.merchantGroupFeeInfo.fmsFee = 0;

                // const reader = new FileReader();

                // const file = reader.readAsDataURL('')
                // this.processFileImageSiup(file);

            } else {
                console.log('params ===> ', this.idParams);
                // cek apakah ini routing detil atau view dari MDA
                if (Number.isNaN(this.idParams)) {
                    // from routing
                    console.log('Not As Number');
                    this.merchantGroup = this.objEdit;
                    this.setComboSelected(this.merchantGroup);
                    console.log('cek rec action ', this.recAction);
                    console.log('cek isi MG ', this.merchantGroup);

                    // tslint:disable-next-line:triple-equals
                    if ( this.recAction == '0') {
                        console.log('MDA add new ' );
                        if (this.merchantGroup.id === undefined) {
                            console.log('new record view');
                            this.loadImageNull();
                        } else {
                            console.log('old record view');
                            this.loadImageMDA(this.idMda);
                        }
                    } else  {
                        console.log('MDA edit ' , this.merchantGroup.id);
                        if (this.viewMsg === 'New Record') {
                            console.log('new record view');
                            this.loadImageMDA(this.idMda);
                        } else {
                            console.log('old record view');
                            this.loadImageMG(this.merchantGroup);
                        }
                    }

                } else {
                    console.log('Number',  this.idParams);
                    // from MDA
                    this.merchantGroupService.find(this.idParams).subscribe(result => {
                        console.log('Result==>', result.body);
                        this.merchantGroup = result.body;
                        this.statusRec = 'edit';
                        console.log('merchant ', this.merchantGroup);
                        this.setComboSelected(this.merchantGroup);
                        this.loadImageMG(this.merchantGroup);
                    });
                }
            }

            // stop loader
            this.ngxService.stop();
    }

    setComboSelected(merchantGroup: MerchantGroup): void {
        this.setComboSelectedProvince(merchantGroup.provinsiLookup);
        this.setComboSelectedJenisUsaha(merchantGroup.jenisUsahaLookup);
        this.setComboSelectedTipeMerchant(merchantGroup.tipeMerchantLookup);
        this.setComboSelectedCity(merchantGroup.kabupatenKota);
        this.setComboSelectedProccFee(merchantGroup.merchantGroupFeeInfo.processingFeeLookup);
        this.setComboSelectedMdr(merchantGroup.merchantGroupFeeInfo.mdrLookup);
        this.setComboSelectedRptSetCfg(merchantGroup.merchantGroupSettlementInfo.reportSettlementConfigLookup);
        // tslint:disable-next-line:max-line-length
        this.setComboSelectedSettExecCfg(merchantGroup.merchantGroupSettlementInfo.settlementExecutionConfigLookup);
        this.setComboSelectedSendRptVia(merchantGroup.merchantGroupSettlementInfo.sendReportViaLookup);
    }

    loadImageNull(): void {
        this.imgUrlSiup = null;
        this.imgUrlPks = null;
        this.imgUrlNpwp = null;
        this.imgUrlKtp = null;
        this.imgUrlGroupPhoto = null;
        this.imgUrlKtpPenanggungJawab = null;
        this.imgUrlAktaPendirian = null;
        this.imgUrlTandaDaftarPerusahaan = null;
        this.imgUrlPersetujuanMenkumham = null;
    }

    loadImageMG(merchantGroup: MerchantGroup) {
        this.imgUrlSiup = this.pathImgServer + merchantGroup.siup;
        this.imgUrlPks = this.pathImgServer + merchantGroup.pks;
        this.imgUrlNpwp = this.pathImgServer + merchantGroup.npwp;
        this.imgUrlKtp = this.pathImgServer + merchantGroup.ktpDireksi;
        this.imgUrlGroupPhoto = this.pathImgServer + merchantGroup.groupPhoto;
        this.imgUrlKtpPenanggungJawab = this.pathImgServer + merchantGroup.ktpPenanggungJawab;
        this.imgUrlAktaPendirian = this.pathImgServer + merchantGroup.aktaPendirian;
        this.imgUrlTandaDaftarPerusahaan = this.pathImgServer + merchantGroup.tandaDaftarPerusahaan;
        this.imgUrlPersetujuanMenkumham = this.pathImgServer + merchantGroup.persetujuanMenkumham;
        // this.selectedFileGroupPhoto.file  = this.imgUrlGroupPhoto;
        // console.log('selected file group photo <><><>', this.imgUrlGroupPhoto );
    }

    loadImageMDA(idMda: number) {

        const resImgSiup = this.pathImgServerMDA + idMda.toString() + '&imgData=mgsiup';
        this.imgUrlSiup = resImgSiup;
        console.log('resImgSiup ==>', resImgSiup);

        const resImgPks: any = this.pathImgServerMDA + idMda.toString() + '&imgData=mgpks';
        this.imgUrlPks = resImgPks;
        console.log('resImgPks ==>', resImgPks);

        this.imgUrlNpwp = this.pathImgServerMDA + idMda.toString() + '&imgData=mgnpwp';
        this.imgUrlKtp = this.pathImgServerMDA + idMda.toString() + '&imgData=mgktp';
        this.imgUrlGroupPhoto = this.pathImgServerMDA + idMda.toString() + '&imgData=mgPhoto';
        this.imgUrlKtpPenanggungJawab = this.pathImgServerMDA + idMda.toString() + '&imgData=mgktppenanggungjawab';
        this.imgUrlAktaPendirian = this.pathImgServerMDA + idMda.toString() + '&imgData=mgaktapendirian';
        this.imgUrlTandaDaftarPerusahaan = this.pathImgServerMDA + idMda.toString() + '&imgData=mgtandadaftarperusahaan';
        this.imgUrlPersetujuanMenkumham = this.pathImgServerMDA + idMda.toString() + '&imgData=mgpersetujuanmenkumham';

    }
    // getImage(): Observable<Blob> {
    //     return this.http.get('http://localhost:8080/api/images/previewFile', { responseType: 'blob' });
    // }
    // loadImg() {
    //     // this.imgURL = 'http://localhost:8080/api/images/previewFile';
    //     this.http.get<Blob>('http://localhost:8080/api/images/previewFile')
    //         .subscribe(
    //             data => this.imgURL = data
    //         );
    // }

    onBack() {
        // this.route.
        this.router.navigate(['/main/merchantGroup']);
    }

    loadLookup() {
        // start loader
        this.ngxService.start();

        console.log('Start call lookup');
        this.lookupService.findForMerchantGroup()
            .subscribe(
                (res: HttpResponse<LookupDto[]>) => this.onSuccessLookup(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => {
                    this.ngxService.stop();
                    console.log('finally'); }
            );
    }

    private onSuccessLookup(data, headers) {
        console.log('isi lookup from SVR', data);
        this.lookupTempl = data;
        if (this.lookupTempl.length < 1 ) {
            return ;
        }
        console.log('start call breaklookup');
        this.breakLookup();
    }

    private onError(error) {
        // stop loader
        this.ngxService.stop();

        console.log('error load Lookup..');
    }

    breakLookup() {
        console.log('start break lookup');
        // this.lookupJenisUsaha = _.find(this.lookupTempl, (lookup) => lookup.lookupGroupString === 'JENIS_USAHA');
        if (this.lookupTempl.length < 1 ) {
            console.log('lookup empty, start load lookup');
            return ;
        }
        this.lookupTempl.forEach(lookupdt  => {
            if (lookupdt.lookupGroupString === LOOKUP_JENIS_USAHA) {
                // console.log(lookupdt);
                this.lookupJenisUsaha.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_PROVINCE) {
                // console.log(lookupdt);
                this.lookupProvince.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_TIPE_MERCHANT) {
                // console.log(lookupdt);
                this.lookupTipeMerchant.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_CITY) {
                // console.log(lookupdt);
                this.lookupCity.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_MDR) {
                // console.log(lookupdt);
                this.lookupMDR.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_PROCESSING_FEE) {
                // console.log(lookupdt);
                this.lookupProcessingFee.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_RPT_SETT_CFG) {
                // console.log(lookupdt);
                this.lookupRptSetCfg.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_SETT_EXEC_CFG) {
                // console.log(lookupdt);
                this.lookupSettExecCfg.push(lookupdt);
            }
            if (lookupdt.lookupGroupString === LOOKUP_SEND_RPT_VIA) {
                // console.log(lookupdt);
                this.lookupSendRptVia.push(lookupdt);
            }
        });
        console.log('finish breakLookup ');
        this.defaultConfig();
    }

    setComboSelectedJenisUsaha(id: string) {
        console.log('start iterate lookup jenis usaha [search]==>', id);
        // this.lookupTempl.forEach(lookupdt  => {
        //     console.log('iteratew id =>[', lookupdt.id, '] search =>[', id, '] ');
        //     if (lookupdt.id.valueOf  === id.valueOf ) {
        //         this.jenisUsahaSelected = lookupdt;
        //         console.log('found ');
        //         return;
        //     }
        // });
        // console.log('not found');

        // tslint:disable-next-line:triple-equals
        const result = _.find(this.lookupTempl, (lookup) => lookup.id == id);
        console.log('hasil lodash -> ', result);
        this.jenisUsahaSelected = result.id;

    }

    searchJenisUsaha = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        map(term => term === '' ? []
        : this.lookupJenisUsaha.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

    formatter = (x: {name: string}) => x.name;

    setComboSelectedProvince(id: string) {
        // tslint:disable-next-line:triple-equals
        const result = _.find(this.lookupTempl, (lookup) => lookup.id == id);
        console.log('hasil lodash -> ', result);
        this.provinceSelected = result.id;
        console.log(this.provinceSelected);
    }

    searchProvince = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        map(term => term === '' ? []
        : this.lookupProvince.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

    setComboSelectedTipeMerchant(id: string) {
        // tslint:disable-next-line:triple-equals
        const result = _.find(this.lookupTipeMerchant, (lookup) => lookup.id == id);
        console.log('hasil lodash tipe merchant -> ', result);
        this.tipeMerchantSelected = result.id;
    }

    searchTipeMerchant = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        map(term => term === '' ? []
        : this.lookupTipeMerchant.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

    setComboSelectedCity(id: string) {
        // tslint:disable-next-line:triple-equals
        const result = _.find(this.lookupCity, (lookup) => lookup.id == id);
        console.log('hasil lodash -> ', result);
        this.citySelected = result.id;
    }

    setComboSelectedMdr(id: string) {
        // tslint:disable-next-line:triple-equals
        const result = _.find(this.lookupMDR, (lookup) => lookup.id == id);
        console.log('hasil lodash MDR -> ', result);
        this.mdrSelected = result.id;
    }

    setComboSelectedProccFee(id: string) {
        // tslint:disable-next-line:triple-equals
        const result = _.find(this.lookupProcessingFee, (lookup) => lookup.id == id);
        console.log('hasil lodash Proc Fee -> ', result);
        this.processingFeeSelected = result.id;
    }

    setComboSelectedRptSetCfg(id: string) {
        // tslint:disable-next-line:triple-equals
        const result = _.find(this.lookupRptSetCfg, (lookup) => lookup.id == id);
        console.log('hasil lodash Rpt settCfg -> ', result);
        this.rptSetCfgSelected = result.id;
    }

    setComboSelectedSettExecCfg(id: string) {
        // tslint:disable-next-line:triple-equals
        const result = _.find(this.lookupSettExecCfg, (lookup) => lookup.id == id);
        console.log('hasil lodash Sett exec Cfg -> ', result);
        this.settExecCfgSelected = result.id;
    }

    setComboSelectedSendRptVia(id: string) {
        // tslint:disable-next-line:triple-equals
        const result = _.find(this.lookupSendRptVia, (lookup) => lookup.id == id);
        console.log('hasil lodash Send rpt via -> ', result);
        this.sendRptViaSelected = result.id;
    }

    searchCity = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        map(term => term === '' ? []
        : this.lookupCity.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

    // fileChange(event): void {

    //     const file = event.target.files;
    //     // this.fileToUpload.push(file);
    //     const reader = new FileReader();
    //     // this.imagePath = file;
    //     reader.readAsDataURL(file);
    //     reader.onload = (_event) => {
    //         this.imgUrlSiup = reader.result;
    //     };
    // }
        // const formData = new FormData();
        // formData.append('file', file, file.name);
        // this.fileList2.push(file);
        // console.log('upload', this.fileList2);
        // this.http.post('http://localhost:8080/api/uploadfile', formData, HttpUploadOptions)
        //         .subscribe(
        //             data => console.log('success'),
        //             error => console.log(error)
        //         );

    processFileImageSiup(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgSiup = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.imgUrlSiup = reader.result;
            this.imageSiupChange = true;
        };
    }

    processFileImageNpwp(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgNpwp = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.imgUrlNpwp = reader.result;
            this.imageNpwpChange = true;
        };
    }

    processFileImagePks(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgPks = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.imgUrlPks = reader.result;
            this.imagePksChange = true;
        };
    }

    processFileImageKtp(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgKtp = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.imgUrlKtp = reader.result;
            this.imageKtpChange = true;
        };
    }

    processFileImageGroupPhoto(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileGroupPhoto = new ImageSnippet(event.target.result, file);
            console.log('snippet result =>' , event.target.result);
            console.log('snippet file =>', file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.imgUrlGroupPhoto = reader.result;
            this.imageGroupPhotoChange = true;
        };
    }

    processFileImageKtpPenanggungJawab(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgKtpPenanggungJawab = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.imgUrlKtpPenanggungJawab = reader.result;
            this.imageKtpPenanggungJawabChange = true;
        };
    }

    processFileImageAktaPendirian(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgAktaPendirian = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.imgUrlAktaPendirian = reader.result;
            this.imageAktaPendirianChange = true;
        };
    }

    processFileImageTandaDaftarPerusahaan(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgTandaDaftarPerusahaan = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.imgUrlTandaDaftarPerusahaan = reader.result;
            this.imageTandaDaftarPerusahaanChange = true;
        };
    }

    processFileImagePersetujuanMenkumham(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', (event: any) => {
            this.selectedFileImgPersetujuanMenkumham = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
            this.imgUrlPersetujuanMenkumham = reader.result;
            this.imagePersetujuanMenkumhamChange = true;
        };
    }

    // invalidNumber(angka: any): boolean {
    //     console.log('cek valid number ', angka);
    //     return Number(angka) === NaN;
    // }

    isNull(angka: any): boolean {
        console.log('cek invalid numb', angka);
        return angka === null;
    }

    invalidRangeMoney(angka: number): boolean {
        if ((angka > 9999999) || (angka < 0)) {
            return true;
        }
        return false;
    }

    validateNumberPass(): boolean {

        // cek invalid
        if ( this.isNull(this.merchantGroup.merchantGroupFeeInfo.processingFeeValue) === true ) {
            Swal.fire('Information', 'processing Fee is invalid !', 'error');
            return false;
        }

        if (this.isNull(this.merchantGroup.merchantGroupFeeInfo.rentalEdcFee) === true) {
            Swal.fire('Information', 'Edc Fee is invalid !', 'error');
            return false;
        }

        if (this.isNull(this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOnUs) === true) {
            Swal.fire('Information', 'Emoney on us Fee is invalid !', 'error');
            return false;
        }

        if (this.isNull(this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOffUs) === true) {
            Swal.fire('Information', 'Emoney off us Fee is invalid !', 'error');
            return false;
        }

        if (this.isNull(this.merchantGroup.merchantGroupFeeInfo.mdrDebitOffUs) === true) {
            Swal.fire('Information', 'Debit off us Fee is invalid !', 'error');
            return false;
        }

        if (this.isNull(this.merchantGroup.merchantGroupFeeInfo.mdrDebitOnUs) === true) {
            Swal.fire('Information', 'Debit on us Fee is invalid !', 'error');
            return false;
        }

        if (this.isNull(this.merchantGroup.merchantGroupFeeInfo.mdrCreditOnUs) === true) {
            Swal.fire('Information', 'Credit on us Fee is invalid !', 'error');
            return false;
        }

        if (this.isNull(this.merchantGroup.merchantGroupFeeInfo.mdrCreditOffUs) === true) {
            Swal.fire('Information', 'Credit off us Fee is invalid !', 'error');
            return false;
        }

        if (this.isNull(this.merchantGroup.merchantGroupFeeInfo.otherFee) === true) {
            Swal.fire('Information', 'Other Fee is invalid !', 'error');
            return false;
        }

        if (this.isNull(this.merchantGroup.merchantGroupFeeInfo.fmsFee) === true) {
            Swal.fire('Information', 'FMS Fee is invalid !', 'error');
            return false;
        }

        if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.rentalEdcFee) === true) {
            Swal.fire('Information ', 'EDC fee must between 0 and 9,999,999 ', 'error');
            return false;
        }

        // FEE SELECTED
        if (this.processingFeeSelected === '8085') {
            // tslint:disable-next-line:max-line-length
            if ((this.merchantGroup.merchantGroupFeeInfo.processingFeeValue > 99)
                || (this.merchantGroup.merchantGroupFeeInfo.processingFeeValue < 0)) {
                Swal.fire('Information ', 'Processing fee must between 0 and 99 ', 'error');
                return false;
            }
        } else {
            if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.processingFeeValue) === true) {
                Swal.fire('Information ', 'Processing fee must between 0 and 9,999,999 ', 'error');
                return false;
            }
        }

        // EMONEY ON US
        if (this.mdrSelected === '8083') {
            // tslint:disable-next-line:max-line-length
            if ((this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOnUs > 99)
                || (this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOnUs < 0)) {
                Swal.fire('Information ', 'Emoney on us must between 0 and 99 ', 'error');
                return false;
            }
        } else {
            if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOnUs) === true) {
                Swal.fire('Information ', 'Emoney on us must between 0 and 9,999,999 ', 'error');
                return false;
            }
        }

        // EMONEY OFF US
        if (this.mdrSelected === '8083') {
            // tslint:disable-next-line:max-line-length
            if ((this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOffUs > 99)
                || (this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOffUs < 0)) {
                Swal.fire('Information ', 'Emoney off us must between 0 and 99 ', 'error');
                return false;
            }
        } else {
            if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.mdrEmoneyOffUs) === true) {
                Swal.fire('Information ', 'Emoney off us must between 0 and 9,999,999 ', 'error');
                return false;
            }
        }

        // DEBIT ON US
        if (this.mdrSelected === '8083') {
            // tslint:disable-next-line:max-line-length
            if ((this.merchantGroup.merchantGroupFeeInfo.mdrDebitOnUs > 99)
                || (this.merchantGroup.merchantGroupFeeInfo.mdrDebitOnUs < 0)) {
                Swal.fire('Information ', 'Debit on us must between 0 and 99 ', 'error');
                return false;
            }
        } else {
            if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.mdrDebitOnUs) === true) {
                Swal.fire('Information ', 'Debit on us must between 0 and 9,999,999 ', 'error');
                return false;
            }
        }

        // DEBIT OFF US
        if (this.mdrSelected === '8083') {
            // tslint:disable-next-line:max-line-length
            if ((this.merchantGroup.merchantGroupFeeInfo.mdrDebitOffUs > 99)
                || (this.merchantGroup.merchantGroupFeeInfo.mdrDebitOffUs < 0)) {
                Swal.fire('Information ', 'Debit off us must between 0 and 99 ', 'error');
                return false;
            }
        } else {
            if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.mdrDebitOffUs) === true) {
                Swal.fire('Information ', 'Debit off us must between 0 and 9,999,999 ', 'error');
                return false;
            }
        }

        // CREDIT ON US
        if (this.mdrSelected === '8083') {
            // tslint:disable-next-line:max-line-length
            if ((this.merchantGroup.merchantGroupFeeInfo.mdrCreditOnUs > 99)
                || (this.merchantGroup.merchantGroupFeeInfo.mdrCreditOnUs < 0)) {
                Swal.fire('Information ', 'Credit on us must between 0 and 99 ', 'error');
                return false;
            }
        } else {
            if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.mdrCreditOnUs) === true) {
                Swal.fire('Information ', 'Credit on us must between 0 and 9,999,999 ', 'error');
                return false;
            }
        }

        // CREDIT OFF US
        if (this.mdrSelected === '8083') {
            // tslint:disable-next-line:max-line-length
            if ((this.merchantGroup.merchantGroupFeeInfo.mdrCreditOffUs > 99)
                || (this.merchantGroup.merchantGroupFeeInfo.mdrCreditOffUs < 0)) {
                Swal.fire('Information ', 'Credit off us must between 0 and 99 ', 'error');
                return false;
            }
        } else {
            if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.mdrCreditOffUs) === true) {
                Swal.fire('Information ', 'mdrCreditOffUs off us must between 0 and 9,999,999 ', 'error');
                return false;
            }
        }

        if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.otherFee) === true) {
            Swal.fire('Information ', 'Other fee must between 0 and 9,999,999 ', 'error');
            return false;
        }

        if (this.invalidRangeMoney(this.merchantGroup.merchantGroupFeeInfo.fmsFee) === true) {
            Swal.fire('Information ', 'FMS fee must between 0 and 9,999,999 ', 'error');
            return false;
        }

        return true;
    }

    suspense(): void {
        this.merchantGroupService.suspense(this.idParams).subscribe(result => {
            console.log('Result==>', result.body);
            this.merchantGroup = result.body;
            this.statusRec = 'edit';
            console.log('merchant ', this.merchantGroup);
            this.setComboSelected(this.merchantGroup);
            this.loadImageMG(this.merchantGroup);
        });
    }

    validate(): void {

        if (this.validateNumberPass() === false) {
            return;
        }

        // Swal.fire('a', 'success', 'info');

        // if (this.processingFeeSelected === '8085') {
        //     if (this.merchantGroup.merchantGroupFeeInfo.processingFeeValue > 99) {
        //         Swal.fire('Information ', 'Processing fee value cannot more than 99% ', 'error');
        //         return;
        //     }
        // }
        // return ;

        this.submitted = true;
        console.log(_.keys(this.tempObj));

        const newCity = _.find(this.lookupCity, (city) =>
            // tslint:disable-next-line:triple-equals
            city.id == this.citySelected);
        console.log('new city selected -> ', newCity);

        const newMerchantType = _.find(this.lookupTipeMerchant, (tipeMerchant) =>
            // tslint:disable-next-line:triple-equals
            tipeMerchant.id == this.tipeMerchantSelected);
        console.log('new merchant selected -> ', newMerchantType);

        const newJenisUsaha = _.find(this.lookupJenisUsaha, (jenisUsaha) =>
            // tslint:disable-next-line:triple-equals
            jenisUsaha.id == this.jenisUsahaSelected);
        console.log('new jenis usaha selected -> ', newJenisUsaha);

        const newProvince = _.find(this.lookupProvince, (province) =>
            // tslint:disable-next-line:triple-equals
            province.id == this.provinceSelected);
        console.log('new jenis province selected -> ', newProvince);

        this.merchantGroup.kabupatenKota = newCity.id;
        this.merchantGroup.tipeMerchantLookup = newMerchantType.id;
        this.merchantGroup.jenisUsahaLookup = newJenisUsaha.id;
        this.merchantGroup.provinsiLookup = newProvince.id;
        this.merchantGroup.merchantGroupFeeInfo.processingFeeLookup = Number(this.processingFeeSelected);
        this.merchantGroup.merchantGroupFeeInfo.mdrLookup = Number(this.mdrSelected);
        this.merchantGroup.merchantGroupSettlementInfo.reportSettlementConfigLookup = this.rptSetCfgSelected;
        this.merchantGroup.merchantGroupSettlementInfo.settlementExecutionConfigLookup = this.settExecCfgSelected;
        this.merchantGroup.merchantGroupSettlementInfo.sendReportViaLookup = this.sendRptViaSelected;

        let iter = 0;
        _.forOwn(this.merchantGroup, function (value, key) {
            // console.log(key);
            if (key === 'tipeMerchantLookup' || key === 'merchantGroupName' || key === 'namaPT' ||
                key === 'jenisUsahaLookup' || key === 'alamat' || key === 'kelurahan' ||
                key === 'kecamatan' || key === 'provinsiLookup' || key === 'kabupatenKota' ||
                key === 'negara'
            ) {
                // console.log('test 1 ', value);
                if (value === '' || value === null || value === undefined) {
                    iter++;
                }
            }

            if (key === 'merchantGroupSettlementInfo') {
                // console.log('test 2 ', value);
                if (_.keys(value).length > 0) {
                    _.forOwn(value, function (avalue, akey) {
                        if (akey === 'nomorRekening' || akey === 'namaBankTujuanSettlement' ||
                            akey === 'namaPemilikRekening' || akey === 'tipeRekening' ||
                            akey === 'reportSettlementConfigLookup' || akey === 'settlementExecutionConfigLookup' ||
                            akey === 'sendReportViaLookup' || akey === 'sendReportUrl') {
                            if (avalue === '' || avalue === null || avalue === undefined) {
                                iter++;
                            }
                        }
                    });
                } else {
                    iter++;
                }
            }

            if (key === 'merchantGroupFeeInfo') {
                // console.log('test 3 ', value);
                if (_.keys(value).length > 0) {
                    _.forOwn(value, function (bvalue, bkey) {
                        if (bkey === 'processingFeeLookup' || bkey === 'processingFeeValue' || bkey === 'mdrLookup' ||
                            bkey === 'mdrEmoneyOnUs' || bkey === 'mdrEmoneyOffUs' || bkey === 'mdrDebitOnUs' ||
                            bkey === 'mdrDebitOffUs' || bkey === 'mdrCreditOnUs' || bkey === 'mdrCreditOffUs') {
                            if (bvalue === '' || bvalue === null || bvalue === undefined) {
                                iter++;
                            }
                        }
                    });
                } else {
                    iter++;
                }
            }

            if (key === 'internalContactPerson') {
                // console.log('test 4 ', value);
                if (_.keys(value).length > 0) {
                    _.forOwn(value, function (cvalue, ckey) {
                        if (ckey === 'businessPic' || ckey === 'technicalPic' || ckey === 'settleOperationPic') {
                            if (cvalue === '' || cvalue === null || cvalue === undefined) {
                                iter++;
                            }
                        }
                    });
                } else {
                    iter++;
                }
            }
        });

        console.log('iter : ', iter);
        if (iter > 0) {
            Swal.fire('Error', 'Silahkan periksa semua field sudah terisi [' + iter + ' fields]  !', 'error');
            return;
        }

        this.onConfirm();
    }

    onConfirm(): void {
        console.log('onConfirm..');
        // const formData = new FormData();
        // formData.append('file', this.selectedFile.file);
        // this.http.post('http://localhost:8080/api/images/uploadFile/mgktp/apaaja.jpg', formData, HttpUploadOptions )
        //      .subscribe(
        //          data => console.log('success'),
        //          error => console.log(error)
        //      );

        // const newCity = _.find(this.lookupCity, (city) =>
        // // tslint:disable-next-line:triple-equals
        // city.id ==  this.citySelected.id);
        // console.log('new city selected -> ', newCity);

        // const newMerchantType = _.find(this.lookupTipeMerchant, (tipeMerchant) =>
        // // tslint:disable-next-line:triple-equals
        // tipeMerchant.id ==  this.tipeMerchantSelected.id);
        // console.log('new merchant selected -> ', newMerchantType);

        // const newJenisUsaha = _.find(this.lookupJenisUsaha, (jenisUsaha) =>
        // // tslint:disable-next-line:triple-equals
        // jenisUsaha.id ==  this.jenisUsahaSelected.id);
        // console.log('new jenis usaha selected -> ', newJenisUsaha);

        // const newProvince = _.find(this.lookupProvince, (province) =>
        // // tslint:disable-next-line:triple-equals
        // province.id ==  this.provinceSelected.id);
        // console.log('new jenis province selected -> ', newProvince);

        // console.log('masuk saving');
        // this.merchantGroup.kabupatenKota = newCity.id;
        // this.merchantGroup.tipeMerchantLookup = newMerchantType.id;
        // this.merchantGroup.jenisUsahaLookup = newJenisUsaha.id;
        // this.merchantGroup.provinsiLookup = newProvince.id;
        // this.merchantGroup.merchantGroupFeeInfo.processingFeeLookup = this.processingFeeSelected.id;
        // this.merchantGroup.merchantGroupFeeInfo.mdrLookup = this.mdrSelected.id;
        // this.merchantGroup.merchantGroupSettlementInfo.reportSettlementConfigLookup = this.rptSetCfgSelected.id;
        // this.merchantGroup.merchantGroupSettlementInfo.settlementExecutionConfigLookup = this.settExecCfgSelected.id;
        // this.merchantGroup.merchantGroupSettlementInfo.sendReportViaLookup = this.sendRptViaSelected.id;

        // Image
        if (this.imageGroupPhotoChange === true ) {
            this.merchantGroup.groupPhoto = this.selectedFileGroupPhoto.file.name;
        }
        if (this.imageSiupChange === true) {
            this.merchantGroup.siup = this.selectedFileImgSiup.file.name;
        }
        if (this.imageNpwpChange === true) {
            this.merchantGroup.npwp = this.selectedFileImgNpwp.file.name;
        }
        if (this.imageKtpChange === true) {
            this.merchantGroup.ktpDireksi = this.selectedFileImgKtp.file.name;
        }
        if (this.imagePksChange === true) {
            this.merchantGroup.pks = this.selectedFileImgPks.file.name;
        }

        if (this.imageKtpPenanggungJawabChange === true) {
            this.merchantGroup.ktpPenanggungJawab = this.selectedFileImgKtpPenanggungJawab.file.name;
        }
        if (this.imageAktaPendirianChange === true) {
            this.merchantGroup.aktaPendirian = this.selectedFileImgAktaPendirian.file.name;
        }
        if (this.imageTandaDaftarPerusahaanChange === true) {
            this.merchantGroup.tandaDaftarPerusahaan = this.selectedFileImgTandaDaftarPerusahaan.file.name;
        }
        if (this.imagePersetujuanMenkumhamChange === true) {
            this.merchantGroup.persetujuanMenkumham = this.selectedFileImgPersetujuanMenkumham.file.name;
        }

        // else {
        //     this.merchantGroup.groupPhoto = this.selectedFileGroupPhoto.file.name;
        //     this.merchantGroup.siup = this.selectedFileImgSiup.file.name;
        //     this.merchantGroup.npwp = this.selectedFileImgNpwp.file.name;
        //     this.merchantGroup.ktpDireksi = this.selectedFileImgKtp.file.name;
        //     this.merchantGroup.pks = this.selectedFileImgPks.file.name;
        // }

        console.log('masokk');
        this.merchantGroupService.save(this.merchantGroup)
            .subscribe(result => {
                console.log('Result==>' , result);
                if (result.body.errCode === '00') {
                    // SIUP
                    if (this.imageSiupChange === true) {
                        this.merchantGroupService.uploadImage(this.selectedFileImgSiup.file, 'siup', result.body.idMda.toString());
                    } else {
                        // if edit, copy juga MG pic ke MDA oic
                        console.log('cek img siup ', this.merchantGroup);
                        if (this.merchantGroup.id !== 0) {
                            console.log('cp from mg to mda img siup ');
                            this.merchantGroupService.copyFromMgToMda('mgsiup', result.body.idMda, this.merchantGroup.id);
                        }
                    }
                    // NPWP
                    if (this.imageNpwpChange === true) {
                        this.merchantGroupService.uploadImage(this.selectedFileImgNpwp.file, 'npwp', result.body.idMda.toString());
                    } else {
                         if (this.merchantGroup.id !== 0) {
                            console.log('cp from mg to mda img npwp ');
                            this.merchantGroupService.copyFromMgToMda('mgnpwp', result.body.idMda, this.merchantGroup.id);
                        }
                    }

                    // PKS
                    if (this.imagePksChange === true ) {
                        this.merchantGroupService.uploadImage(this.selectedFileImgPks.file, 'pks', result.body.idMda.toString());
                    } else {
                        if (this.merchantGroup.id !== 0) {
                           console.log('cp from mg to mda img pks ');
                           this.merchantGroupService.copyFromMgToMda('mgpks', result.body.idMda, this.merchantGroup.id);
                       }
                   }

                   // KTP
                    if (this.imageKtpChange === true ) {
                        this.merchantGroupService.uploadImage(this.selectedFileImgKtp.file, 'ktp', result.body.idMda.toString());
                    } else {
                        if (this.merchantGroup.id !== 0) {
                           console.log('cp from mg to mda img ktp ');
                           this.merchantGroupService.copyFromMgToMda('mgktp', result.body.idMda, this.merchantGroup.id);
                       }
                   }

                    // GROUP PHOTO
                    if (this.imageGroupPhotoChange === true) {
                        this.merchantGroupService.uploadImage(this.selectedFileGroupPhoto.file, 'groupPhoto', result.body.idMda.toString());
                    } else {
                        if (this.merchantGroup.id !== 0) {
                           console.log('cp from mg to mda img group Photo ');
                           this.merchantGroupService.copyFromMgToMda('mgPhoto', result.body.idMda, this.merchantGroup.id);
                       }
                   }

                    // KTP PenanggungJawab
                    if (this.imageKtpPenanggungJawabChange === true) {
                        this.merchantGroupService.uploadImage(
                            this.selectedFileImgKtpPenanggungJawab.file, 'ktpPenanggungJawab', result.body.idMda.toString());
                    } else {
                        if (this.merchantGroup.id !== 0) {
                            console.log('cp from mg to mda img ktpPenanggungJawab ');
                            this.merchantGroupService.copyFromMgToMda('mgktppenanggungjawab', result.body.idMda, this.merchantGroup.id);
                        }
                    }

                    // Akta Pendirian
                    if (this.imageAktaPendirianChange === true) {
                        this.merchantGroupService.uploadImage(
                            this.selectedFileImgAktaPendirian.file, 'aktaPendirian', result.body.idMda.toString());
                    } else {
                        if (this.merchantGroup.id !== 0) {
                            console.log('cp from mg to mda img aktaPendirian ');
                            this.merchantGroupService.copyFromMgToMda('mgaktapendirian', result.body.idMda, this.merchantGroup.id);
                        }
                    }

                    // Tanda Daftar Perusahaan
                    if (this.imageTandaDaftarPerusahaanChange === true) {
                        this.merchantGroupService.uploadImage(
                            this.selectedFileImgTandaDaftarPerusahaan.file, 'tandaDaftarPerusahaan', result.body.idMda.toString());
                    } else {
                        if (this.merchantGroup.id !== 0) {
                            console.log('cp from mg to mda img tandaDaftarPerusahaan ');
                            this.merchantGroupService.copyFromMgToMda('mgtandadaftarperusahaan', result.body.idMda, this.merchantGroup.id);
                        }
                    }

                    // Persetujuan MENKUMHAM
                    if (this.imagePersetujuanMenkumhamChange === true) {
                        this.merchantGroupService.uploadImage(
                            this.selectedFileImgPersetujuanMenkumham.file, 'persetujuanMenkumham', result.body.idMda.toString());
                    } else {
                        if (this.merchantGroup.id !== 0) {
                            console.log('cp from mg to mda img persetujuan menkumham ');
                            this.merchantGroupService.copyFromMgToMda('mgpersetujuanmenkumham', result.body.idMda, this.merchantGroup.id);
                        }
                    }

                    this.onBack();
                } else {
                    Swal.fire('Error', result.body.errDesc, 'error');
                    console.log('Toast err', result.body.errDesc);
                }
        });

        console.log('keluar');

    }
}
