import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'portfolio-theme';
  private readonly themeSubject = new BehaviorSubject<Theme>('dark');

  constructor() {
    this.initializeTheme();
  }

  /**
   * Get current theme as observable
   */
  get currentTheme$(): Observable<Theme> {
    return this.themeSubject.asObservable();
  }

  /**
   * Get current theme value
   */
  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * Toggle between dark and light theme
   */
  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.persistTheme(theme);
    this.applyTheme(theme);
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    const savedTheme = this.getSavedTheme();
    const systemTheme = this.getSystemPreference();
    const initialTheme = savedTheme || systemTheme;

    this.setTheme(initialTheme);
    this.listenToSystemChanges();
  }

  /**
   * Get saved theme from localStorage
   */
  private getSavedTheme(): Theme | null {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
      return null;
    }
  }

  /**
   * Get system color scheme preference
   */
  private getSystemPreference(): Theme {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark'; // Default fallback
  }

  /**
   * Persist theme to localStorage
   */
  private persistTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Remove existing theme classes
      root.classList.remove('dark', 'light');
      
      // Add new theme class
      root.classList.add(theme);
      
      // Update data attribute for CSS targeting
      root.setAttribute('data-theme', theme);
    }
  }

  /**
   * Listen to system color scheme changes
   */
  private listenToSystemChanges(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only update if no theme is saved (user hasn't made explicit choice)
        if (!this.getSavedTheme()) {
          const systemTheme: Theme = e.matches ? 'light' : 'dark';
          this.setTheme(systemTheme);
        }
      });
    }
  }
}