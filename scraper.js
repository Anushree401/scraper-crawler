const cheerio = require("cheerio");
const boxen = require("boxen").default;
const chalk = require("chalk").default;

/**
 * Scrape a URL and return details about the page.
 * Input: url string
 * Output: object with page details (title, links, images, etc.)
 */
async function scrape_page(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        return {
            url: url,
            title: ($('title').text() || 'No title').trim().replace(/\s+/g, ' '),
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

if (require.main === module) {
    (async () => {
        if (process.argv.length < 3) {
            console.log(chalk.red.bold("✖ No URL provided!"));
            process.exit(1);
        }
        const target_url = process.argv[2];
        const result = await scrape_page(target_url);        
        const app_banner = [
            "  ██████  ███▄    █▄▄▄▄▄   ██      ██████  ██▀███   ▄▄▄       █     █░ ██▓     ",
            "▒██    ▒  ██ ▀█   █▓  ██▒ ▓██    ▒██    ▒ ▓██ ▒ ██▒▒████▄    ▓█░ █ ░█░▓██▒     ",
            "░ ▓██▄   ▓██  ▀█ ██▒ ▓██░ ▒██    ░ ▓██▄   ▓██ ░▄█ ▒▒██  ▀█▄  ▒█░ █ ░█ ▒██░     ",
            "  ▒   ██▒▓██▒  ▐▌██▒ ▓██  ░██    ▒   ██▒ ▒██▀▀█▄  ░██▄▄▄▄██ ░█░ █ ░█ ▒██░     ",
            "▒██████▒▒▒██░   ▓██░ ▒██▄ ░██████▒██████▒▒░██▓ ▒██▒ ▓█   ▓██▒░░█████▓ ░██████▒"
        ].map(line => chalk.cyan(line)).join('\n');

        const heading_stats = Object.entries(result.headings || {})
            .map(([k, v]) => `${chalk.yellow(k)}: ${chalk.white(v)}`)
            .join(', ');
        const report_content = [
            `${chalk.bold.green('➜ URL:')}    ${chalk.blueBright(result.url)}`,
            `${chalk.bold.green('➜ Title:')}  ${chalk.white(result.title)}`,
            `${chalk.bold.green('➜ Links:')}  ${chalk.magenta(result.links || 0)}`,
            `${chalk.bold.green('➜ Images:')} ${chalk.magenta(result.images || 0)}`,
            `${chalk.bold.green('➜ Headers:')} ${heading_stats || chalk.gray('none')}`
        ].join('\n');
        const header_box = boxen(`${app_banner}\n\n${chalk.yellow.bold('⚡ Security Scraper & Web Crawler ⚡')}`, {
            title: chalk.bold.cyan(' SPIDCRAWL V1.0 '),
            titleAlignment: 'center',
            textAlignment: 'center',
            padding: 1,
            borderStyle: 'double',
            borderColor: 'cyan'
        });
        const pages_box = boxen(report_content, {
            padding: 1,
            borderStyle: 'single',
            borderColor: 'blue'
        });
        console.log('\n' + header_box);
        console.log(chalk.bold.cyan('📋 SCRAPER RESULT:\n'));
        console.log(pages_box + '\n');
        console.log(chalk.bold.yellow('=================== END OF AUDIT ===================\n'));
    })();
}
