import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalNameRiskComponent } from './internal-name-risk.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { InternalNameRiskService } from './internal-name-risk.service';
import { InternalNameRiskModalComponent } from './internal-name-risk.modal.component';

@NgModule({
  declarations: [
    InternalNameRiskComponent,
    InternalNameRiskModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule
  ],
  entryComponents: [
    InternalNameRiskComponent,
    InternalNameRiskModalComponent
  ],
  providers: [
    InternalNameRiskService,
  ],
  exports: [
    InternalNameRiskModalComponent
  ]
})
export class InternalNameRiskModule { }
