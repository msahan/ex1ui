import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGamePersonaComponent } from './app-game-persona.component';

describe('AppGamePersonaComponent', () => {
  let component: AppGamePersonaComponent;
  let fixture: ComponentFixture<AppGamePersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppGamePersonaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGamePersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
