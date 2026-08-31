import { Component, Input, AfterViewInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-image-scroll',
    imports: [],
    templateUrl: './image-scroll.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./image-scroll.component.css']
})
export class ImageScrollComponent implements AfterViewInit {
  @Input() images: string[] = [];
  @Input() scrollDirection: 'right' | 'left' = 'right';

  constructor(private el: ElementRef) {}

  
  ngAfterViewInit(): void {
    const track = this.el.nativeElement.querySelector('.image-track');
    const section = this.el.nativeElement.querySelector('.scrolling-images');
  
    const maxTranslate = window.innerWidth * 1.4;
    
    // KEY FIX: define scroll direction correctly
    const scrollsLeft = this.scrollDirection === 'left';
  
    const startOffset = scrollsLeft ? 0 : -maxTranslate;
    const endOffset = scrollsLeft ? -maxTranslate : 0;
  
    track.style.transform = `translateX(${startOffset}px)`;
  
    window.addEventListener('scroll', () => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
  
      const startScroll = sectionTop - windowHeight * 0.5;
      const endScroll = sectionTop + sectionHeight - windowHeight * 0.2;
  
      if (scrollY >= startScroll && scrollY <= endScroll) {
        const progress = (scrollY - startScroll) / (endScroll - startScroll);
        const translateX = startOffset + (endOffset - startOffset) * progress;
  
        track.style.transform = `translateX(${translateX}px)`;
      }
    });
  }
  
  
}