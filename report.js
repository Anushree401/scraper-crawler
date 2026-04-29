function print_report(pages) {
    const pagesArray = Object.values(pages);
    console.log("\n========== CRAWL REPORT (JSON) ==========\n");
    console.log(JSON.stringify(pagesArray, null, 2));
    console.log("\n========== END REPORT ==========\n");
    console.log(`Total pages crawled: ${pagesArray.length}`);
}

function sort_pages(pages) {
    const pages_arr = Object.entries(pages);
    pages_arr.sort((a,b) => {
        // const a_hits = a[1];
        // const b_hits = a[1];
        return b[1] - a[1];
    });
    return pages_arr;
}

module.exports = {
    sort_pages,
    print_report
};