import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageScrollComponent } from './image-scroll.component';

describe('ImageScrollComponent', () => {
  let component: ImageScrollComponent;
  let fixture: ComponentFixture<ImageScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageScrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
