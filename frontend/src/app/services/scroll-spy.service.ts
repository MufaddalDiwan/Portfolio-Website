import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface ScrollSpyOptions {
  threshold?: number;
  rootMargin?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScrollSpyService {
  private readonly activeSectionSubject = new BehaviorSubject<string>('');
  private observer: IntersectionObserver | null = null;
  private sections: string[] = [];
  private readonly defaultOptions: ScrollSpyOptions = {
    threshold: 0.3,
    rootMargin: '-20% 0px -70% 0px',
  };

  constructor(private router: Router) {}

  /**
   * Get active section as observable
   */
  get activeSection$(): Observable<string> {
    return this.activeSectionSubject.asObservable();
  }

  /**
   * Get current active section
   */
  get activeSection(): string {
    return this.activeSectionSubject.value;
  }

  /**
   * Start observing sections for scroll spy
   */
  observeSections(sectionIds: string[], options?: ScrollSpyOptions): void {
    this.sections = sectionIds;
    this.cleanup();

    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      console.warn('IntersectionObserver not supported');
      return;
    }

    const config = { ...this.defaultOptions, ...options };

    this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), {
      threshold: config.threshold,
      rootMargin: config.rootMargin,
    });

    // Observe all sections
    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element && this.observer) {
        this.observer.observe(element);
      }
    });

    // Set initial active section based on current hash
    this.setInitialActiveSection();
  }

  /**
   * Scroll to a specific section
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Update hash in URL without triggering navigation
      this.updateHash(sectionId);
    }
  }

  /**
   * Stop observing sections
   */
  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Handle intersection observer entries
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    const visibleSections: { id: string; ratio: number; top: number }[] = [];

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        const rect = entry.boundingClientRect;

        visibleSections.push({
          id: sectionId,
          ratio: entry.intersectionRatio,
          top: rect.top,
        });
      }
    });

    if (visibleSections.length > 0) {
      // Sort by intersection ratio (most visible first), then by position (topmost first)
      visibleSections.sort((a, b) => {
        if (Math.abs(a.ratio - b.ratio) < 0.1) {
          return a.top - b.top; // If ratios are similar, prefer the one higher on screen
        }
        return b.ratio - a.ratio; // Otherwise, prefer the one with higher intersection ratio
      });

      const newActiveSection = visibleSections[0].id;

      if (newActiveSection !== this.activeSection) {
        this.activeSectionSubject.next(newActiveSection);
        this.updateHash(newActiveSection);
      }
    }
  }

  /**
   * Set initial active section based on URL hash
   */
  private setInitialActiveSection(): void {
    const hash = window.location.hash.replace('#', '');

    if (hash && this.sections.includes(hash)) {
      this.activeSectionSubject.next(hash);
    } else if (this.sections.length > 0) {
      // Default to first section if no hash or invalid hash
      this.activeSectionSubject.next(this.sections[0]);
    }
  }

  /**
   * Update URL hash without triggering navigation
   */
  private updateHash(sectionId: string): void {
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}${window.location.search}#${sectionId}`;

      // Use replaceState to update URL without adding to history
      window.history.replaceState(null, '', newUrl);
    }
  }

  /**
   * Get section element by ID
   */
  getSectionElement(sectionId: string): HTMLElement | null {
    return document.getElementById(sectionId);
  }

  /**
   * Check if a section is currently visible
   */
  isSectionVisible(sectionId: string): boolean {
    const element = this.getSectionElement(sectionId);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    return rect.top < windowHeight && rect.bottom > 0;
  }

  /**
   * Get all observed section IDs
   */
  getObservedSections(): string[] {
    return [...this.sections];
  }
}
