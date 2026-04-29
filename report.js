const boxen = require('boxen').default;
const chalk = require('chalk').default;

function generate_findings(pages) {
    const findings_map = {};
    for (const [url, page] of Object.entries(pages)) {
        if (!page.interesting_params || page.interesting_params.length === 0) continue;
        const key = page.interesting_params.sort().join(',');
        if (!findings_map[key]) {
            findings_map[key] = [];
        }
        findings_map[key].push(url);
    }
    const lines = [];
    for (const [params, urls] of Object.entries(findings_map)) {
        lines.push(
            `${chalk.red('🚨')} ${chalk.yellow(params)} → ${chalk.blue(urls[0])}`
        );
    }
    return lines.length > 0
        ? lines.join('\n')
        : chalk.gray('No high-value targets detected');
}

function print_report(pages) {
    const pages_array = Object.values(pages);
    const sorted_pages = sort_pages(pages);
    const app_banner = [
        chalk.cyan("  ██████  ███▄    █▄▄▄▄▄   ██      ██████  ██▀███   ▄▄▄       █     █░ ██▓     "),
        chalk.cyan("▒██    ▒  ██ ▀█   █▓  ██▒ ▓██    ▒██    ▒ ▓██ ▒ ██▒▒████▄    ▓█░ █ ░█░▓██▒     "),
        chalk.cyan("░ ▓██▄   ▓██  ▀█ ██▒ ▓██░ ▒██    ░ ▓██▄   ▓██ ░▄█ ▒▒██  ▀█▄  ▒█░ █ ░█ ▒██░     "),
        chalk.cyan("  ▒   ██▒▓██▒  ▐▌██▒ ▓██  ░██    ▒   ██▒ ▒██▀▀█▄  ░██▄▄▄▄██ ░█░ █ ░█ ▒██░     "),
        chalk.cyan("▒██████▒▒▒██░   ▓██░ ▒██▄ ░██████▒██████▒▒░██▓ ▒██▒ ▓█   ▓██▒░░█████▓ ░██████▒"),
        chalk.cyan("▒ ▒▓▒ ▒ ░░ ▒░   ▒ ▒  ▒ ▓▒ ░ ▒░▓  ▒ ▒▓▒ ▒ ░░ ▒▓ ░▒▓░ ▒▒   ▓▒█░░ ▓ ▒ ▒  ░ ▒░▓  ░"),
        chalk.cyan("░ ░▒  ░ ░░ ░░   ░ ▒░ ░ ▒▒ ░ ░ ▒  ░ ░▒  ░ ░  ░▒ ░ ▒░  ▒   ▒▒ ░  ▒ ░ ░  ░ ░ ▒  ░"),
        chalk.cyan("░  ░  ░     ░   ░ ░  ░ ░    ░ ░    ░  ░      ░░   ░   ░   ▒     ░   ░    ░ ░   "),
        chalk.cyan("      ░           ░    ░      ░  ░       ░    ░           ░  ░    ░        ░  ░")
    ].join('\n');

    const findings = generate_findings(pages);
    const findings_box = boxen(findings, {
        title: chalk.bold.red(' 🔥 FINDINGS '),
        padding: 1,
        borderStyle: 'round',
        borderColor: 'red'
    });
    const report_content = sorted_pages.map(([url, page]) => {
        const heading_stats = Object.entries(page.headings || {})
            .map(([k, v]) => `${chalk.yellow(k)}: ${chalk.white(v)}`)
            .join(', ');
        const params = page.params || {};
        const param_keys = Object.keys(params);
        const param_line = param_keys.length > 0
            ? `${chalk.bold.green('➜ Params:')}  ${chalk.yellow(param_keys.join(', '))}`
            : null;
        const interesting = page.interesting_params || [];
        const interesting_line = interesting.length > 0
            ? `${chalk.bold.red('🔥 Interesting:')} ${interesting.join(', ')}`
            : null;
        const is_interesting = interesting.length > 0;
        const url_line = is_interesting
            ? `${chalk.bold.red('➜ URL:')}    ${chalk.redBright(url)}`
            : `${chalk.bold.green('➜ URL:')}    ${chalk.blueBright(url)}`;
        return [
            url_line,
            `${chalk.bold.green('➜ Title:')}  ${chalk.white((page.title || 'N/A').trim().replace(/\s+/g, ' '))}`,
            `${chalk.bold.green('➜ Links:')}  ${chalk.magenta(page.links || 0)}`,
            `${chalk.bold.green('➜ Images:')} ${chalk.magenta(page.images || 0)}`,
            `${chalk.bold.green('➜ Headers:')} ${heading_stats || chalk.gray('none')}`,
            param_line,
            interesting_line
        ].filter(Boolean).join('\n');

    }).join('\n\n' + chalk.gray('─'.repeat(55)) + '\n\n');
    const header_box = boxen(
        `${app_banner}\n\n${chalk.yellow.bold('⚡ Security Scraper & Web Crawler ⚡')}`,
        {
            title: chalk.bold.cyan(' SPIDCRAWL V1.0 '),
            titleAlignment: 'center',
            textAlignment: 'center',
            padding: 1,
            margin: { top: 1, bottom: 1 },
            borderStyle: 'double',
            borderColor: 'cyan'
        }
    );
    const stats_box = boxen(
        `${chalk.bold.green('✔ Total Pages Crawled:')} ${chalk.yellow.bold(pages_array.length)}\n` +
        `${chalk.bold.green('🕒 Report Generated:')}   ${chalk.white(new Date().toLocaleString())}`,
        {
            padding: 1,
            borderStyle: 'round',
            borderColor: 'green'
        }
    );
    const pages_box = boxen(
        report_content || chalk.red('No pages crawled'),
        {
            padding: 1,
            borderStyle: 'single',
            borderColor: 'blue'
        }
    );
    console.log(findings_box + '\n');
    console.log(header_box);
    console.log(stats_box + '\n');
    console.log(chalk.bold.cyan('📋 PAGE DETAILS:\n'));
    console.log(pages_box + '\n');
    console.log(chalk.bold.yellow('=================== END OF AUDIT ===================\n'));
}

function sort_pages(pages) {
    const pages_arr = Object.entries(pages);
    pages_arr.sort((a, b) => {
        const a_hits = a[1].links || 0;
        const b_hits = b[1].links || 0;
        return b_hits - a_hits;
    });
    return pages_arr;
}

module.exports = {
    sort_pages,
    print_report
};