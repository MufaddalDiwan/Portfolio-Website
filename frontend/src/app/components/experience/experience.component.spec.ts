import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ExperienceComponent } from './experience.component';
import { ApiService, Experience } from '../../services/api.service';

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockExperiences: Experience[] = [
    {
      id: 1,
      company: 'Test Company',
      role: 'Test Role',
      location: 'Test Location',
      startDate: '2022-01-01',
      endDate: null,
      bullets: ['Test bullet 1', 'Test bullet 2'],
      tech: ['React', 'TypeScript'],
      orderIndex: 1
    }
  ];

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getExperience']);

    await TestBed.configureTestingModule({
      imports: [ExperienceComponent, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load experience data on init', () => {
    apiService.getExperience.and.returnValue(of(mockExperiences));
    
    component.ngOnInit();
    
    expect(apiService.getExperience).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should format date range correctly', () => {
    const result = component.formatDateRange('2022-01-01', '2023-12-31');
    expect(result).toBe('Jan 2022 - Dec 2023');
  });

  it('should format date range with present for null end date', () => {
    const result = component.formatDateRange('2022-01-01', null);
    expect(result).toBe('Jan 2022 - Present');
  });

  it('should calculate duration correctly', () => {
    const result = component.calculateDuration('2022-01-01', '2023-01-01');
    expect(result).toBe('1 year');
  });

  it('should toggle expanded state', () => {
    expect(component.isExpanded(1)).toBeFalse();
    
    component.toggleExpanded(1);
    expect(component.isExpanded(1)).toBeTrue();
    
    component.toggleExpanded(1);
    expect(component.isExpanded(1)).toBeFalse();
  });

  it('should track by experience id', () => {
    const experience = mockExperiences[0];
    const result = component.trackByExperienceId(0, experience);
    expect(result).toBe(experience.id);
  });
});