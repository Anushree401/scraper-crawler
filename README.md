# Web Scraper & Crawler

A Node.js web crawler that crawls a website and generates detailed reports for each page.

## What I Made

A web crawler that:
- Takes a website URL as input
- Crawls all pages on that website
- Scrapes each page to extract details (title, links, images, headings)
- Reports what was found on each page

## File Overview

| File | Description |
|------|-------------|
| `index.js` | Main entry point. Takes a URL from command line, runs the crawler, and prints the report. |
| `crawler.js` | Core crawling logic. Fetches pages, extracts links using cheerio, and recursively crawls found links. Also calls scraper for each page. |
| `scraper.js` | Scrapes a single page and returns details (title, links, images, headings). Exports `scrape_page()` function. |
| `report.js` | Formats and prints the final report. Sorts pages by link count. |

## Tech Stack

- **Language:** JavaScript (Node.js)
- **HTML Parser:** cheerio
- **HTTP Client:** native fetch API

## How to Run

```bash
# Run the crawler on a website (crawls all pages + generates report)
node index.js https://example.com

# Run just the scraper on a single URL
node scraper.js https://example.com
```

## Example Output

### Crawler (index.js)
```
starting crawl of: https://example.com
actively crawling: https://example.com
  → {"url":"https://example.com","title":"Example Domain","links":5,"images":1,"headings":{"h1":1,"h2":0,"h3":0}}

========== CRAWL REPORT (JSON) ==========

[
  {
    "url": "https://example.com",
    "title": "Example Domain",
    "links": 5,
    "images": 1,
    "headings": {
      "h1": 1,
      "h2": 0,
      "h3": 0
    }
  }
]

========== END REPORT ==========

Total pages crawled: 1
```

### Scraper (scraper.js)
```
========== SCRAPER RESULT ==========

URL: https://example.com
Title: Example Domain
Links: 5
Images: 1
H1: 1, H2: 0, H3: 0

========== END RESULT ==========
```

---

## Sample links

1. https://wagslane.dev/  
2. https://quotes.toscrape.com/
3. https://www.scrapethissite.com/pages/
4. https://web-scraping.dev/   

---

## Resources referred to

1. [Intro to Web Scrapers](https://medium.com/@joerosborne/intro-to-web-scraping-build-your-first-scraper-in-5-minutes-1c36b5c4b110)
2. [Web Crawlers](https://kitrakiar73.medium.com/web-crawlers-how-to-build-one-89bf65716518) 