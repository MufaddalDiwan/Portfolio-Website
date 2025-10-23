import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SiteMeta } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Update meta tags with site data from API
   */
  updateMetaTags(siteMeta: SiteMeta): void {
    const name = this.extractNameFromTitle(siteMeta.heroTitle);
    const role = siteMeta.heroSubtitle;
    const bioExcerpt = this.extractBioExcerpt(siteMeta.bioMd);
    const siteUrl = this.getSiteUrl();
    
    // Update title
    this.title.setTitle(`${name} - ${role}`);
    
    // Update basic meta tags
    this.meta.updateTag({ name: 'description', content: `${role} specializing in modern web technologies. ${bioExcerpt}` });
    this.meta.updateTag({ name: 'author', content: name });
    
    // Update OpenGraph tags
    this.meta.updateTag({ property: 'og:title', content: `${name} - ${role}` });
    this.meta.updateTag({ property: 'og:description', content: `${role} specializing in modern web technologies. ${bioExcerpt}` });
    this.meta.updateTag({ property: 'og:url', content: siteUrl });
    this.meta.updateTag({ property: 'og:site_name', content: `${name} Portfolio` });
    
    // Update Twitter Card tags
    this.meta.updateTag({ name: 'twitter:title', content: `${name} - ${role}` });
    this.meta.updateTag({ name: 'twitter:description', content: `${role} specializing in modern web technologies. ${bioExcerpt}` });
    
    // Update canonical URL
    this.updateCanonicalUrl(siteUrl);
    
    // Update JSON-LD structured data
    this.updateStructuredData(name, role, bioExcerpt, siteMeta.socialLinks, siteUrl);
  }
  
  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url: string): void {
    let canonical = this.document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      this.document.head.appendChild(canonical);
    }
  }
  
  /**
   * Update JSON-LD structured data
   */
  private updateStructuredData(name: string, role: string, bioExcerpt: string, socialLinks: any[], siteUrl: string): void {
    // Update Person schema
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": name,
      "jobTitle": role,
      "description": `${role} specializing in modern web technologies`,
      "url": siteUrl,
      "image": `${siteUrl}/assets/images/profile.jpg`,
      "sameAs": socialLinks.map(link => link.url),
      "knowsAbout": [
        "JavaScript",
        "TypeScript",
        "Angular",
        "React",
        "Node.js",
        "Python",
        "Flask",
        "PostgreSQL",
        "MongoDB"
      ]
    };
    
    // Update WebSite schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": `${name} - ${role}`,
      "description": `Personal portfolio website showcasing projects, experience, and skills`,
      "url": siteUrl,
      "author": {
        "@type": "Person",
        "name": name
      },
      "inLanguage": "en-US",
      "copyrightYear": new Date().getFullYear().toString(),
      "genre": "Portfolio",
      "keywords": "full stack developer, web developer, portfolio, projects, experience"
    };
    
    this.updateJsonLdScript('person-schema', personSchema);
    this.updateJsonLdScript('website-schema', websiteSchema);
  }
  
  /**
   * Update or create JSON-LD script tag
   */
  private updateJsonLdScript(id: string, schema: any): void {
    let script = this.document.getElementById(id) as HTMLScriptElement;
    if (script) {
      script.textContent = JSON.stringify(schema, null, 2);
    } else {
      script = this.document.createElement('script') as HTMLScriptElement;
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema, null, 2);
      this.document.head.appendChild(script);
    }
  }
  
  /**
   * Extract name from hero title (remove common suffixes)
   */
  private extractNameFromTitle(heroTitle: string): string {
    return heroTitle.replace(/\s*-\s*(Developer|Engineer|Designer).*$/i, '').trim();
  }
  
  /**
   * Extract bio excerpt (first sentence or first 160 characters)
   */
  private extractBioExcerpt(bioMd: string): string {
    if (!bioMd) return '';
    
    // Remove markdown formatting
    const plainText = bioMd.replace(/[#*_`\[\]()]/g, '').trim();
    
    // Get first sentence or first 160 characters
    const firstSentence = plainText.split('.')[0];
    if (firstSentence.length <= 160) {
      return firstSentence + '.';
    }
    
    return plainText.substring(0, 157) + '...';
  }
  
  /**
   * Get site URL from environment or current location
   */
  private getSiteUrl(): string {
    // In production, this should be the actual domain
    // For now, using a placeholder that should be replaced in deployment
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://example.com';
  }
  
  /**
   * Update meta tags for specific sections (for future use with routing)
   */
  updateSectionMeta(section: string, title: string, description: string): void {
    const siteUrl = this.getSiteUrl();
    const fullTitle = `${title} | Portfolio`;
    
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: `${siteUrl}/#${section}` });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    
    this.updateCanonicalUrl(`${siteUrl}/#${section}`);
  }
}