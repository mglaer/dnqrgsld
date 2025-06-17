import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityChoosingComponent } from './entity-choosing.component';

describe('EntityChoosingComponent', () => {
  let component: EntityChoosingComponent;
  let fixture: ComponentFixture<EntityChoosingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityChoosingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityChoosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
