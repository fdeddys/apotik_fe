import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceivingComponent } from './receiving.component';
import { ReceivingEditComponent } from './receiving-edit/receiving-edit.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReceivingService } from './receiving.service';

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
        ReceivingService
    ]
})
export class ReceivingModule { }
