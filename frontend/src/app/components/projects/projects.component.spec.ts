import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ProjectsComponent } from './projects.component';
import { ApiService, Project } from '../../services/api.service';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockProjects: Project[] = [
    {
      id: 1,
      title: 'Test Project 1',
      slug: 'test-project-1',
      shortDesc: 'Test description 1',
      longMd: 'Long description 1',
      tech: ['React', 'TypeScript'],
      githubUrl: 'https://github.com/test/project1',
      demoUrl: 'https://demo1.com',
      coverImage: 'project1.jpg',
      featured: true,
      orderIndex: 1,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Project 2',
      slug: 'test-project-2',
      shortDesc: 'Test description 2',
      longMd: 'Long description 2',
      tech: ['Vue', 'JavaScript'],
      githubUrl: 'https://github.com/test/project2',
      demoUrl: 'https://demo2.com',
      coverImage: 'project2.jpg',
      featured: false,
      orderIndex: 2,
      createdAt: '2023-01-02T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getProjects']);

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent, HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    apiService.getProjects.and.returnValue(of(mockProjects));

    component.ngOnInit();

    expect(apiService.getProjects).toHaveBeenCalled();
    expect(component.projects).toEqual(mockProjects);
    expect(component.filteredProjects).toEqual(mockProjects);
    expect(component.loading).toBeFalse();
  });

  it('should handle API error', () => {
    const errorMessage = 'API Error';
    apiService.getProjects.and.returnValue(throwError(() => new Error(errorMessage)));

    component.ngOnInit();

    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
  });

  it('should toggle filter correctly', () => {
    component.projects = mockProjects;
    component.showFeaturedOnly = false;

    component.toggleFilter();

    expect(component.showFeaturedOnly).toBeTrue();
    expect(component.filteredProjects).toEqual([mockProjects[0]]);
  });

  it('should return correct filter button text', () => {
    component.showFeaturedOnly = false;
    expect(component.filterButtonText).toBe('Show Featured Only');

    component.showFeaturedOnly = true;
    expect(component.filterButtonText).toBe('Show All Projects');
  });

  it('should return correct counts', () => {
    component.projects = mockProjects;

    expect(component.featuredCount).toBe(1);
    expect(component.totalCount).toBe(2);
  });

  it('should track by project id', () => {
    const project = mockProjects[0];
    const result = component.trackByProjectId(0, project);
    expect(result).toBe(project.id);
  });
});
