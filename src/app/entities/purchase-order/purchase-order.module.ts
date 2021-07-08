import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderComponent } from './purchase-order.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderEditComponent } from './purchase-order-edit/purchase-order-edit.component';

@NgModule({
    declarations: [
        PurchaseOrderComponent,
        PurchaseOrderEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        PurchaseOrderComponent,
        PurchaseOrderEditComponent,
    ],
    providers: [
        PurchaseOrderService,
    ]
})
export class PurchaseOrderModule { }
