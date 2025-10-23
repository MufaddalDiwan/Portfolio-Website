import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, map, retry, retryWhen, delayWhen, take, concatMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  title: string;
  slug: string;
  shortDesc: string;
  longMd: string;
  tech: string[];
  githubUrl: string;
  demoUrl: string;
  coverImage: string;
  featured: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  bullets: string[];
  tech: string[];
  orderIndex: number;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface SiteMeta {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  bioMd: string;
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor(private http: HttpClient) {}

  /**
   * Get all projects with optional featured filter
   */
  getProjects(featured?: boolean): Observable<Project[]> {
    let params = new HttpParams();
    if (featured !== undefined) {
      params = params.set('featured', featured.toString());
    }

    return this.http.get<Project[]>(`${this.baseUrl}/projects`, { params })
      .pipe(
        catchError(this.handleError.bind(this)),
        retryWhen(this.retryStrategy.bind(this))
      );
  }

  /**
   * Get a single project by slug
   */
  getProjectBySlug(slug: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${slug}`)
      .pipe(
        catchError(this.handleError.bind(this)),
        retryWhen(this.retryStrategy.bind(this))
      );
  }

  /**
   * Get all experience entries
   */
  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.baseUrl}/experience`)
      .pipe(
        catchError(this.handleError.bind(this)),
        retryWhen(this.retryStrategy.bind(this))
      );
  }

  /**
   * Get site metadata
  */
  getMeta(): Observable<SiteMeta> {
    return this.http.get<SiteMeta>(`${this.baseUrl}/meta`)
      .pipe(
        catchError(this.handleError.bind(this)),
        retryWhen(this.retryStrategy.bind(this))
      );
  }
  
  /**
   * Submit contact form
   */
  submitContact(form: ContactForm): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/contact`, form)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Handle HTTP errors with appropriate error messages
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request data';
          break;
        case 404:
          errorMessage = 'Content not found';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Server error: ${error.status}`;
      }
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Retry strategy with exponential backoff
   */
  private retryStrategy(errors: Observable<any>): Observable<any> {
    return errors.pipe(
      concatMap((error, index) => {
        // Don't retry client errors (4xx) or if max retries exceeded
        if (error.status >= 400 && error.status < 500 || index >= this.maxRetries) {
          return throwError(() => error);
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = this.retryDelay * Math.pow(2, index);
        console.log(`Retrying API request in ${delay}ms (attempt ${index + 1}/${this.maxRetries})`);
        
        return timer(delay);
      }),
      take(this.maxRetries)
    );
  }
}