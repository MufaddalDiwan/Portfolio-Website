import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Project } from '../../services/api.service';
import { ProjectCardComponent } from './project-card/project-card.component';
import { SectionHeadingComponent } from '../shared';
import { ReducedMotionService } from '../../services/reduced-motion.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, SectionHeadingComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  showFeaturedOnly = false;
  loading = true;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private reducedMotionService: ReducedMotionService
  ) {}

  get prefersReducedMotion(): boolean {
    return this.reducedMotionService.prefersReducedMotion;
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Failed to load projects:', error);
      }
    });
  }

  toggleFilter(): void {
    this.showFeaturedOnly = !this.showFeaturedOnly;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.showFeaturedOnly) {
      this.filteredProjects = this.projects.filter(project => project.featured);
    } else {
      this.filteredProjects = [...this.projects];
    }
  }

  get filterButtonText(): string {
    return this.showFeaturedOnly ? 'Show All Projects' : 'Show Featured Only';
  }

  get featuredCount(): number {
    return this.projects.filter(project => project.featured).length;
  }

  get totalCount(): number {
    return this.projects.length;
  }

  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

  getFilterAriaLabel(): string {
    const action = this.showFeaturedOnly ? 'Show all projects' : 'Show only featured projects';
    const count = this.showFeaturedOnly ? this.totalCount : this.featuredCount;
    return `${action}. Currently showing ${this.filteredProjects.length} of ${this.totalCount} projects.`;
  }

  getProjectsAriaLabel(): string {
    const type = this.showFeaturedOnly ? 'featured ' : '';
    return `${type}projects list with ${this.filteredProjects.length} items`;
  }
}