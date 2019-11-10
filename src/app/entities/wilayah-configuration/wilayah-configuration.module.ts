import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WilayahConfigurationComponent } from './wilayah-configuration.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { WilayahConfigurationService } from './wilayah-configuration.service';

@NgModule({
    declarations: [
        WilayahConfigurationComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        WilayahConfigurationComponent
    ],
    providers: [
        WilayahConfigurationService,
    ],
})
export class WilayahConfigurationModule { }
