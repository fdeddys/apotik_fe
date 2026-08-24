import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ProsesMasterProductComponent } from './proses-master-product.component';

@NgModule({
    declarations: [
        ProsesMasterProductComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        ProsesMasterProductComponent
    ],
    providers: []
})
export class ProsesMasterProductModule { }
