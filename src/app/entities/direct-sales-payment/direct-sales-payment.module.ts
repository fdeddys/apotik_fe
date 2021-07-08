import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectSalesPaymentComponent } from './direct-sales-payment.component';
import { DirectSalesPaymentService } from './direct-sales-payment.service';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [DirectSalesPaymentComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    entryComponents: [
        DirectSalesPaymentComponent,
    ],
    providers: [
        DirectSalesPaymentService
    ]
})
export class DirectSalesPaymentModule { 
}
