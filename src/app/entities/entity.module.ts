import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { LookupModule } from './lookup/lookup.module';
import { LoginModule } from './login/login.module';
import { AppParameterModule } from './app-parameter/app-parameter.module';
import { SystemParameterModule } from './system-parameter/system-parameter.module';
import { AccessMatrixModule } from './access-matrix/access-matrix.module';
import { ReportModule } from './report/report.module';

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
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],
    exports: []

})
export class EntityModule { }
