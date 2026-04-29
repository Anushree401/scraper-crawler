const { crawl_page } = require('./crawler');
const { print_report } = require('./report');

async function main() {
    if (process.argv.length < 3) {
        console.log("no website provided");
        process.exit(1);
    }
    if (process.argv.length > 3) {
        console.log("too many arguments");
        process.exit(1);
    }
    const base_url = process.argv[2];
    console.log(`starting crawl of: ${base_url}`);
    const pages = await crawl_page(base_url, base_url, {});
    print_report(pages);
}

main();