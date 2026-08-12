#!/usr/bin/env node
/**
 * Blocks Netlify production deploys until legal identity fields are complete.
 *
 * - Production (CONTEXT=production): always requires complete identity.
 * - Other Netlify contexts: allowed only with WEC_ALLOW_INCOMPLETE_LEGAL=1
 *   (set for deploy-preview / branch-deploy in netlify.toml).
 * - Local builds: warn only unless WEC_REQUIRE_LEGAL=1.
 *
 * Fields live in src/config/legalIdentity.ts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const legalPath = join(__dirname, "..", "src", "config", "legalIdentity.ts");
const source = readFileSync(legalPath, "utf8");

function fieldValue(name) {
  const re = new RegExp(`${name}:\\s*("([^"]*)"|null|true|false)`, "m");
  const m = source.match(re);
  if (!m) return undefined;
  if (m[1] === "null") return null;
  if (m[1] === "true") return true;
  if (m[1] === "false") return false;
  return m[2];
}

const identity = {
  controllerName: fieldValue("controllerName") ?? "",
  registrationNumber: fieldValue("registrationNumber") ?? "",
  registrationApplicable: fieldValue("registrationApplicable") ?? null,
  countryOfEstablishment: fieldValue("countryOfEstablishment") ?? "",
  businessAddress: fieldValue("businessAddress") ?? "",
  privacyEmail: fieldValue("privacyEmail") ?? "",
};

const missing = [];
if (!String(identity.controllerName).trim()) missing.push("controllerName");
if (identity.registrationApplicable === null) {
  missing.push("registrationApplicable");
} else if (
  identity.registrationApplicable === true &&
  !String(identity.registrationNumber).trim()
) {
  missing.push("registrationNumber");
}
if (!String(identity.countryOfEstablishment).trim()) {
  missing.push("countryOfEstablishment");
}
if (!String(identity.businessAddress).trim()) missing.push("businessAddress");
if (!String(identity.privacyEmail).trim()) missing.push("privacyEmail");

if (missing.length === 0) {
  console.log("Legal identity complete — production publish allowed.");
  process.exit(0);
}

console.error("Legal identity incomplete. Missing / unset fields:");
for (const f of missing) console.error(`  - ${f}`);
console.error("\nFill src/config/legalIdentity.ts — see docs/LEGAL_IDENTITY.md");
console.error("Do not invent an address or publish TODO placeholders.");

const allowIncomplete =
  process.env.WEC_ALLOW_INCOMPLETE_LEGAL === "1" ||
  process.env.WEC_ALLOW_INCOMPLETE_LEGAL === "true";
const requireLegal =
  process.env.WEC_REQUIRE_LEGAL === "1" ||
  process.env.WEC_REQUIRE_LEGAL === "true";
const isNetlify = process.env.NETLIFY === "true";
const isProduction = process.env.CONTEXT === "production";

if (isProduction || requireLegal) {
  console.error("\nBlocking production deploy until legal controller details are supplied.");
  process.exit(1);
}

if (isNetlify && !allowIncomplete) {
  console.error(
    "\nBlocking Netlify deploy. Set WEC_ALLOW_INCOMPLETE_LEGAL=1 for preview only, or complete legalIdentity.",
  );
  process.exit(1);
}

console.warn(
  "\nContinuing with incomplete legal identity (preview/local). Production will fail.",
);
process.exit(0);
