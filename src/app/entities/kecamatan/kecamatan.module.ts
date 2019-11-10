import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KecamatanComponent } from './kecamatan.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { KecamatanService } from './kecamatan.service';

@NgModule({
    declarations: [
        KecamatanComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        KecamatanComponent,
    ],
    providers: [
        KecamatanService,
    ],
})
export class KecamatanModule { }
