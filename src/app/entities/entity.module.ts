import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { LookupModule } from './lookup/lookup.module';
import { LoginModule } from './login/login.module';
import { AppParameterModule } from './app-parameter/app-parameter.module';
import { SystemParameterModule } from './system-parameter/system-parameter.module';
import { AccessMatrixModule } from './access-matrix/access-matrix.module';
import { ReportModule } from './report/report.module';
import { LookupGroupModule } from './lookup-group/lookup-group.module';
import { ProductGroupModule } from './product-group/product-group.module';
import { BrandModule } from './brand/brand.module';
import { CustomerModule } from './customer/customer.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductModule } from './product/product.module';
import { SalesOrderModule } from './sales-order/sales-order.module';
import { ReceivingModule } from './receiving/receiving.module';
import { AdjustmentModule } from './adjustment/adjustment.module';

import { SalesOrderPaymentModule } from './sales-order-payment/sales-order-payment.module';
import { SalesOrderReturnModule } from './sales-order-return/sales-order-return.module';

import { SalesmanModule } from './salesman/salesman.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ReturnReceivingModule } from './return-receiving/return-receiving.module';
import { PaymentModule } from './payment/payment.module';

@NgModule({
    imports: [
        UserModule,
        RoleModule,
        LookupModule,
        LoginModule,
        AppParameterModule,
        SystemParameterModule,
        AccessMatrixModule,
        ReportModule,
        LookupGroupModule,
        ProductGroupModule,
        BrandModule,
        CustomerModule,
        SupplierModule,
        ProductModule,
        SalesOrderModule,
        ReceivingModule,
        AdjustmentModule,
        SalesOrderPaymentModule,
        SalesOrderReturnModule,
        SalesmanModule,
        WarehouseModule, 
        ReturnReceivingModule,
        PaymentModule,
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],
    exports: []

})
export class EntityModule { }
