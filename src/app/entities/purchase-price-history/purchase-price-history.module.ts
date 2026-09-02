import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PurchasePriceHistoryComponent } from './purchase-price-history.component';
import { PurchasePriceHistoryService } from './purchase-price-history.service';

@NgModule({
    declarations: [
        PurchasePriceHistoryComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
    ],
    entryComponents: [
        PurchasePriceHistoryComponent,
    ],
    providers: [
        PurchasePriceHistoryService
    ]
})
export class PurchasePriceHistoryModule { }
