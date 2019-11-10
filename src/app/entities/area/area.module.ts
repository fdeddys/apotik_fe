import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaComponent } from './area.component';
import { AreaService } from './area.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AreaModalComponent } from './area.modal.component';

@NgModule({
  declarations: [
    AreaComponent,
    AreaModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
  ],
  entryComponents: [
    AreaComponent,
    AreaModalComponent
  ],
  providers: [
    AreaService
  ],
  exports: [
    AreaModalComponent
  ]
})
export class AreaModule { }
