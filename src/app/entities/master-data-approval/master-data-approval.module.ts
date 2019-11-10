import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataApprovalComponent } from './master-data-approval.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MasterDataApprovalService } from './master-data-approval.service';
import { TerorisModalComponent } from '../teroris/teroris.modal.component';
import { TerorisModule } from '../teroris/teroris.module';
import { ApuptModule } from '../apupt/apupt.module';
import { LookupModule } from '../lookup/lookup.module';
import { MerchantGroupModule } from '../merchant-group/merchant-group.module';
import { MasterDataApprovalDetailComponent } from './master-data-approval-detail.component';
import { RegionModule } from '../region/region.module';
import { AreaModule } from '../area/area.module';
import { BranchModule } from '../branch/branch.module';
import { InternalNameRiskModule } from '../internal-name-risk/internal-name-risk.module';
import { SystemParameterModule } from '../system-parameter/system-parameter.module';

@NgModule({
    declarations: [
        MasterDataApprovalDetailComponent,
        MasterDataApprovalComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        TerorisModule,
        ApuptModule,
        LookupModule,
        MerchantGroupModule,
        RegionModule,
        AreaModule,
        BranchModule,
        InternalNameRiskModule,
        SystemParameterModule
    ],
    entryComponents: [
        MasterDataApprovalDetailComponent,
        MasterDataApprovalComponent,
    ],
    providers: [
        MasterDataApprovalService,
    ]
})

export class MasterDataApprovalModule { }
