import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionComponent } from './region.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RegionModalComponent } from './region.modal.component';

@NgModule({
  declarations: [
    RegionComponent,
    RegionModalComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule
  ],
  entryComponents: [
    RegionComponent,
    RegionModalComponent,
  ],
  exports: [
    RegionModalComponent
  ]
})
export class RegionModule { }
