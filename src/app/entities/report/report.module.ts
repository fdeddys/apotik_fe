import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSLAComponent } from './sla/report-sla.component';
import { ReportProductivityComponent } from './productivity/report-productivity.component';
import { ReportFinishedComponent } from './finished/report-finished.component';
import { ReportSLAService } from './sla/report-sla.service';
import { ReportProductivityService } from './productivity/report-productivity.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReportFinishedService } from './finished/report-finished.service';
import { ReportRejectService } from './reject/report-reject.service';
import { ReportRejectComponent } from './reject/report-reject.component';

@NgModule({
    declarations: [
        ReportSLAComponent,
        ReportProductivityComponent,
        ReportFinishedComponent,
        ReportRejectComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        ReportSLAComponent,
        ReportProductivityComponent,
        ReportFinishedComponent,
        ReportRejectComponent
    ],
    providers: [
        ReportSLAService,
        ReportProductivityService,
        ReportFinishedService,
        ReportRejectService
    ],
    exports: [
        // RegionModalComponent
    ]
})
export class ReportModule { }
