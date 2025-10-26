import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReducedMotionService } from '../../../services/reduced-motion.service';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-heading.component.html',
  styleUrl: './section-heading.component.css',
})
export class SectionHeadingComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) number!: string;
  @Input({ required: true }) title!: string;
  @Input() className?: string;

  @ViewChild('headingElement', { static: true }) headingElement!: ElementRef<HTMLElement>;

  private observer?: IntersectionObserver;
  isVisible = false;
  prefersReducedMotion = false;

  constructor(private reducedMotionService: ReducedMotionService) {}

  ngOnInit(): void {
    // Validate required inputs
    if (!this.number || !this.title) {
      console.warn('SectionHeadingComponent requires both number and title inputs');
    }

    // Get reduced motion preference
    this.prefersReducedMotion = this.reducedMotionService.prefersReducedMotion;

    // If reduced motion is preferred, show immediately without animation
    if (this.prefersReducedMotion) {
      this.isVisible = true;
    }
  }

  getHeadingId(): string {
    return this.title.toLowerCase().replace(/\s+/g, '-') + '-heading';
  }

  ngAfterViewInit(): void {
    // Only set up intersection observer if animations are enabled
    if (!this.prefersReducedMotion) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show immediately if not supported
      this.isVisible = true;
      return;
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Trigger when 10% from bottom of viewport
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isVisible) {
          this.isVisible = true;
          // Once visible, we can stop observing
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    if (this.headingElement?.nativeElement) {
      this.observer.observe(this.headingElement.nativeElement);
    }
  }
}
