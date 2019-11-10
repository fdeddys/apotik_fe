import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantGroupComponent } from './merchant-group.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MerchantGroupService } from './merchant-group.service';
import { MerchantGroupDetailComponent } from './merchant-group-detail.component';
import { MerchantGroupDetailInternalCpComponent } from './merchant-group-detail-internal-cp.component';
import { OnlyNumberMgDirective } from '../app-directive/OnlyNumberMgDirective';


@NgModule({
    declarations: [
        MerchantGroupComponent,
        MerchantGroupDetailComponent,
        MerchantGroupDetailInternalCpComponent,
        OnlyNumberMgDirective,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
    ],
    entryComponents: [
        MerchantGroupComponent,
    ],
    providers: [
        MerchantGroupService,
    ],
    exports: [
        MerchantGroupDetailComponent,
    ]
})
export class MerchantGroupModule { }
