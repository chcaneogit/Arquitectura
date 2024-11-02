import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerReportePage } from './ver-reporte.page';

describe('VerReportePage', () => {
  let component: VerReportePage;
  let fixture: ComponentFixture<VerReportePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerReportePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
