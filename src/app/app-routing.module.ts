import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerorisComponent } from './entities/teroris/teroris.component';
import { LoginComponent } from './entities/login/login.component';
import { Page404Component } from './err/page404/page404.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth/auth.guard';
import { UserComponent } from './entities/user/user.component';
import { RoleComponent } from './entities/role/role.component';
import { MerchantGroupComponent } from './entities/merchant-group/merchant-group.component';
import { ApuptComponent } from './entities/apupt/apupt.component';
import { MerchantGroupDetailComponent } from './entities/merchant-group/merchant-group-detail.component';
import { MasterDataApprovalComponent } from './entities/master-data-approval/master-data-approval.component';
import { LookupComponent } from './entities/lookup/lookup.component';
import { LookupGroupComponent } from './entities/lookup-group/lookup-group.component';
import { RegionComponent } from './entities/region/region.component';
import { MasterDataApprovalDetailComponent } from './entities/master-data-approval/master-data-approval-detail.component';
import { AreaComponent } from './entities/area/area.component';
import { BranchComponent } from './entities/branch/branch.component';
import { MerchantComponent } from './entities/merchant/merchant.component';
import { LookupRiskProfilerComponent } from './entities/lookup/lookup-risk-profiler.component';
import { UserChangePasswordComponent } from './entities/user/user-change-password.component';
import { InternalNameRiskComponent } from './entities/internal-name-risk/internal-name-risk.component';
import { MerchantDetailComponent } from './entities/merchant/merchant-detail.component';
import { WorkInProgressComponent } from './entities/work-in-progress/work-in-progress.component';
import { WorkInProgressDetailComponent } from './entities/work-in-progress/work-in-progress-detail.component';
import { MerchantWipComponent } from './entities/work-in-progress/merchant-wip.component';
import { MerchantWipVerifierComponent } from './entities/work-in-progress/merchant-wip-verifier.component';
import { MerchantWipEformComponent } from './entities/work-in-progress/merchant-wip-eform.component';
import { MerchantWipEddComponent } from './entities/work-in-progress/merchant-wip-edd.component';
import { SystemParameterComponent } from './entities/system-parameter/system-parameter.component';
import { AccessMatrixComponent } from './entities/access-matrix/access-matrix.component';
import { HolidayComponent } from './entities/holiday/holiday.component';
import { ReportSLAComponent } from './entities/report/sla/report-sla.component';
import { ReportProductivityComponent } from './entities/report/productivity/report-productivity.component';
import { ReportFinishedComponent } from './entities/report/finished/report-finished.component';
import { ReportRejectComponent } from './entities/report/reject/report-reject.component';
import { UseractivityComponent } from './entities/useractivity/useractivity.component';
import { PendingDocumentComponent } from './entities/pending-document/pending-document.component';
import { WilayahConfigurationComponent } from './entities/wilayah-configuration/wilayah-configuration.component';


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
            { path: '', component: WorkInProgressComponent },
            { path: '404', component: Page404Component },
            { path: 'apupt', component: ApuptComponent },
            { path: 'teroris', component: TerorisComponent },
            { path: 'user', component: UserComponent },
            // { path: 'user/change-password', component: UserChangePasswordComponent },
            { path: 'lookup-group', component: LookupGroupComponent },
            // { path: 'lookup/:name', component: LookupComponent },
            { path: 'lookup', component: LookupComponent },
            { path: 'lookup/risk-profiler/:type', component: LookupRiskProfilerComponent },
            { path: 'role', component: RoleComponent },
            { path: 'merchantGroup', component: MerchantGroupComponent },
            { path: 'merchantGroup/:id', component: MerchantGroupDetailComponent },
            { path: 'masterDataApproval', component: MasterDataApprovalComponent },
            { path: 'masterDataApproval/detail', component: MasterDataApprovalDetailComponent },
            { path: 'apuppt', component: ApuptComponent},
            { path: 'region', component: RegionComponent },
            { path: 'area', component: AreaComponent },
            { path: 'branch', component: BranchComponent },
            { path: 'merchant', component: MerchantComponent },
            { path: 'internal-name-risk', component: InternalNameRiskComponent },
            { path: 'merchant/detail', component: MerchantWipComponent },
            { path: 'verifier', component: MerchantWipVerifierComponent },
            { path: 'eform', component: MerchantWipEformComponent },
            { path: 'edd', component: MerchantWipEddComponent },
            { path: 'work-in-progress', component: WorkInProgressComponent },
            { path: 'work-in-progress/detail', component: WorkInProgressDetailComponent },
            { path: 'system-parameter', component: SystemParameterComponent },
            { path: 'access-matrix', component: AccessMatrixComponent },
            { path: 'holiday', component: HolidayComponent },
            { path: 'report-sla', component: ReportSLAComponent },
            { path: 'report-productivity', component: ReportProductivityComponent },
            { path: 'report-finished', component: ReportFinishedComponent },
            { path: 'report-reject', component: ReportRejectComponent },
            { path: 'useractivity', component: UseractivityComponent },
            { path: 'pending-document', component: PendingDocumentComponent },
            { path: 'wilayah-configuration', component: WilayahConfigurationComponent },
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
