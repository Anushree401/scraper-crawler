const cheerio = require("cheerio");
const { scrape_page } = require("./scraper");

async function crawl_page(base_url, current_url, pages) {
    const base_url_obj = new URL(base_url);
    const current_url_obj = new URL(current_url);
    if (base_url_obj.hostname !== current_url_obj.hostname) {
        return pages;
    }
    const params = Object.fromEntries(current_url_obj.searchParams.entries());
    // if (Object.keys(params).length > 0) {
    //     console.log("🧠 Param URL Found:");
    //     console.log(`   → ${current_url}`);
    //     console.log(`   → Params: ${Object.keys(params).join(", ")}`);
    // }
    const interesting_params = [
        "id", "q", "search", "redirect", "token",
        "page", "page_num", "offset", "limit", "sort",
        "filter", "query", "file", "path"
    ];
    const detected = Object.keys(params).filter(p =>
        interesting_params.includes(p.toLowerCase())
    );
    // if (detected.length > 0) {
    //     console.log("🔥 Interesting Params:");
    //     console.log(`   → ${detected.join(", ")}`);
    // }
    const normalized_current_url = normalized_url(current_url);
    if (pages[normalized_current_url]) {
        return pages;
    }
    pages[normalized_current_url] = 1;
    const count = Object.keys(pages).length;
    process.stdout.write(
        `\r🕷️ Crawled: ${count} pages | ${current_url.slice(0, 50)}`
    );   
    const page_details = await scrape_page(current_url);
    page_details.params = params;
    page_details.interesting_params = detected;
    pages[normalized_current_url] = page_details;
    // console.log(`actively crawling: ${current_url}`);
    // console.log(`  → ${JSON.stringify(page_details)}`);
    try {
        const resp = await fetch(current_url);
        if (resp.status > 399) {
            // console.log(`error fetching source: ${resp.status} on page: ${current_url}`);
            return pages;
        }
        const content_type = resp.headers.get("content-type");
        if (!content_type.includes("text/html")) {
            // console.log(`non html respose, content type: ${content_type} on page: ${current_url}`);
            return pages;
        }
        const html_body = await resp.text();
        const next_urls = get_urls_from_html(html_body, base_url);
        for (const next_url of next_urls) {
            pages = await crawl_page(base_url, next_url, pages);
        }
    } catch (err) {
        // console.log(`error fetching from: ${current_url} ${err.message}`);
    }
    return pages;
}

function get_urls_from_html(html_body, base_url) {
    const urls = [];
    const $ = cheerio.load(html_body);
    $('a').each((i, link) => {
        const href = $(link).attr('href');
        if (!href) return;
        try {
            if (href.slice(0,1) === '/') {
                // relative URL
                const url_obj = new URL(href, base_url);
                urls.push(url_obj.href);
            } else {
                // absolute URL
                const url_obj = new URL(href);
                urls.push(url_obj.href);
            }
        } catch (err) {
            // console.log(`error with url: ${err.message}`);
        }
    });
    return urls;
}

function normalized_url(url_string) {
    const url_obj = new URL(url_string);
    const base = `${url_obj.hostname}${url_obj.pathname}`;
    const paramKeys = [...url_obj.searchParams.keys()]
        .map(k => `${k}=`)
        .join("&");
    return paramKeys ? `${base}?${paramKeys}` : base;
}

module.exports = {
    normalized_url,
    get_urls_from_html,
    crawl_page
};