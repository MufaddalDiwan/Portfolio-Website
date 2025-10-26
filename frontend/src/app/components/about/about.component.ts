import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  SecurityContext,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ApiService, SiteMeta } from '../../services/api.service';
import { ReducedMotionService } from '../../services/reduced-motion.service';
import {
  ImageOptimizationService,
  OptimizedImage,
} from '../../services/image-optimization.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit, OnDestroy {
  @ViewChild('aboutSection', { static: true }) aboutSection!: ElementRef<HTMLElement>;

  siteMeta: SiteMeta | null = null;
  renderedBio: SafeHtml = '';
  isLoading = true;
  error: string | null = null;
  isVisible = false;
  prefersReducedMotion = false;
  profileImageError = false;

  private destroy$ = new Subject<void>();
  private observer?: IntersectionObserver;

  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private reducedMotionService: ReducedMotionService,
    private imageOptimizationService: ImageOptimizationService
  ) {
    this.configureMarked();
  }

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

  private configureMarked(): void {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }

  private loadSiteMeta(): void {
    this.apiService
      .getMeta()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (meta) => {
          this.siteMeta = meta;
          this.renderBio(meta.bioMd || '');
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load site metadata:', error);
          this.error = 'Failed to load content. Please try again later.';
          this.isLoading = false;
        },
      });
  }

  private renderBio(markdown: string): void {
    try {
      // Convert markdown to HTML
      const rawHtml = marked(markdown) as string;

      // Sanitize the HTML to prevent XSS
      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          'p',
          'br',
          'strong',
          'em',
          'a',
          'ul',
          'ol',
          'li',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'code',
          'pre',
          'blockquote',
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
      });

      // Trust the sanitized HTML
      this.renderedBio = this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
    } catch (error) {
      console.error('Failed to render markdown:', error);
      this.renderedBio = this.sanitizer.bypassSecurityTrustHtml(
        '<p>Unable to render bio content.</p>'
      );
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
        }
      });
    }, options);

    if (this.aboutSection?.nativeElement) {
      this.observer.observe(this.aboutSection.nativeElement);
    }
  }

  retryLoad(): void {
    this.error = null;
    this.isLoading = true;
    this.loadSiteMeta();
  }

  onImageError(event: Event): void {
    this.profileImageError = true;
    console.warn('Profile image failed to load');
  }

  get profileImage(): OptimizedImage {
    return this.imageOptimizationService.getProfileImage();
  }
}
