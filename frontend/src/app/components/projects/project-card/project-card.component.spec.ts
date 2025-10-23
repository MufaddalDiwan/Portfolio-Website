import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent } from './project-card.component';
import { Project } from '../../../services/api.service';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  const mockProject: Project = {
    id: 1,
    title: 'Test Project',
    slug: 'test-project',
    shortDesc: 'Test description',
    longMd: 'Long description',
    tech: ['React', 'TypeScript'],
    githubUrl: 'https://github.com/test/project',
    demoUrl: 'https://demo.com',
    coverImage: 'test-project.jpg',
    featured: true,
    orderIndex: 1,
    createdAt: '2023-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    component.project = mockProject;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display project information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.project-title')?.textContent).toContain('Test Project');
    expect(compiled.querySelector('.project-description')?.textContent).toContain('Test description');
  });

  it('should show featured badge for featured projects', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.featured-badge')).toBeTruthy();
  });

  it('should not show featured badge for non-featured projects', () => {
    component.project = { ...mockProject, featured: false };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.featured-badge')).toBeFalsy();
  });

  it('should display tech tags', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const techTags = compiled.querySelectorAll('.tech-tag');
    
    expect(techTags.length).toBe(2);
    expect(techTags[0].textContent?.trim()).toBe('React');
    expect(techTags[1].textContent?.trim()).toBe('TypeScript');
  });

  it('should show GitHub link when available', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.github-link')).toBeTruthy();
  });

  it('should show demo link when available', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.demo-link')).toBeTruthy();
  });

  it('should not show links when URLs are empty', () => {
    component.project = { ...mockProject, githubUrl: '', demoUrl: '' };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.github-link')).toBeFalsy();
    expect(compiled.querySelector('.demo-link')).toBeFalsy();
  });

  it('should return correct cover image path', () => {
    expect(component.coverImagePath).toBe('/content/images/projects/test-project.jpg');
  });

  it('should return placeholder for missing cover image', () => {
    component.project = { ...mockProject, coverImage: '' };
    expect(component.coverImagePath).toContain('data:image/svg+xml');
  });

  it('should return correct image alt text', () => {
    expect(component.imageAltText).toBe('Screenshot of Test Project project');
  });

  it('should track by tech name', () => {
    const result = component.trackByTech(0, 'React');
    expect(result).toBe('React');
  });

  it('should open external links', () => {
    spyOn(window, 'open');
    const event = new Event('click');
    spyOn(event, 'stopPropagation');
    
    component.openLink('https://example.com', event);
    
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  it('should handle card click', () => {
    spyOn(console, 'log');
    
    component.onCardClick();
    
    expect(console.log).toHaveBeenCalledWith('Project card clicked:', 'test-project');
  });
});