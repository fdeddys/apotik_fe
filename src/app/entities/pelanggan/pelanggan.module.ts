import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PelangganComponent } from './pelanggan.component';
import { PelangganModalComponent } from './pelanggan-modal/pelanggan-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PelangganService } from './pelanggan.service';

@NgModule({
    declarations: [
        PelangganComponent,
        PelangganModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        PelangganComponent,
        PelangganModalComponent
    ],
    providers: [
        PelangganService,
    ],
    exports: [
        PelangganComponent,
        PelangganModalComponent
    ]
})
export class PelangganModule { }
