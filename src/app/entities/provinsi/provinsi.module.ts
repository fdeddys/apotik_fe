import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvinsiComponent } from './provinsi.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ProvinsiService } from './provinsi.service';

@NgModule({
    declarations: [
        ProvinsiComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        ProvinsiComponent,
    ],
    providers: [
        ProvinsiService,
    ],
})
export class ProvinsiModule { }
