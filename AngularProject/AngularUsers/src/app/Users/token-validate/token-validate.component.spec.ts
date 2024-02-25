import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenValidateComponent } from './token-validate.component';

describe('TokenValidateComponent', () => {
  let component: TokenValidateComponent;
  let fixture: ComponentFixture<TokenValidateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenValidateComponent]
    });
    fixture = TestBed.createComponent(TokenValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
