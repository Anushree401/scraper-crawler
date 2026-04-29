const cheerio = require("cheerio");

/**
 * Scrape a URL and return details about the page.
 * Input: url string
 * Output: object with page details (title, links, images, etc.)
 * How: Fetches page, parses with cheerio, extracts info
 */
async function scrape_page(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        return {
            url: url,
            title: $('title').text() || 'No title',
            links: $('a').length,
            images: $('img').length,
            headings: {
                h1: $('h1').length,
                h2: $('h2').length,
                h3: $('h3').length
            }
        };
    } catch (err) {
        return { url: url, error: err.message };
    }
}

module.exports = { scrape_page };

// CLI for testing
if (require.main === module) {
    (async () => {
        if (process.argv.length < 3) {
            console.log("no url provided");
            process.exit(1);
        }
        const url = process.argv[2];
        const result = await scrape_page(url);
        console.log("\n========== SCRAPER RESULT ==========\n");
        console.log(`URL: ${result.url}`);
        console.log(`Title: ${result.title}`);
        console.log(`Links: ${result.links}`);
        console.log(`Images: ${result.images}`);
        console.log(`H1: ${result.headings.h1}, H2: ${result.headings.h2}, H3: ${result.headings.h3}`);
        console.log("\n========== END RESULT ==========\n");
    })();
}