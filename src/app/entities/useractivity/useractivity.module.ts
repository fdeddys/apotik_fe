import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseractivityComponent } from './useractivity.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UseractivityService } from './useractivity.service';

@NgModule({
    declarations: [
        UseractivityComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        UseractivityComponent
    ],
    providers: [
        UseractivityService
    ]
})
export class UseractivityModule { }
