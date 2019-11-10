import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KelurahanComponent } from './kelurahan.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { KelurahanService } from './kelurahan.service';

@NgModule({
    declarations: [
        KelurahanComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        KelurahanComponent,
    ],
    providers: [
        KelurahanService,
    ],
})
export class KelurahanModule { }
