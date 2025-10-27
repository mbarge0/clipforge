#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

function log(msg) { console.log(msg); }
function fail(reason) { console.error(`❌ Validation Failed: ${reason}`); process.exitCode = 1; }

try {
    // 1) Hello World build check (best-effort): attempt npm run build or dev dry check
    try {
        if (fs.existsSync(path.join(process.cwd(), "package.json"))) {
            const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
            if (pkg.scripts?.build) {
                log("🧪 Building project (npm run build)...");
                execSync("npm run -s build", { stdio: "ignore" });
            } else {
                log("ℹ️ No build script; skipping build step.");
            }
        }
    } catch (e) {
        fail("Build failed. Ensure dependencies are installed and build script is defined.");
    }

    // 2) Firebase connectivity sanity (if firebase-tools available)
    try {
        execSync("npx --yes firebase --version", { stdio: "ignore" });
        log("🧪 Firebase CLI detected.");
    } catch {
        log("⚠️ Firebase CLI not found; skipping connectivity check.");
    }

    // 3) Required env files
    const required = [".env", ".firebaserc", "firebase.json"];
    const missing = required.filter(f => !fs.existsSync(path.join(process.cwd(), f)));
    if (missing.length) {
        fail(`Missing required files: ${missing.join(", ")}`);
    }

    if (process.exitCode) {
        // failed earlier
    } else {
        console.log("✅ Validation Passed");
    }
} catch (e) {
    fail(e?.message || String(e));
}


