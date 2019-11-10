import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerorisComponent } from './teroris.component';
import { TerorisModalComponent } from './teroris.modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TerorisService } from './teroris.service';

@NgModule({
    declarations: [
        TerorisModalComponent,
        TerorisComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        TerorisComponent,
        TerorisModalComponent,
    ],
    providers: [
        TerorisService,
    ],
    exports: [
        TerorisModalComponent,
    ]
})
export class TerorisModule { }
