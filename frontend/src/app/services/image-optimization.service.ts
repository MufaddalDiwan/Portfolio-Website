import { Injectable } from '@angular/core';
import { IMAGE_PLACEHOLDERS } from '../../assets/images/placeholders';
import { PROJECT_PLACEHOLDERS } from '../../assets/images/project-placeholders';

export interface OptimizedImage {
  src: string;
  placeholder?: string;
  srcset?: string;
  sizes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImageOptimizationService {
  /**
   * Get optimized image configuration for project images
   */
  getProjectImage(imageName: string, featured = false): OptimizedImage {
    if (!imageName) {
      return {
        src: this.getPlaceholderDataURL('project'),
        placeholder: this.getPlaceholderDataURL('project', true),
      };
    }

    // Convert to WebP format
    const webpImage = imageName.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const basePath = `/content/images/projects/${webpImage}`;

    // Get project-specific blur placeholder
    const projectKey = imageName
      .replace(/\.(jpg|jpeg|png|webp)$/i, '')
      .toUpperCase()
      .replace(/-/g, '_');
    const placeholder =
      PROJECT_PLACEHOLDERS[projectKey as keyof typeof PROJECT_PLACEHOLDERS] ||
      this.getProjectPlaceholder();

    return {
      src: basePath,
      placeholder,
      sizes: featured
        ? '(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 500px'
        : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
    };
  }

  /**
   * Get optimized avatar image configuration
   */
  getAvatarImage(): OptimizedImage {
    return {
      src: '/assets/images/avatar.webp',
      placeholder: IMAGE_PLACEHOLDERS.AVATAR,
      sizes: '(max-width: 768px) 80px, 120px',
    };
  }

  /**
   * Get optimized profile image configuration
   */
  getProfileImage(): OptimizedImage {
    return {
      src: '/assets/images/profile.webp',
      placeholder: IMAGE_PLACEHOLDERS.PROFILE,
      sizes: '(max-width: 768px) 200px, 300px',
    };
  }

  /**
   * Generate a simple placeholder data URL for projects
   */
  private getProjectPlaceholder(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjMUExQTFBIi8+CjxyZWN0IHg9IjEyIiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iOCIgcng9IjEiIGZpbGw9IiMzMzMzMzMiLz4KPC9zdmc+';
  }

  /**
   * Generate placeholder data URL for different image types
   */
  private getPlaceholderDataURL(type: 'project' | 'profile' | 'avatar', blur = false): string {
    const size = type === 'project' ? '40x24' : type === 'profile' ? '20x20' : '12x12';
    const [width, height] = size.split('x').map(Number);

    const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1A1A1A"/>
      ${type === 'project' ? `<rect x="${width / 4}" y="${height / 3}" width="${width / 2}" height="${height / 3}" rx="1" fill="#333333"/>` : ''}
      ${type !== 'project' ? `<circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 4}" fill="#333333"/>` : ''}
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Check if WebP is supported by the browser
   */
  isWebPSupported(): Promise<boolean> {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Get fallback image path for non-WebP browsers
   */
  getFallbackImage(webpPath: string): string {
    return webpPath.replace('.webp', '.jpg');
  }
}
