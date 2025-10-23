import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ApiService, SiteMeta } from '../../services/api.service';
import { ScrollSpyService } from '../../services/scroll-spy.service';
import { ReducedMotionService } from '../../services/reduced-motion.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef<HTMLElement>;
  
  siteMeta: SiteMeta | null = null;
  isLoading = true;
  error: string | null = null;
  isVisible = false;
  prefersReducedMotion = false;
  
  private destroy$ = new Subject<void>();
  private observer?: IntersectionObserver;

  constructor(
    private apiService: ApiService,
    private scrollSpyService: ScrollSpyService,
    private reducedMotionService: ReducedMotionService
  ) {}

  ngOnInit(): void {
    // Get reduced motion preference
    this.prefersReducedMotion = this.reducedMotionService.prefersReducedMotion;
    
    // If reduced motion is preferred, show immediately without animation
    if (this.prefersReducedMotion) {
      this.isVisible = true;
    }

    this.loadSiteMeta();
    
    // Only set up intersection observer if animations are enabled
    if (!this.prefersReducedMotion) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.observer?.disconnect();
  }

  loadSiteMeta(): void {
    this.apiService.getMeta()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (meta) => {
          this.siteMeta = meta;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load site metadata:', error);
          this.error = 'Failed to load content. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  private setupIntersectionObserver(): void {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
        }
      });
    }, options);

    if (this.heroSection?.nativeElement) {
      this.observer.observe(this.heroSection.nativeElement);
    }
  }

  scrollToSection(sectionId: string): void {
    this.scrollSpyService.scrollToSection(sectionId);
  }
}