import { readFile } from "node:fs/promises";

const raw = await readFile(new URL("../data/conferences.json", import.meta.url), "utf8");
const payload = JSON.parse(raw);
const allowedAreas = new Set(["Robotics", "AI", "ML", "Vision"]);
const allowedCcf = new Set(["A", "B", "C", null]);
const allowedStatuses = new Set(["confirmed", "estimated"]);
const required = [
  "acronym",
  "edition",
  "name",
  "area",
  "deadlineType",
  "deadline",
  "status",
  "sortDate",
  "source",
];
const seen = new Set();
const errors = [];

for (const [index, conference] of payload.conferences.entries()) {
  const label = `${conference.acronym ?? "unknown"} ${conference.edition ?? ""}`.trim();
  const missing = required.filter((field) => !conference[field]);
  if (missing.length) errors.push(`${label}: missing ${missing.join(", ")}`);
  if (!allowedAreas.has(conference.area)) errors.push(`${label}: invalid area`);
  if (!allowedCcf.has(conference.ccf)) errors.push(`${label}: invalid CCF rating`);
  if (!allowedStatuses.has(conference.status)) errors.push(`${label}: invalid status`);
  if (!/^https:\/\//.test(conference.source || "")) errors.push(`${label}: source must use HTTPS`);
  if (conference.deadline && Number.isNaN(Date.parse(conference.deadline))) {
    errors.push(`${label}: invalid deadline`);
  }
  if (seen.has(label)) errors.push(`${label}: duplicate entry at index ${index}`);
  seen.add(label);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${payload.conferences.length} conference records.`);
