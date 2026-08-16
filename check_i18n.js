const fs = require("fs");
const path = require("path");

const root = __dirname;
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8").replace(/\r\n/g, "\n");
const htmlSource = fs.readFileSync(path.join(root, "index.html"), "utf8").replace(/\r\n/g, "\n");

function extractLocaleBlock(locale, nextMarker) {
  const startMarker = `  ${locale}: {`;
  const start = appSource.indexOf(startMarker);
  const end = appSource.indexOf(nextMarker, start + startMarker.length);
  if (start === -1 || end === -1) {
    throw new Error(`Unable to locate the ${locale} translation block.`);
  }
  return appSource.slice(start + startMarker.length, end);
}

function extractKeys(block) {
  const keys = [];
  for (const match of block.matchAll(/"([^"]+)"\s*:/g)) keys.push(match[1]);
  return keys;
}

function findDuplicates(keys) {
  const seen = new Set();
  const duplicates = new Set();
  keys.forEach(key => (seen.has(key) ? duplicates.add(key) : seen.add(key)));
  return [...duplicates].sort();
}

function difference(left, right) {
  const rightSet = new Set(right);
  return [...new Set(left)].filter(key => !rightSet.has(key)).sort();
}

const enKeys = extractKeys(extractLocaleBlock("en", "\n  },\n  ko:"));
const koKeys = extractKeys(extractLocaleBlock("ko", "\n  }\n};"));
const knownKeys = new Set(enKeys);

const htmlRefs = [...htmlSource.matchAll(/data-i18n(?:-ph|-aria)?="([^"]+)"/g)]
  .map(match => match[1]);
const jsRefs = [...appSource.matchAll(/\bt\("([^"]+)"\)/g)]
  .map(match => match[1]);

const checks = [
  ["Only in EN", difference(enKeys, koKeys)],
  ["Only in KO", difference(koKeys, enKeys)],
  ["Duplicate EN keys", findDuplicates(enKeys)],
  ["Duplicate KO keys", findDuplicates(koKeys)],
  ["Unknown HTML references", [...new Set(htmlRefs)].filter(key => !knownKeys.has(key)).sort()],
  ["Unknown static t() references", [...new Set(jsRefs)].filter(key => !knownKeys.has(key)).sort()]
];

let failed = false;
for (const [label, values] of checks) {
  if (!values.length) continue;
  failed = true;
  console.error(`${label}: ${values.join(", ")}`);
}

if (failed) process.exitCode = 1;
else console.log(`i18n check passed: ${enKeys.length} EN keys, ${koKeys.length} KO keys, ${new Set(htmlRefs).size} HTML references.`);
