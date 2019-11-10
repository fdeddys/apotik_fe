import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchComponent } from './branch.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BranchService } from './branch.service';
import { BranchModalComponent } from './branch.modal.component';

@NgModule({
  declarations: [
    BranchComponent,
    BranchModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  entryComponents: [
    BranchComponent,
    BranchModalComponent
  ],
  providers: [
    BranchService
  ],
  exports: [
    BranchModalComponent
  ]

})
export class BranchModule { }
