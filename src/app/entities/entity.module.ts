import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TerorisModule } from './teroris/teroris.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MerchantGroupModule } from './merchant-group/merchant-group.module';
import { ApuptModule } from './apupt/apupt.module';
import { LookupModule } from './lookup/lookup.module';
import { MasterDataApprovalModule } from './master-data-approval/master-data-approval.module';
import { LookupGroupModule } from './lookup-group/lookup-group.module';
import { RegionModule } from './region/region.module';
import { AreaModule } from './area/area.module';
import { BranchModule } from './branch/branch.module';
import { MerchantModule } from './merchant/merchant.module';
import { LoginModule } from './login/login.module';
import { WorkInProgressModule } from './work-in-progress/work-in-progress.module';
import { InternalNameRiskModule } from './internal-name-risk/internal-name-risk.module';
import { AppParameterComponent } from './app-parameter/app-parameter.component';
import { AppParameterModule } from './app-parameter/app-parameter.module';
import { SystemParameterModule } from './system-parameter/system-parameter.module';
// import { MasterDataApprovalDetailComponent } from './master-data-approval-detail/master-data-approval-detail.component';
import { AccessMatrixModule } from './access-matrix/access-matrix.module';
import { HolidayModule } from './holiday/holiday.module';
import { ReportModule } from './report/report.module';
import { UseractivityModule } from './useractivity/useractivity.module';
import { PendingDocumentModule } from './pending-document/pending-document.module';
import { WilayahConfigurationModule } from './wilayah-configuration/wilayah-configuration.module';
import { ProvinsiComponent } from './provinsi/provinsi.component';
import { Dati2Component } from './dati2/dati2.component';
import { KecamatanComponent } from './kecamatan/kecamatan.component';
import { KelurahanComponent } from './kelurahan/kelurahan.component';
import { ProvinsiModule } from './provinsi/provinsi.module';
import { Dati2Module } from './dati2/dati2.module';
import { KecamatanModule } from './kecamatan/kecamatan.module';
import { KelurahanModule } from './kelurahan/kelurahan.module';
// import { ToastrModule } from 'ngx-toastr';
// import { OnlyNumberModule } from './app-directive/only-number.module';

@NgModule({
    imports: [
        ApuptModule,
        TerorisModule,
        UserModule,
        RoleModule,
        MerchantGroupModule,
        LookupModule,
        MasterDataApprovalModule,
        LookupGroupModule,
        RegionModule,
        AreaModule,
        BranchModule,
        MerchantModule,
        LoginModule,
        WorkInProgressModule,
        InternalNameRiskModule,
        AppParameterModule,
        SystemParameterModule,
        AccessMatrixModule,
        HolidayModule,
        ReportModule,
        UseractivityModule,
        PendingDocumentModule,
        WilayahConfigurationModule,
        ProvinsiModule,
        Dati2Module,
        KecamatanModule,
        KelurahanModule,
        // ToastrModule,
        // OnlyNumberModule,
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],
    exports: []

})
export class EntityModule { }
