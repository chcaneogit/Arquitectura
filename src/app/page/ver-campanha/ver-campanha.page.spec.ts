import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerCampanhaPage } from './ver-campanha.page';

describe('VerCampanhaPage', () => {
  let component: VerCampanhaPage;
  let fixture: ComponentFixture<VerCampanhaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCampanhaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
