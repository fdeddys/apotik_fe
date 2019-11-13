import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LookupService } from '../lookup/lookup.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    providers: [
        LookupService,
    ],
})
export class LookupGroupModule { }
