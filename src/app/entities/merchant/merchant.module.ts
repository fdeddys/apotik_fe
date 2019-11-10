import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantComponent } from './merchant.component';
import { MerchantService } from './merchant.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MerchantDetailComponent } from './merchant-detail.component';
import { MerchantDetailOutletModalComponent } from './merchant-detail-outlet-modal.component';

@NgModule({
  declarations: [
    MerchantComponent,
    MerchantDetailComponent,
    MerchantDetailOutletModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  entryComponents: [
    MerchantComponent,
    MerchantDetailComponent,
    MerchantDetailOutletModalComponent
  ],
  providers: [
    MerchantService
  ],
  exports: [
    MerchantComponent
  ]
})
export class MerchantModule { }
