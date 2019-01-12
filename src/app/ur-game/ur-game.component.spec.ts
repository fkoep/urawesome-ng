import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrGameComponent } from './ur-game.component';

describe('UrGameComponent', () => {
  let component: UrGameComponent;
  let fixture: ComponentFixture<UrGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
