import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderComponent } from './sales-order.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SalesOrderService } from './sales-order.service';
import { SalesOrderEditComponent } from './sales-order-edit/sales-order-edit.component';

@NgModule({
    declarations: [SalesOrderComponent, SalesOrderEditComponent],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
    ],
    entryComponents: [
        SalesOrderComponent,
        SalesOrderEditComponent,
    ],
    providers: [
        SalesOrderService,
    ]
})
export class SalesOrderModule { }
