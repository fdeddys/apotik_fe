import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApuptComponent } from './apupt.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ApuptService } from './apupt.service';
import { ApuptModalComponent } from './apupt.modal.component';

@NgModule({
  declarations: [
    ApuptComponent,
    ApuptModalComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
  ],
  entryComponents: [
    ApuptComponent,
    ApuptModalComponent,
  ],
  providers: [
    ApuptService,
  ],
  exports: [
    ApuptModalComponent
  ]

})
export class ApuptModule { }
