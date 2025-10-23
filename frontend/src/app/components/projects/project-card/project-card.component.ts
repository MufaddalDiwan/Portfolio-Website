import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Project } from '../../../services/api.service';
import { TechTagComponent } from '../../shared';
import { ReducedMotionService } from '../../../services/reduced-motion.service';
import { ImageOptimizationService, OptimizedImage } from '../../../services/image-optimization.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TechTagComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;

  constructor(
    private reducedMotionService: ReducedMotionService,
    private imageOptimizationService: ImageOptimizationService
  ) {}

  get prefersReducedMotion(): boolean {
    return this.reducedMotionService.prefersReducedMotion;
  }

  /**
   * Open external link in new tab
   */
  openLink(url: string, event: Event): void {
    event.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Handle card click - could navigate to project detail in future
   */
  onCardClick(): void {
    // Future: Navigate to project detail page
    console.log('Project card clicked:', this.project.slug);
  }

  /**
   * Get optimized image configuration
   */
  get optimizedImage(): OptimizedImage {
    return this.imageOptimizationService.getProjectImage(this.project.coverImage, this.project.featured);
  }

  /**
   * Get alt text for the project image
   */
  get imageAltText(): string {
    return `Screenshot of ${this.project.title} project`;
  }

  /**
   * Track by function for tech tags
   */
  trackByTech(index: number, tech: string): string {
    return tech;
  }
}