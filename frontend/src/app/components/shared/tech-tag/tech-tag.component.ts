import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-tag.component.html',
  styleUrl: './tech-tag.component.css',
})
export class TechTagComponent {
  @Input({ required: true }) tech!: string;
  @Input() variant: 'default' | 'featured' | 'large' = 'default';
  @Input() clickable = false;
  @Input() className?: string;

  /**
   * Handle tech tag click if clickable
   */
  onTagClick(): void {
    if (this.clickable) {
      // Future: Could emit event for filtering by technology
      console.log('Tech tag clicked:', this.tech);
    }
  }

  /**
   * Get the CSS classes for the tech tag
   */
  get tagClasses(): string {
    const classes = ['tech-tag'];

    if (this.variant !== 'default') {
      classes.push(`tech-tag--${this.variant}`);
    }

    if (this.clickable) {
      classes.push('tech-tag--clickable');
    }

    if (this.className) {
      classes.push(this.className);
    }

    return classes.join(' ');
  }

  /**
   * Get appropriate ARIA attributes
   */
  get ariaAttributes(): Record<string, string> {
    const attrs: Record<string, string> = {
      'aria-label': `Technology: ${this.tech}`,
    };

    if (this.clickable) {
      attrs['role'] = 'button';
      attrs['tabindex'] = '0';
    }

    return attrs;
  }
}
