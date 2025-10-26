import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReducedMotionService implements OnDestroy {
  private readonly reducedMotionSubject = new BehaviorSubject<boolean>(false);
  private mediaQuery?: MediaQueryList;

  constructor() {
    this.initializeReducedMotionDetection();
  }

  /**
   * Observable that emits true when user prefers reduced motion
   */
  get prefersReducedMotion$(): Observable<boolean> {
    return this.reducedMotionSubject.asObservable();
  }

  /**
   * Get current reduced motion preference
   */
  get prefersReducedMotion(): boolean {
    return this.reducedMotionSubject.value;
  }

  /**
   * Initialize reduced motion detection using matchMedia
   */
  private initializeReducedMotionDetection(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.matchMedia) {
      // Default to false in non-browser environments
      this.reducedMotionSubject.next(false);
      return;
    }

    try {
      // Create media query for prefers-reduced-motion
      this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      // Set initial value
      this.reducedMotionSubject.next(this.mediaQuery.matches);

      // Listen for changes
      const handleChange = (event: MediaQueryListEvent) => {
        this.reducedMotionSubject.next(event.matches);
      };

      // Use addEventListener if available (modern browsers)
      if (this.mediaQuery.addEventListener) {
        this.mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        this.mediaQuery.addListener(handleChange);
      }
    } catch (error) {
      console.warn('Failed to initialize reduced motion detection:', error);
      // Default to false if detection fails
      this.reducedMotionSubject.next(false);
    }
  }

  /**
   * Check if animations should be disabled
   * This can be used by components to conditionally disable animations
   */
  shouldDisableAnimations(): boolean {
    return this.prefersReducedMotion;
  }

  /**
   * Get animation duration based on reduced motion preference
   * Returns 0 if reduced motion is preferred, otherwise returns the provided duration
   */
  getAnimationDuration(normalDuration: number): number {
    return this.prefersReducedMotion ? 0 : normalDuration;
  }

  /**
   * Get CSS class for reduced motion
   * Returns 'reduced-motion' if user prefers reduced motion
   */
  getReducedMotionClass(): string {
    return this.prefersReducedMotion ? 'reduced-motion' : '';
  }

  /**
   * Cleanup method for when service is destroyed
   */
  ngOnDestroy(): void {
    if (this.mediaQuery) {
      // Remove event listener to prevent memory leaks
      const handleChange = () => {};
      if (this.mediaQuery.removeEventListener) {
        this.mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        this.mediaQuery.removeListener(handleChange);
      }
    }
  }
}
