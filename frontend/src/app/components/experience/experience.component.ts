import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Experience } from '../../services/api.service';
import { ReducedMotionService } from '../../services/reduced-motion.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TechTagComponent } from '../shared';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, TechTagComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements OnInit {
  private apiService = inject(ApiService);
  private reducedMotionService = inject(ReducedMotionService);
  
  experiences$: Observable<Experience[]> = of([]);
  expandedItems = new Set<number>();
  loading = true;
  error: string | null = null;
  
  get prefersReducedMotion(): boolean {
    return this.reducedMotionService.prefersReducedMotion;
  }

  ngOnInit(): void {
    this.loadExperience();
  }

  private loadExperience(): void {
    this.loading = true;
    this.error = null;
    
    this.experiences$ = this.apiService.getExperience().pipe(
      catchError(error => {
        this.error = error.message || 'Failed to load experience data';
        this.loading = false;
        return of([]);
      })
    );

    this.experiences$.subscribe(() => {
      this.loading = false;
    });
  }

  /**
   * Toggle expand/collapse state for an experience item
   */
  toggleExpanded(experienceId: number): void {
    if (this.expandedItems.has(experienceId)) {
      this.expandedItems.delete(experienceId);
    } else {
      this.expandedItems.add(experienceId);
    }
  }

  /**
   * Check if an experience item is expanded
   */
  isExpanded(experienceId: number): boolean {
    return this.expandedItems.has(experienceId);
  }

  /**
   * Format date range for display
   */
  formatDateRange(startDate: string, endDate: string | null): string {
    // Parse date string as YYYY-MM-DD and create date in UTC to avoid timezone issues
    const [startYear, startMonth] = startDate.split('-').map(Number);
    const start = new Date(startYear, startMonth - 1); // Month is 0-indexed
    const startFormatted = start.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });

    if (!endDate) {
      return `${startFormatted} - Present`;
    }

    const [endYear, endMonth] = endDate.split('-').map(Number);
    const end = new Date(endYear, endMonth - 1); // Month is 0-indexed
    const endFormatted = end.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });

    return `${startFormatted} - ${endFormatted}`;
  }

  /**
   * Calculate duration between start and end dates
   */
  calculateDuration(startDate: string, endDate: string | null): string {
    // Parse date string as YYYY-MM-DD and create date in UTC to avoid timezone issues
    const [startYear, startMonth] = startDate.split('-').map(Number);
    const start = new Date(startYear, startMonth - 1); // Month is 0-indexed
    
    let end: Date;
    if (endDate) {
      const [endYear, endMonth] = endDate.split('-').map(Number);
      end = new Date(endYear, endMonth - 1); // Month is 0-indexed
    } else {
      end = new Date();
    }
    
    const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + 
                        (end.getMonth() - start.getMonth());
    
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? '1 month' : `${diffInMonths} months`;
    }
    
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    
    let duration = years === 1 ? '1 year' : `${years} years`;
    if (months > 0) {
      duration += months === 1 ? ' 1 month' : ` ${months} months`;
    }
    
    return duration;
  }

  /**
   * Retry loading experience data
   */
  retry(): void {
    this.loadExperience();
  }

  /**
   * TrackBy function for ngFor to improve performance
   */
  trackByExperienceId(index: number, experience: Experience): number {
    return experience.id;
  }
}