import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { App } from './app';
import { routes } from './app.routes';

// Mock component for testing
@Component({
  template: '<div>Home Component</div>',
})
class MockHomeComponent {}

describe('App', () => {
  let router: Router;
  let location: Location;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, HttpClientTestingModule],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(App);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have portfolio title', () => {
    const app = fixture.componentInstance;
    expect(app['title']()).toBe('portfolio');
  });

  it('should have router outlet', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should configure routes correctly', () => {
    expect(routes).toBeDefined();
    expect(routes.length).toBeGreaterThan(0);

    // Check that home route exists
    const homeRoute = routes.find((route) => route.path === '');
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.title).toBe('Portfolio - Full Stack Developer');

    // Check that wildcard route exists
    const wildcardRoute = routes.find((route) => route.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('');
  });
});
