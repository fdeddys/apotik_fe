import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceivingComponent } from './receiving.component';
import { ReceivingEditComponent } from './receiving-edit/receiving-edit.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReceivingService } from './receiving.service';
import { ReceivingDetailService } from './receiving-detail.service';

@NgModule({
    declarations: [
        ReceivingComponent,
        ReceivingEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        ReceivingComponent,
        ReceivingEditComponent
    ],
    providers: [
        ReceivingService,
        ReceivingDetailService
    ]
})
export class ReceivingModule { }
