import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';
import { SectionHeadingComponent, FooterComponent } from '../shared';
import { ReducedMotionService } from '../../services/reduced-motion.service';
import { ApiService, MetaService } from '../../services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    SidebarComponent, 
    HeroComponent, 
    AboutComponent, 
    ExperienceComponent, 
    ProjectsComponent, 
    ContactComponent,
    SectionHeadingComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private reducedMotionService: ReducedMotionService,
    private apiService: ApiService,
    private metaService: MetaService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  get prefersReducedMotion(): boolean {
    return this.reducedMotionService.prefersReducedMotion;
  }

  ngOnInit(): void {
    // Load site metadata and update meta tags
    this.apiService.getMeta()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (siteMeta) => {
          this.metaService.updateMetaTags(siteMeta);
        },
        error: (error) => {
          console.error('Failed to load site metadata:', error);
          // Meta tags will use default values from index.html
        }
      });

    if (isPlatformBrowser(this.platformId)) {
      // Handle hash-based navigation on route changes
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          takeUntil(this.destroy$)
        )
        .subscribe((event: NavigationEnd) => {
          this.handleHashNavigation(event.urlAfterRedirects);
        });

      // Handle initial hash if present
      setTimeout(() => {
        this.handleHashNavigation(this.router.url);
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleHashNavigation(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const hashIndex = url.indexOf('#');
    if (hashIndex > -1) {
      const fragment = url.substring(hashIndex + 1);
      const element = document.getElementById(fragment);
      
      if (element) {
        // Use appropriate scroll behavior based on reduced motion preference
        const scrollBehavior = this.prefersReducedMotion ? 'auto' : 'smooth';
        element.scrollIntoView({ 
          behavior: scrollBehavior, 
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }
}