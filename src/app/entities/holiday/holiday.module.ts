import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayComponent } from './holiday.component';
// import { AreaService } from './area.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
// import { AreaModalComponent } from './area.modal.component';

import { AngularCalendarYearViewModule } from 'angular-calendar-year-view';

@NgModule({
    declarations: [
        HolidayComponent,
        // AreaModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        AngularCalendarYearViewModule
    ],
    entryComponents: [
        HolidayComponent,
        // AreaModalComponent
    ],
    providers: [
        // AreaService
    ],
    exports: [
        // AreaModalComponent
    ]
})
export class HolidayModule { }
