import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelurahanComponent } from './kelurahan.component';

describe('KelurahanComponent', () => {
  let component: KelurahanComponent;
  let fixture: ComponentFixture<KelurahanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelurahanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelurahanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
