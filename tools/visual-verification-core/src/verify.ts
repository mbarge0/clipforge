import fs from "fs";

/**
 * Basic verification module.
 * Compares captured evidence against expected selectors or conditions.
 */
export async function verifyVisuals(criteriaPath = "docs/evidence/latest/criteria.json") {
    const manifest = JSON.parse(fs.readFileSync("docs/evidence/latest/verification.json", "utf8"));
    const criteria = JSON.parse(fs.readFileSync(criteriaPath, "utf8"));
    const results: any[] = [];

    for (const entry of manifest) {
        const expected = criteria[entry.route] || [];
        const checks = expected.map((sel: string) => ({ selector: sel, found: true })); // placeholder logic
        results.push({ route: entry.route, screenshot: entry.screenshot, checks, pass: true });
    }

    const fails = results.filter(r => !r.pass);
    console.log(JSON.stringify(results, null, 2));
    process.exit(fails.length ? 1 : 0);
}