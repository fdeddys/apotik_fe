import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './entities/login/login.component';
import { Page404Component } from './err/page404/page404.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth/auth.guard';
import { UserComponent } from './entities/user/user.component';
import { RoleComponent } from './entities/role/role.component';

import { LookupComponent } from './entities/lookup/lookup.component';
import { SystemParameterComponent } from './entities/system-parameter/system-parameter.component';
import { AccessMatrixComponent } from './entities/access-matrix/access-matrix.component';
import { ProductGroupComponent } from './entities/product-group/product-group.component';
import { BrandComponent } from './entities/brand/brand.component';
import { CustomerComponent } from './entities/customer/customer.component';
import { SupplierComponent } from './entities/supplier/supplier.component';
import { ProductComponent } from './entities/product/product.component';
import { SalesOrderComponent } from './entities/sales-order/sales-order.component';
import { SalesOrderEditComponent } from './entities/sales-order/sales-order-edit/sales-order-edit.component';
import { ReceivingComponent } from './entities/receiving/receiving.component';
import { ReceivingEditComponent } from './entities/receiving/receiving-edit/receiving-edit.component';
import { AdjustmentComponent } from './entities/adjustment/adjustment.component';
import { AdjustmentEditComponent } from './entities/adjustment/adjustment-edit/adjustment-edit.component';
import { SalesOrderPaymentComponent } from './entities/sales-order-payment/sales-order-payment.component';
import { SalesOrderReturnComponent } from './entities/sales-order-return/sales-order-return.component';
import { SalesOrderReturnDetail } from './entities/sales-order-return/sales-order-return.model';
import { SalesOrderReturnEditComponent } from './entities/sales-order-return/sales-order-return-edit/sales-order-return-edit.component';
import { SalesmanComponent } from './entities/salesman/salesman.component';
import { WarehouseComponent } from './entities/warehouse/warehouse.component';


const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'main', component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                canActivateChild: [AuthGuard],
                children: [
                    { path: '', component: Page404Component },
                    { path: '404', component: Page404Component },
                    { path: 'user', component: UserComponent },
                    // { path: 'user/change-password', component: UserChangePasswordComponent },
                    { path: 'product-group', component: ProductGroupComponent },
                    { path: 'brand', component: BrandComponent },
                    { path: 'customer', component: CustomerComponent },
                    { path: 'lookup', component: LookupComponent },
                    { path: 'role', component: RoleComponent },
                    { path: 'system-parameter', component: SystemParameterComponent },
                    { path: 'access-matrix', component: AccessMatrixComponent },
                    { path: 'supplier', component: SupplierComponent },
                    { path: 'product', component: ProductComponent },
                    { path: 'salesman', component: SalesmanComponent },
                    { path: 'warehouse', component: WarehouseComponent },
                    { path: 'sales-order', component: SalesOrderComponent,  data: { animation: 'sales-order' }  },
                    { path: 'sales-order/:id', component: SalesOrderEditComponent , data: { animation: 'sales-order-edit' }},
                    { path: 'sales-order', redirectTo: 'sales-order/0', pathMatch: 'full'},
                    { path: 'sales-order-payment', component: SalesOrderPaymentComponent },
                    { path: 'sales-order-return', component: SalesOrderReturnComponent },
                    { path: 'sales-order-return/:id', component: SalesOrderReturnEditComponent },
                    { path: 'receive', component: ReceivingComponent },
                    { path: 'receive/:id', component: ReceivingEditComponent },
                    { path: 'adjustment', component: AdjustmentComponent },
                    { path: 'adjustment/:id', component: AdjustmentEditComponent },
                    { path: '**', component: Page404Component },
                ]
            }
            // {path: '404', component: Page404Component,  canActivateChild: [AuthGuard], },
            // {path: 'teroris', component: TerorisComponent,  canActivateChild: [AuthGuard], },
        ]
    },
    // { path: '**', redirectTo: '/main/404', pathMatch: 'full' }
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
