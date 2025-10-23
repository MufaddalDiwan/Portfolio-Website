import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, ContactForm } from '../../services/api.service';
import { ReducedMotionService } from '../../services/reduced-motion.service';
import { SectionHeadingComponent } from '../shared';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SectionHeadingComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private reducedMotionService: ReducedMotionService
  ) {}
  
  get prefersReducedMotion(): boolean {
    return this.reducedMotionService.prefersReducedMotion;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]]
    });
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      const errors = field.errors;
      if (errors) {
        if (errors['required']) {
          return `${this.getFieldDisplayName(fieldName)} is required`;
        }
        if (errors['email']) {
          return 'Please enter a valid email address';
        }
        if (errors['minlength']) {
          const requiredLength = errors['minlength'].requiredLength;
          return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
        }
        if (errors['maxlength']) {
          const requiredLength = errors['maxlength'].requiredLength;
          return `${this.getFieldDisplayName(fieldName)} cannot exceed ${requiredLength} characters`;
        }
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      message: 'Message'
    };
    return displayNames[fieldName] || fieldName;
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = '';
      this.submitSuccess = false;

      const formData: ContactForm = {
        name: this.contactForm.value.name.trim(),
        email: this.contactForm.value.email.trim(),
        message: this.contactForm.value.message.trim()
      };

      this.apiService.submitContact(formData).subscribe({
        next: () => {
          this.submitSuccess = true;
          this.submitError = '';
          this.contactForm.reset();
          this.isSubmitting = false;
          
          // Reset form state to pristine
          Object.keys(this.contactForm.controls).forEach(key => {
            this.contactForm.get(key)?.setErrors(null);
          });
          this.contactForm.markAsUntouched();
          this.contactForm.markAsPristine();
        },
        error: (error: Error) => {
          this.isSubmitting = false;
          this.submitSuccess = false;
          
          // Handle specific error types
          if (error.message.includes('Too many requests')) {
            this.submitError = 'You have reached the rate limit. Please wait before sending another message.';
          } else if (error.message.includes('Invalid request data')) {
            this.submitError = 'Please check your input and try again.';
          } else if (error.message.includes('Server error')) {
            this.submitError = 'We are experiencing technical difficulties. Please try again later.';
          } else if (error.message.includes('Network error')) {
            this.submitError = 'Please check your internet connection and try again.';
          } else {
            this.submitError = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  clearMessages(): void {
    this.submitSuccess = false;
    this.submitError = '';
  }
}