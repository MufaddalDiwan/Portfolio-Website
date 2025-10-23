import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ContactComponent } from './contact.component';
import { ApiService } from '../../services/api.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['submitContact']);

    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.contactForm.get('name')?.value).toBe('');
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('message')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const nameControl = component.contactForm.get('name');
    const emailControl = component.contactForm.get('email');
    const messageControl = component.contactForm.get('message');

    expect(nameControl?.hasError('required')).toBeTruthy();
    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(messageControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should disable submit button when form is invalid', () => {
    expect(component.contactForm.invalid).toBeTruthy();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('.submit-button') as HTMLButtonElement;
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message that is long enough to pass validation.'
    });
    fixture.detectChanges();

    expect(component.contactForm.valid).toBeTruthy();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('.submit-button') as HTMLButtonElement;
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should submit form successfully', () => {
    mockApiService.submitContact.and.returnValue(of(undefined));
    
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message that is long enough to pass validation.'
    });

    component.onSubmit();

    expect(mockApiService.submitContact).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message that is long enough to pass validation.'
    });
    expect(component.submitSuccess).toBeTruthy();
    expect(component.submitError).toBe('');
  });

  it('should handle rate limit error', () => {
    const error = new Error('Too many requests. Please try again later.');
    mockApiService.submitContact.and.returnValue(throwError(() => error));
    
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message that is long enough to pass validation.'
    });

    component.onSubmit();

    expect(component.submitSuccess).toBeFalsy();
    expect(component.submitError).toBe('You have reached the rate limit. Please wait before sending another message.');
  });

  it('should handle server error', () => {
    const error = new Error('Server error. Please try again later.');
    mockApiService.submitContact.and.returnValue(throwError(() => error));
    
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message that is long enough to pass validation.'
    });

    component.onSubmit();

    expect(component.submitSuccess).toBeFalsy();
    expect(component.submitError).toBe('We are experiencing technical difficulties. Please try again later.');
  });

  it('should clear form after successful submission', () => {
    mockApiService.submitContact.and.returnValue(of(undefined));
    
    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message that is long enough to pass validation.'
    });

    component.onSubmit();

    expect(component.contactForm.get('name')?.value).toBeNull();
    expect(component.contactForm.get('email')?.value).toBeNull();
    expect(component.contactForm.get('message')?.value).toBeNull();
    expect(component.contactForm.pristine).toBeTruthy();
  });

  it('should display field errors', () => {
    const nameControl = component.contactForm.get('name');
    nameControl?.markAsTouched();
    fixture.detectChanges();

    expect(component.getFieldError('name')).toBe('Name is required');
  });

  it('should clear messages when user types', () => {
    component.submitError = 'Some error';
    component.submitSuccess = true;

    component.clearMessages();

    expect(component.submitError).toBe('');
    expect(component.submitSuccess).toBeFalsy();
  });
});