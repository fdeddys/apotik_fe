import { Component, OnInit } from '@angular/core';
import { MasterDataApprovalService } from '../master-data-approval/master-data-approval.service';
import { TerorisService } from '../teroris/teroris.service';
import { ApuptService } from '../apupt/apupt.service';
import { LookupService } from '../lookup/lookup.service';
import { MerchantGroupService } from '../merchant-group/merchant-group.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Teroris } from '../teroris/teroris.model';
import { Apupt } from '../apupt/apupt.model';
import { Lookup } from '../lookup/lookup.model';
import { MerchantGroup } from '../merchant-group/merchant-group.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { MasterDataApproval } from '../master-data-approval/master-data-approval.model';
import { RegionService } from '../region/region.service';
import { Region } from '../region/region.model';
import { AreaService } from '../area/area.service';
import { Area } from '../area/area.model';
import { Router } from '@angular/router';
import { Branch } from '../branch/branch.model';
import { BranchService } from '../branch/branch.service';
import { InternalNameRiskService } from '../internal-name-risk/internal-name-risk.service';
import { InternalNameRisk } from '../internal-name-risk/internal-name-risk.model';
import { SystemParameterService } from '../system-parameter/system-parameter.service';
import { SystemParameter } from '../system-parameter/system-parameter.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MDA_ACTION_REPAIR } from 'src/app/shared/constants/base-constant';
import Swal from 'sweetalert2';

@Component({
    selector: 'op-master-data-approval-detail',
    templateUrl: './master-data-approval-detail.component.html',
    styleUrls: ['./master-data-approval-detail.component.css']
})
export class MasterDataApprovalDetailComponent implements OnInit {

    idMda: number;
    moduleName: string;
    recAction: number;
    repair = false;
    constructor(private masterDataApprovalService: MasterDataApprovalService,
            private terorisService: TerorisService,
            private apuptService: ApuptService,
            private lookupService: LookupService,
            private location: Location,
            private regionService: RegionService,
            private areaService: AreaService,
            private branchService: BranchService,
            private merchantGroupService: MerchantGroupService,
            private internalNameRiskService: InternalNameRiskService,
            private systemParameterService: SystemParameterService,
            private router: Router,
            private ngxService: NgxUiLoaderService) { }


    terorisList: Teroris[];
    apuptList: Apupt[];
    lookupList: Lookup[];
    merchantGroupList: MerchantGroup[];
    regionList: Region[];
    areaList: Area[];
    branchList: Branch[];
    internalNameRiskList: InternalNameRisk[];
    systemParameterList: SystemParameter[];
    riskProfilerList: Lookup[][];
    finishLoad: Boolean = false;
    statusRec = 'View';
    viewMsg1 = 'New Record';
    viewMsg2 = 'Old Record';


    ngOnInit() {
        this.masterDataApprovalService.dataSharingIdMda.subscribe(
            data => this.idMda = data
        );
        this.masterDataApprovalService.dataSharingModuleName.subscribe(
            data => this.moduleName = data
        );
        this.masterDataApprovalService.dataSharingActionRec.subscribe(
            data => this.recAction = data
        );

        if (this.idMda === 0 ) {
            this.router.navigate(['main/masterDataApproval']);
        }
        console.log(this.moduleName);

        switch (this.moduleName) {
            case 'Module Teroris':
                this.loadDataTeroris();
                break;
            case 'Module APUPPT':
                this.loadDataApupt();
                break;
            case 'Module Lookup':
                this.loadDataLookup();
                break;
            case 'Module Merchant Group':
                this.loadDataMerchantGroup();
                break;
            case 'Module Region':
                this.loadDataRegion();
                break;
            case 'Module AREA':
                this.loadDataArea();
                break;
            case 'Module Branch':
                this.loadDataBranch();
                break;
            case 'Module Risk Business Type':
                this.loadDataRiskProfiler();
                break;
            case 'Module Risk Job':
                this.loadDataRiskProfiler();
                break;
            case 'Module Internal Name Risk':
                this.loadDataInternalNameRisk();
                break;
            case 'Module System Parameter':
                this.loadDataSystemParameter();
                break;
        }

    }

    loadDataTeroris() {
        // start loader
        this.ngxService.start();
        this.terorisService.getFromMda(this.idMda)
        .subscribe(
            (res: HttpResponse<Teroris[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { this.ngxService.stop(); console.log('finally'); }
        );
    }

    loadDataApupt() {
        // start loader
        this.ngxService.start();
        this.apuptService.getFromMda(this.idMda)
            .subscribe(
                (res: HttpResponse<Apupt[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finally'); }
            );
    }

    loadDataLookup() {
        // start loader
        this.ngxService.start();
        this.lookupService.getFromMda(this.idMda)
            .subscribe(
                (res: HttpResponse<Lookup[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finally'); }
            );
    }

    loadDataMerchantGroup() {
        // start loader
        this.ngxService.start();
        this.merchantGroupService.getFromMda(this.idMda)
            .subscribe(
                (res: HttpResponse<MerchantGroup[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    loadDataRegion() {
        // start loader
        this.ngxService.start();
        this.regionService.getFromMda(this.idMda)
            .subscribe(
                (res: HttpResponse<Region[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    loadDataArea() {
        // start loader
        this.ngxService.start();
        this.areaService.getFromMda(this.idMda)
            .subscribe(
                (res: HttpResponse<Area[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    loadDataBranch() {
        // start loader
        this.ngxService.start();
        this.branchService.getFromMda(this.idMda)
            .subscribe(
                (res: HttpResponse<Branch[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    loadDataRiskProfiler() {
        // start loader
        this.ngxService.start();
        this.lookupService.getRiskFromMda(this.idMda)
            .subscribe(
                (res: HttpResponse<[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    loadDataInternalNameRisk() {
        // start loader
        this.ngxService.start();
        this.internalNameRiskService.getFromMda(this.idMda)
            .subscribe(
                (res: HttpResponse<InternalNameRisk[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    loadDataSystemParameter() {
        // start loader
        this.ngxService.start();
        this.systemParameterService.getFromMda(this.idMda)
            .subscribe(
                (res: HttpResponse<SystemParameter[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    private onSuccess(data, headers) {
        console.log('data --> ', data);
        console.log(this.recAction);
        if (data.length < 0) {
            return;
        }

        if (this.recAction === MDA_ACTION_REPAIR) {
            this.repair = true;
        }

        if (this.moduleName === 'Module Teroris') {
            this.terorisList = data;
            if (this.terorisList[0] === null) {
                this.terorisList[0] = new Teroris();
                this.terorisList[0].birthDate = '2000-01-01';
            }
        }
        if (this.moduleName === 'Module APUPPT') {
            this.apuptList = data;
            if (this.apuptList[0] === null) {
                this.apuptList[0] = new Apupt();
                this.apuptList[0].birthDate = '2000-01-01';
            }
        }
        if (this.moduleName === 'Module Lookup') {
            this.lookupList = data;
            if (this.lookupList[0] === null) {
                this.lookupList[0] = new Lookup();
            }
        }
        if (this.moduleName === 'Module Merchant Group') {
            this.merchantGroupList = data;
            if (this.merchantGroupList[0] === null) {
                this.merchantGroupList[0] = new MerchantGroup();
            }
        }
        if (this.moduleName === 'Module Region') {
            console.log('fdsfsd');
            this.regionList = data;
            if (this.regionList[0] === null) {
                this.regionList[0] = new Region;
            }
        }

        if (this.moduleName === 'Module AREA') {
            this.areaList = data;
            if (this.areaList[0] === null) {
                this.areaList[0] = new Area;
                this.areaList[0].region = new Region;
            }
            console.log(this.areaList);
        }

        if (this.moduleName === 'Module Branch') {
            this.branchList = data;
            if (this.branchList[0] === null) {
                this.branchList[0] = new Branch;
                this.branchList[0].area = new Area;
            }
            console.log(this.branchList);
        }

        if (this.moduleName === 'Module Risk Job' || this.moduleName === 'Module Risk Business Type') {
            this.riskProfilerList = data;
            console.log(this.riskProfilerList);
        }

        if (this.moduleName === 'Module Internal Name Risk') {
            this.internalNameRiskList = data;
            if (this.internalNameRiskList[0] === null) {
                this.internalNameRiskList[0] = new InternalNameRisk();
            }
        }

        if (this.moduleName === 'Module System Parameter') {
            this.systemParameterList = data;
            if (this.systemParameterList[0] === null) {
                this.systemParameterList[0] = new SystemParameter();
            }
        }

        // stop loader
        this.ngxService.stop();
    }

    private onError(error) {
        console.log('error..', error);
        Swal.fire('Error', error);
        this.ngxService.stop();
    }

    onConfirm() {
        switch (this.moduleName) {
            case 'Module Teroris':
                this.saveTeroris();
                break;
            case 'Module APUPPT':
                this.saveApupt();
                break;
            case 'Module Lookup':
                this.saveLookup();
                break;
            case 'Module Region':
                this.saveRegion();
                break;
            case 'Module AREA':
                this.saveArea();
                break;
            case 'Module Branch':
                this.saveBranch();
                break;
            case 'Module Risk Job':
                this.saveRiskProfiler();
                break;
            case 'Module Risk Business Type':
                this.saveRiskProfiler();
                break;
            case 'Module Internal Name Risk':
                this.saveInternalNameRisk();
                break;
            case 'Module System Parameter':
                this.saveSystemParameter();
                break;
            case 'Module Merchant Group':
                this.saveMerchantGroup();
        }
    }

    repairData() {
        switch (this.moduleName) {
            case 'Module Teroris':
                this.repairTeroris();
                break;
            case 'Module APUPPT':
                this.repairApupt();
                break;
            case 'Module Lookup':
                this.repairLookup();
                break;
            case 'Module Region':
                this.repairRegion();
                break;
            case 'Module AREA':
                this.repairArea();
                break;
            case 'Module Branch':
                this.repairBranch();
                break;
            case 'Module Risk Job':
                this.repairRiskProfiler();
                break;
            case 'Module Risk Business Type':
                this.repairRiskProfiler();
                break;
            case 'Module Internal Name Risk':
                this.repairInternalNameRisk();
                break;
            case 'Module System Parameter':
                this.repairSystemParameter();
                break;
            case 'Module Merchant Group':
                this.repairMerchantGroup();
        }
    }

    onReject() {
        this.masterDataApprovalService.reject(this.idMda)
            .subscribe(
                (res: MasterDataApproval) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    requestRepair() {
        this.masterDataApprovalService.requestRepair(this.idMda)
            .subscribe(
                (res: MasterDataApproval) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveLookup(): void {
        // start loader
        this.ngxService.start();
        this.lookupService.approveFromMda(this.idMda)
            .subscribe(
                (res: Teroris) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveTeroris(): void {
        // start loader
        this.ngxService.start();
        this.terorisService.approveFromMda(this.idMda)
            .subscribe(
                (res: Teroris) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveApupt(): void {
        // start loader
        this.ngxService.start();
        this.apuptService.approveFromMda(this.idMda)
            .subscribe(
                (res: Teroris) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveMerchantGroup(): void {
        // start loader
        this.ngxService.start();
        this.merchantGroupService.approveFromMda(this.idMda)
            .subscribe(
                (res: MerchantGroup) => {
                    console.log(res);
                    if (res.errCode === '00') {
                        console.log('save');
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveRegion(): void {
        // start loader
        this.ngxService.start();
        this.regionService.approveFromMda(this.idMda)
            .subscribe(
                (res: Region) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveArea(): void {
        // start loader
        this.ngxService.start();
        this.areaService.approveFromMda(this.idMda)
            .subscribe(
                (res: Area) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveBranch(): void {
        // start loader
        this.ngxService.start();
        this.branchService.approveFromMda(this.idMda)
            .subscribe(
                (res: Branch) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveRiskProfiler(): void {
        // start loader
        this.ngxService.start();
        this.lookupService.approveRiskFromMda(this.idMda)
            .subscribe(
                (res: Branch) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveInternalNameRisk(): void {
        // start loader
        this.ngxService.start();
        this.internalNameRiskService.approveFromMda(this.idMda)
            .subscribe(
                (res: InternalNameRisk) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    saveSystemParameter(): void {
        // start loader
        this.ngxService.start();
        this.systemParameterService.approveFromMda(this.idMda)
            .subscribe(
                (res: SystemParameter) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairRegion(): void {
        console.log(this.regionList[1]);
        // start loader
        this.ngxService.start();
        this.regionService.repair(this.regionList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair region success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairTeroris(): void {
        console.log(this.terorisList[1]);
        // start loader
        this.ngxService.start();
        this.terorisService.repair(this.terorisList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair teroris success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairApupt(): void {
        // start loader
        this.ngxService.start();
        this.apuptService.repair(this.apuptList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair apupt success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairSystemParameter(): void {
        // start loader
        this.ngxService.start();
        this.systemParameterService.repair(this.systemParameterList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair system parameter success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairInternalNameRisk(): void {
        // start loader
        this.ngxService.start();
        this.internalNameRiskService.repair(this.internalNameRiskList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair internal name risk success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairArea(): void {
        // start loader
        this.ngxService.start();
        this.areaService.repair(this.areaList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair area success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairBranch(): void {
        // start loader
        this.ngxService.start();
        this.branchService.repair(this.branchList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair branch success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairLookup(): void {
        // start loader
        this.ngxService.start();
        this.lookupService.repair(this.lookupList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair lookup success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairMerchantGroup(): void {
        // start loader
        this.ngxService.start();
        this.merchantGroupService.repair(this.merchantGroupList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair merchant group success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    repairRiskProfiler(): void {
        console.log(this.moduleName);
        let lookupGroupName = '';
        if (this.moduleName === 'Module Risk Job') {
            lookupGroupName = 'pekerjaan';
        }

        if (this.moduleName === 'Module Risk Business Type') {
            lookupGroupName = 'jenis_usaha';
        }

        console.log(this.riskProfilerList);
        // start loader
        this.ngxService.start();
        this.lookupService.repairRiskProfiler(lookupGroupName, this.riskProfilerList[1], this.idMda)
            .subscribe(result => {
                if (result.body.errCode === '00') {
                    Swal.fire('Success', 'Repair riskProfiler success !', 'info');
                    this.onBack();
                } else {
                    this.onError(result.body.errDesc);
                }
            },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    reject(): void {
        // start loader
        this.ngxService.start();
        this.masterDataApprovalService.reject(this.idMda)
            .subscribe(
                (res: Teroris) => {
                    if (res.errCode === '00') {
                        this.onBack();
                    }
                    // stop loader
                    this.ngxService.stop();
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { this.ngxService.stop(); console.log('finale'); }
            );
    }

    // private onSuccess(data, headers) {
    //     console.log('data --> ', data);
    //     if (data.length < 0) {
    //         return;
    //     }
    //     if (this.moduleName === 'Module Teroris') {
    //         this.terorisList = data;
    //         if (this.terorisList[0] === null) {
    //             this.terorisList[0] = new Teroris();
    //             this.terorisList[0].birthDate = '2000-01-01';
    //         }
    //     }
    //     if (this.moduleName === 'Module APUPPT') {
    //         this.apuptList = data;
    //         if (this.apuptList[0] === null) {
    //             this.apuptList[0] = new Apupt();
    //             this.apuptList[0].birthDate = '2000-01-01';
    //         }
    //     }
    //     if (this.moduleName === 'Module Lookup') {
    //         this.lookupList = data;
    //         if (this.lookupList[0] === null) {
    //             this.lookupList[0] = new Lookup();
    //         }
    //     }
    //     if (this.moduleName === 'Module Merchant Group') {
    //         this.merchantGroupList = data;
    //         if (this.merchantGroupList[0] === null) {
    //             this.merchantGroupList[0] = new MerchantGroup();
    //         }
    //     }
    // }

    // private onError(error) {
    //     console.log('error..', error);
    // }

    onBack() {
        this.location.back();
    }

}
