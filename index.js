const { crawl_page } = require('./crawler');
const { print_report } = require('./report');
const chalk = require('chalk').default;
const cli_progress = require('cli-progress');

async function main() {
    if (process.argv.length < 3) {
        console.log(chalk.red.bold("✖ No website provided"));
        process.exit(1);
    }
    const base_url = process.argv[2];
    console.log(chalk.cyan.bold(`\n🕷️ Initializing crawl on: ${base_url}\n`));    
    const loader_bar = new cli_progress.SingleBar({
        format: `${chalk.bold.green('CRAWLING')} |${chalk.cyan('{bar}')}| {percentage}% | {value}/{total} Active Steps`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
        clearOnComplete: true
    }, cli_progress.Presets.shades_classic);
    loader_bar.start(100, 0);    
    let progress_val = 0;
    const interval = setInterval(() => {
        if (progress_val < 90) {
            progress_val += Math.floor(Math.random() * 5) + 1;
            loader_bar.update(progress_val);
        }
    }, 300);
    const pages = await crawl_page(base_url, base_url, {});    
    clearInterval(interval);
    loader_bar.update(100);
    loader_bar.stop();     
    process.stdout.write('\x1b[2J\x1b[0;0H');

    print_report(pages);
}

main();
