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
import { ReportSLAComponent } from './entities/report/sla/report-sla.component';
import { ReportProductivityComponent } from './entities/report/productivity/report-productivity.component';
import { ReportFinishedComponent } from './entities/report/finished/report-finished.component';
import { ReportRejectComponent } from './entities/report/reject/report-reject.component';


const routes: Routes = [
  { path : '', component : LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent,
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
            // { path: 'lookup/:name', component: LookupComponent },
            { path: 'lookup', component: LookupComponent },
            { path: 'role', component: RoleComponent },
            { path: 'system-parameter', component: SystemParameterComponent },
            { path: 'access-matrix', component: AccessMatrixComponent },
            { path: 'report-sla', component: ReportSLAComponent },
            { path: 'report-productivity', component: ReportProductivityComponent },
            { path: 'report-finished', component: ReportFinishedComponent },
            { path: 'report-reject', component: ReportRejectComponent },
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
