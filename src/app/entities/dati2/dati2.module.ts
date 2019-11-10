import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dati2Component } from './dati2.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Dati2Service } from './dati2.service';

@NgModule({
    declarations: [
        Dati2Component
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule
    ],
    entryComponents: [
        Dati2Component,
    ],
    providers: [
        Dati2Service,
    ],
})
export class Dati2Module { }
