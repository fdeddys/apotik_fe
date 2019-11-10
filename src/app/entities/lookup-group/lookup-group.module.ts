import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LookupGroupComponent } from './lookup-group.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LookupGroupService } from './lookup-group.service';
import { FormsModule } from '@angular/forms';
import { LookupGroupModalComponent } from './lookup-group.modal.component';

@NgModule({
  declarations: [
    LookupGroupComponent,
    LookupGroupModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule
  ],
  entryComponents: [
    LookupGroupComponent,
    LookupGroupModalComponent
  ],
  providers: [
    LookupGroupService
  ]
})
export class LookupGroupModule { }
