const cheerio = require("cheerio");
const { scrape_page } = require("./scraper");

/**
 * How functions communicate:
 * crawl_page() calls get_urls_from_html() to extract links from HTML.
 * crawl_page() also uses normalized_url() to avoid duplicate visits.
 * All functions share data by passing URLs and the pages object.
 */

/**
 * Crawl pages on the same site.
 * Input: base_url, current_url, pages object.
 * Output: updated pages object.
 * How: Recursively visits and tracks HTML pages on the same domain.
 */
async function crawl_page(base_url, current_url, pages) {
    const base_url_obj = new URL(base_url);
    const current_url_obj = new URL(current_url);
    if (base_url_obj.hostname !== current_url_obj.hostname) {
        return pages;
    }
    const normalized_current_url = normalized_url(current_url);
    if (pages[normalized_current_url]) {
        return pages;
    }
    pages[normalized_current_url] = 1;
    console.log(`actively crawling: ${current_url}`);
    
    // Scrape the page and get details
    const pageDetails = await scrape_page(current_url);
    pages[normalized_current_url] = pageDetails;
    console.log(`actively crawling: ${current_url}`);
    console.log(`  → ${JSON.stringify(pageDetails)}`);
    
    try {
        const resp = await fetch(current_url);
        if (resp.status > 399) {
            console.log(`error fetching source: ${resp.status} on page: ${current_url}`);
            return pages;
        }
        const content_type = resp.headers.get("content-type");
        if (!content_type.includes("text/html")) {
            console.log(`non html respose, content type: ${content_type} on page: ${current_url}`);
            return pages;
        }
        const html_body = await resp.text();
        const next_urls = get_urls_from_html(html_body, base_url);
        for (const next_url of next_urls) {
            pages = await crawl_page(base_url, next_url, pages);
        }
    } catch (err) {
        console.log(`error fetching from: ${current_url} ${err.message}`);
    }
    return pages;
}

/**
 * Get all URLs from HTML.
 * Input: html string, base_url.
 * Output: array of URLs.
 * How: Finds <a> links and returns their URLs.
 */
function get_urls_from_html(html_body, base_url) {
    const urls = [];
    const $ = cheerio.load(html_body);
    $('a').each((i, link) => {
        const href = $(link).attr('href');
        if (!href) return;
        
        try {
            if (href.slice(0,1) === '/') {
                // relative URL
                const url_obj = new URL(`${base_url}${href}`);
                urls.push(url_obj.href);
            } else {
                // absolute URL
                const url_obj = new URL(href);
                urls.push(url_obj.href);
            }
        } catch (err) {
            console.log(`error with url: ${err.message}`);
        }
    });
    return urls;
}

/**
 * Normalize a URL string.
 * Input: url string.
 * Output: cleaned url string.
 * How: Removes trailing slash, lowercases host/path.
 */
function normalized_url(url_string) {
    const url_obj = new URL(url_string);
    const host_path = `${url_obj.hostname}${url_obj.pathname}`;
    if (host_path.length > 0 && host_path.slice(-1) === '/') {
        return host_path.slice(0,-1);
    }
    return host_path;
}

module.exports = {
    normalized_url,
    get_urls_from_html,
    crawl_page
};