# SEO Implementation Guide

This document explains the SEO features implemented in the portfolio website.

## Features Implemented

### 1. Meta Tags in index.html
- **Title**: Dynamic title that updates based on API data
- **Description**: SEO-friendly description
- **Keywords**: Relevant keywords for search engines
- **Author**: Portfolio owner name
- **Canonical URL**: Prevents duplicate content issues

### 2. OpenGraph Meta Tags
- **og:type**: Set to "website"
- **og:title**: Dynamic title for social sharing
- **og:description**: Description for social media previews
- **og:image**: Social media preview image (1200x630px recommended)
- **og:url**: Canonical URL
- **og:site_name**: Site name for social platforms
- **og:locale**: Language locale

### 3. Twitter Card Meta Tags
- **twitter:card**: Set to "summary_large_image"
- **twitter:title**: Title for Twitter sharing
- **twitter:description**: Description for Twitter previews
- **twitter:image**: Twitter-specific image (1200x675px recommended)
- **twitter:creator**: Twitter handle of the portfolio owner
- **twitter:site**: Twitter handle of the website

### 4. JSON-LD Structured Data
- **Person Schema**: Defines the portfolio owner as a Person entity
- **WebSite Schema**: Defines the website structure and metadata

### 5. Static SEO Files
- **sitemap.xml**: XML sitemap for search engine crawling
- **robots.txt**: Instructions for search engine bots

## Dynamic Meta Tag Updates

The `MetaService` automatically updates meta tags when the site loads by:

1. Fetching site metadata from the API (`/api/meta`)
2. Extracting relevant information (name, role, bio)
3. Updating meta tags dynamically
4. Updating JSON-LD structured data with real content

## Required Images

Place these images in `src/assets/images/`:

- **og-image.jpg** (1200x630px): OpenGraph social sharing image
- **twitter-card.jpg** (1200x675px): Twitter Card image
- **profile.jpg** (400x400px): Profile image for structured data

## Configuration for Production

### 1. Update URLs in index.html
Replace `https://example.com` with your actual domain:
- Canonical URL
- OpenGraph URL
- Image URLs

### 2. Update Twitter Handles
Replace `@portfoliodev` with actual Twitter handles:
- `twitter:creator`
- `twitter:site`

### 3. Update Social Links
Ensure the API returns correct social media URLs that match the structured data.

### 4. Environment Configuration
Update `environment.prod.ts` with the correct API base URL.

## Testing SEO Implementation

### 1. Meta Tags
- View page source to verify meta tags are present
- Use browser dev tools to inspect `<head>` section
- Check that dynamic updates work when API data loads

### 2. Social Media Previews
- **Facebook**: Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: Share the URL and check preview

### 3. Structured Data
- Use [Google's Rich Results Test](https://search.google.com/test/rich-results)
- Verify Person and WebSite schemas are valid

### 4. Search Engine Optimization
- Use [Google PageSpeed Insights](https://pagespeed.web.dev/)
- Check [Google Search Console](https://search.google.com/search-console) after deployment
- Verify sitemap.xml is accessible at `/sitemap.xml`
- Verify robots.txt is accessible at `/robots.txt`

## Lighthouse SEO Score

The implementation targets a Lighthouse SEO score of 95+. Key factors:
- ✅ Document has a meta description
- ✅ Document has a title element
- ✅ Links have descriptive text
- ✅ Image elements have alt attributes
- ✅ Document has a valid hreflang
- ✅ Document avoids plugins
- ✅ Document is mobile friendly

## Future Enhancements

1. **Dynamic Sitemap**: Generate sitemap.xml dynamically based on projects
2. **Article Schema**: Add structured data for individual projects
3. **Breadcrumbs**: Implement breadcrumb navigation with structured data
4. **FAQ Schema**: Add FAQ structured data if applicable
5. **Local Business**: Add LocalBusiness schema if relevant

## Troubleshooting

### Meta Tags Not Updating
- Check browser console for API errors
- Verify `/api/meta` endpoint is working
- Check that `MetaService` is properly injected

### Social Media Previews Not Working
- Verify image URLs are absolute and accessible
- Check image dimensions meet platform requirements
- Clear social media cache using platform debugging tools

### Structured Data Errors
- Validate JSON-LD syntax using online validators
- Ensure all required properties are present
- Check that URLs are absolute and valid