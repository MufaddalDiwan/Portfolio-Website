import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ApiService, SiteMeta } from '../../services/api.service';
import { ScrollSpyService } from '../../services/scroll-spy.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { ReducedMotionService } from '../../services/reduced-motion.service';
import {
  ImageOptimizationService,
  OptimizedImage,
} from '../../services/image-optimization.service';

export interface NavItem {
  label: string;
  anchor: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  // ViewChild for mobile menu focus management
  @ViewChild('mobileMenuOverlay', { static: false }) mobileMenuOverlay?: ElementRef<HTMLElement>;
  @ViewChild('mobileMenuToggle', { static: false })
  mobileMenuToggle?: ElementRef<HTMLButtonElement>;

  // Signals for reactive state management
  protected readonly siteMeta = signal<SiteMeta | null>(null);
  protected readonly activeSection = signal<string>('');
  protected readonly isLoading = signal<boolean>(true);
  protected readonly error = signal<string | null>(null);

  // Mobile menu state
  protected readonly isMobileMenuOpen = signal<boolean>(false);
  protected readonly isMobile = signal<boolean>(false);

  // Theme state
  protected readonly currentTheme = signal<Theme>('dark');

  // Reduced motion state
  protected readonly prefersReducedMotion = signal<boolean>(false);

  // Avatar image state
  protected readonly avatarImageError = signal<boolean>(false);

  // Navigation items
  protected readonly navItems = signal<NavItem[]>([
    { label: 'About', anchor: 'about', active: false },
    { label: 'Experience', anchor: 'experience', active: false },
    { label: 'Projects', anchor: 'projects', active: false },
    { label: 'Contact', anchor: 'contact', active: false },
  ]);

  // Computed properties
  protected readonly updatedNavItems = computed(() => {
    const currentActive = this.activeSection();
    return this.navItems().map((item) => ({
      ...item,
      active: item.anchor === currentActive,
    }));
  });

  constructor(
    private apiService: ApiService,
    private scrollSpyService: ScrollSpyService,
    private themeService: ThemeService,
    private reducedMotionService: ReducedMotionService,
    private imageOptimizationService: ImageOptimizationService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadSiteMetadata();
    this.initializeScrollSpy();
    this.initializeTheme();
    this.initializeReducedMotion();
    this.checkMobileBreakpoint();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.scrollSpyService.cleanup();
  }

  /**
   * Load site metadata from API
   */
  private loadSiteMetadata(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.apiService
      .getMeta()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (meta) => {
          this.siteMeta.set(meta);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load site metadata:', error);
          this.error.set('Failed to load profile information');
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Initialize scroll spy functionality
   */
  private initializeScrollSpy(): void {
    const sectionIds = this.navItems().map((item) => item.anchor);

    // Start observing sections
    this.scrollSpyService.observeSections(sectionIds);

    // Subscribe to active section changes
    this.scrollSpyService.activeSection$
      .pipe(takeUntil(this.destroy$))
      .subscribe((activeSection) => {
        this.activeSection.set(activeSection);
      });
  }

  /**
   * Initialize theme functionality
   */
  private initializeTheme(): void {
    // Subscribe to theme changes
    this.themeService.currentTheme$.pipe(takeUntil(this.destroy$)).subscribe((theme) => {
      this.currentTheme.set(theme);
    });
  }

  /**
   * Initialize reduced motion functionality
   */
  private initializeReducedMotion(): void {
    // Subscribe to reduced motion preference changes
    this.reducedMotionService.prefersReducedMotion$
      .pipe(takeUntil(this.destroy$))
      .subscribe((prefersReducedMotion) => {
        this.prefersReducedMotion.set(prefersReducedMotion);
      });
  }

  /**
   * Handle navigation item click
   */
  protected onNavItemClick(anchor: string, event: Event): void {
    event.preventDefault();
    this.scrollSpyService.scrollToSection(anchor);

    // Close mobile menu after navigation
    if (this.isMobile() && this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
  }

  /**
   * Handle keyboard navigation for nav items
   */
  protected onNavItemKeydown(anchor: string, event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onNavItemClick(anchor, event);
    }
  }

  /**
   * Handle social link click (for analytics if needed)
   */
  protected onSocialLinkClick(platform: string, url: string): void {
    // Could add analytics tracking here
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Get social link icon class based on platform
   */
  protected getSocialIconClass(platform: string): string {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
      case 'github':
        return 'icon-github';
      case 'linkedin':
        return 'icon-linkedin';
      case 'twitter':
        return 'icon-twitter';
      case 'email':
        return 'icon-email';
      default:
        return 'icon-link';
    }
  }

  /**
   * Get aria-label for social links
   */
  protected getSocialAriaLabel(platform: string): string {
    return `Visit my ${platform} profile`;
  }

  /**
   * Handle retry button click
   */
  protected onRetryClick(): void {
    this.loadSiteMetadata();
  }

  /**
   * Handle theme toggle button click
   */
  protected onThemeToggle(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Get theme toggle aria label
   */
  protected getThemeToggleAriaLabel(): string {
    const nextTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    return `Switch to ${nextTheme} theme`;
  }

  /**
   * Check if we're on mobile breakpoint
   */
  private checkMobileBreakpoint(): void {
    const isMobile = window.innerWidth < 768;
    this.isMobile.set(isMobile);

    // Close mobile menu if switching to desktop
    if (!isMobile && this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
  }

  /**
   * Handle window resize
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    this.checkMobileBreakpoint();
  }

  /**
   * Handle escape key press
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.isMobileMenuOpen()) {
      keyboardEvent.preventDefault();
      this.closeMobileMenu();
    }
  }

  /**
   * Handle clicks outside mobile menu
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isMobileMenuOpen() || !this.isMobile()) {
      return;
    }

    const target = event.target as HTMLElement;
    const sidebar = this.elementRef.nativeElement;

    // Close menu if click is outside sidebar
    if (!sidebar.contains(target)) {
      this.closeMobileMenu();
    }
  }

  /**
   * Toggle mobile menu
   */
  protected toggleMobileMenu(): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  private openMobileMenu(): void {
    this.isMobileMenuOpen.set(true);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Focus trap - focus first nav item after animation (or immediately if reduced motion)
    const delay = this.prefersReducedMotion() ? 0 : 150;
    setTimeout(() => {
      const firstNavLink = this.mobileMenuOverlay?.nativeElement.querySelector(
        '.nav-link'
      ) as HTMLElement;
      firstNavLink?.focus();
    }, delay);
  }

  /**
   * Close mobile menu
   */
  private closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus to toggle button (immediately if reduced motion)
    const delay = this.prefersReducedMotion() ? 0 : 150;
    setTimeout(() => {
      this.mobileMenuToggle?.nativeElement.focus();
    }, delay);
  }

  /**
   * Get optimized avatar image
   */
  protected get avatarImage(): OptimizedImage {
    return this.imageOptimizationService.getAvatarImage();
  }

  /**
   * Handle avatar image error
   */
  protected onAvatarImageError(): void {
    this.avatarImageError.set(true);
  }

  /**
   * Handle focus trap in mobile menu
   */
  protected onMobileMenuKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (!this.isMobileMenuOpen() || !this.mobileMenuOverlay) {
      return;
    }

    const focusableElements = this.mobileMenuOverlay.nativeElement.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (keyboardEvent.key === 'Tab') {
      if (keyboardEvent.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          keyboardEvent.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          keyboardEvent.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
}
