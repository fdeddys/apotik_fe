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
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],
    exports: []

})
export class EntityModule { }
