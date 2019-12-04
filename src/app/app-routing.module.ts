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
                    { path: 'sales-order', component: SalesOrderComponent,  data: { animation: 'sales-order' }  },
                    { path: 'sales-order/:id', component: SalesOrderEditComponent , data: { animation: 'sales-order-edit' }},
                    { path: 'sales-order', redirectTo: 'sales-order/0', pathMatch: 'full'},
                    { path: 'receive', component: ReceivingComponent },
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
