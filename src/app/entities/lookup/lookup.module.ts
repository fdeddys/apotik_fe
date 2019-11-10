import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LookupComponent } from './lookup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { LookupService } from './lookup.service';
import { LookupModalComponent } from './lookup.modal.component';
import { LookupRiskProfilerComponent } from './lookup-risk-profiler.component';

@NgModule({
  declarations: [
    LookupModalComponent,
    LookupComponent,
    LookupRiskProfilerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
  ],
  entryComponents: [
    LookupComponent,
    LookupModalComponent,
    LookupRiskProfilerComponent
  ],
  providers: [
    LookupService,
  ],
  exports: [
    LookupModalComponent,
    LookupRiskProfilerComponent
  ]

})
export class LookupModule { }
