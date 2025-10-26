import { TestBed } from '@angular/core/testing';
import { ReducedMotionService } from './reduced-motion.service';

describe('ReducedMotionService', () => {
  let service: ReducedMotionService;
  let mockMatchMedia: jasmine.Spy;

  beforeEach(() => {
    // Mock matchMedia
    mockMatchMedia = jasmine.createSpy('matchMedia').and.returnValue({
      matches: false,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      addListener: jasmine.createSpy('addListener'),
      removeListener: jasmine.createSpy('removeListener'),
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ReducedMotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with matchMedia query for prefers-reduced-motion', () => {
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('should return false for prefersReducedMotion when media query does not match', () => {
    expect(service.prefersReducedMotion).toBe(false);
  });

  it('should return true for prefersReducedMotion when media query matches', () => {
    // Create a new service instance with matching media query
    mockMatchMedia.and.returnValue({
      matches: true,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      addListener: jasmine.createSpy('addListener'),
      removeListener: jasmine.createSpy('removeListener'),
    });

    const newService = new ReducedMotionService();
    expect(newService.prefersReducedMotion).toBe(true);
  });

  it('should return 0 animation duration when reduced motion is preferred', () => {
    // Mock reduced motion preference
    spyOnProperty(service, 'prefersReducedMotion', 'get').and.returnValue(true);

    expect(service.getAnimationDuration(300)).toBe(0);
  });

  it('should return normal animation duration when reduced motion is not preferred', () => {
    expect(service.getAnimationDuration(300)).toBe(300);
  });

  it('should return reduced-motion class when reduced motion is preferred', () => {
    spyOnProperty(service, 'prefersReducedMotion', 'get').and.returnValue(true);

    expect(service.getReducedMotionClass()).toBe('reduced-motion');
  });

  it('should return empty string when reduced motion is not preferred', () => {
    expect(service.getReducedMotionClass()).toBe('');
  });

  it('should return true for shouldDisableAnimations when reduced motion is preferred', () => {
    spyOnProperty(service, 'prefersReducedMotion', 'get').and.returnValue(true);

    expect(service.shouldDisableAnimations()).toBe(true);
  });

  it('should return false for shouldDisableAnimations when reduced motion is not preferred', () => {
    expect(service.shouldDisableAnimations()).toBe(false);
  });
});
