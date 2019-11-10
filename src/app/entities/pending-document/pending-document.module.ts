import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingDocumentComponent } from './pending-document.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PendingDocumentService } from './pending-document.service';

@NgModule({
    declarations: [
        PendingDocumentComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        PendingDocumentComponent
    ],
    providers: [
        PendingDocumentService
    ]
})
export class PendingDocumentModule { }
