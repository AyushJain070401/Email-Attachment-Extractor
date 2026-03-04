# email-attachment-extractor

[![npm version](https://img.shields.io/npm/v/email-attachment-extractor.svg)](https://www.npmjs.com/package/email-attachment-extractor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)

> Extract **only real attachments** from raw RFC822 emails — intelligently filtering out signature images, inline images, tracking pixels, and social media logos.

---

## The Problem

Most email parsing libraries return *everything* as an attachment — including:

- 📌 Signature icons (logo.png, facebook.png, linkedin.png)
- 🖼️ Inline images embedded via `cid:` references
- 🔍 Tracking pixels (1×1 transparent GIFs)
- 🎨 Email template decorations (dividers, arrows, banners)

This makes it impossible to reliably extract *real* attachments like invoices, reports, and spreadsheets.

`email-attachment-extractor` solves this with a configurable, multi-stage filter pipeline.

---

## Features

- ✅ **CID detection** — skips images embedded via `Content-ID`
- ✅ **HTML body scanning** — finds `cid:` references in HTML and excludes matching images
- ✅ **Inline filtering** — skips `Content-Disposition: inline` parts
- ✅ **Signature patterns** — built-in list of 30+ common logo/signature filenames
- ✅ **Size threshold** — ignores images smaller than a configurable limit (default 5 KB)
- ✅ **Always-include types** — PDFs, ZIPs, Office docs always pass regardless of other rules
- ✅ **Debug mode** — `extractAttachmentsWithLog()` explains every filter decision
- ✅ **TypeScript** — full types and JSDoc
- ✅ **Zero config** — works out of the box with sensible defaults

---

## Installation

```bash
npm install email-attachment-extractor
```

---

## Quick Start

```typescript
import { extractAttachments } from "email-attachment-extractor";
import fs from "fs/promises";

const rawEmail = await fs.readFile("email.eml");
const attachments = await extractAttachments(rawEmail);

attachments.forEach((att) => {
  console.log(`${att.filename} — ${att.contentType} — ${att.size} bytes`);
  // att.content is a Buffer ready to save or process
});
```

---

## API Reference

### `extractAttachments(rawEmail, options?)`

The primary function. Parses a raw RFC822 email and returns only genuine attachments.

```typescript
import { extractAttachments } from "email-attachment-extractor";

const attachments = await extractAttachments(rawEmail, {
  minImageSize: 5000,
  ignoreInline: true,
  ignoreCidImages: true,
  ignoreSignaturePatterns: true,
  ignoreCidReferencedInHtml: true,
});
```

**Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `rawEmail` | `string \| Buffer` | Raw email in RFC822 format |
| `options` | `ExtractOptions` | Optional configuration (see below) |

**Returns:** `Promise<ExtractedAttachment[]>`

---

### `extractAttachmentsWithLog(rawEmail, options?)`

Same as `extractAttachments`, but also returns a filter log explaining every decision. Perfect for debugging.

```typescript
const { attachments, filterLog } = await extractAttachmentsWithLog(rawEmail);

filterLog.forEach((entry) => {
  const status = entry.kept ? "✅ KEPT" : "❌ DROPPED";
  console.log(`${status} ${entry.filename}: ${entry.reason}`);
});
```

**Returns:** `Promise<{ attachments: ExtractedAttachment[], filterLog: FilterLogEntry[] }>`

---

## Output Format

```typescript
interface ExtractedAttachment {
  filename: string;           // e.g. "invoice.pdf"
  contentType: string;        // e.g. "application/pdf"
  size: number;               // size in bytes
  content: Buffer;            // raw file content
  contentDisposition?: string; // e.g. "attachment"
}
```

### Example Output

```json
[
  {
    "filename": "invoice.pdf",
    "contentType": "application/pdf",
    "size": 48291,
    "content": "<Buffer 25 50 44 46 ...>"
  },
  {
    "filename": "data-export.xlsx",
    "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "size": 102400,
    "content": "<Buffer 50 4b 03 04 ...>"
  }
]
```

---

## Configuration Options

```typescript
interface ExtractOptions {
  /**
   * Minimum image size in bytes. Images smaller than this are discarded.
   * Catches tracking pixels and tiny decorative icons.
   * @default 5000 (5 KB)
   */
  minImageSize?: number;

  /**
   * Drop attachments with Content-Disposition: inline.
   * @default true
   */
  ignoreInline?: boolean;

  /**
   * Drop attachments with a Content-ID header.
   * @default true
   */
  ignoreCidImages?: boolean;

  /**
   * Drop images referenced in the HTML body via cid: URIs.
   * @default true
   */
  ignoreCidReferencedInHtml?: boolean;

  /**
   * Drop images matching built-in signature/logo filename patterns.
   * @default true
   */
  ignoreSignaturePatterns?: boolean;

  /**
   * Your own additional filename patterns to ignore.
   * Accepts strings (exact match) or RegExp.
   * @default []
   */
  customIgnorePatterns?: Array<string | RegExp>;

  /**
   * Content types that always pass all filters.
   * Useful to guarantee PDFs, ZIPs, etc. are never dropped.
   * @default ["application/pdf", "application/zip", ...]
   */
  alwaysIncludeContentTypes?: string[];
}
```

---

## Filtering Logic

The filter pipeline runs in this priority order for each attachment:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FILTER PIPELINE (per attachment)                     │
├─────┬───────────────────────────────────────────────────────────────────┤
│  1  │ Always-include content type? → KEEP (bypass all other rules)      │
│  2  │ Has no filename? → DROP                                            │
│  3  │ CID referenced in HTML body? → DROP  (if ignoreCidReferencedInHtml)│
│  4  │ Has Content-ID (cid)? → DROP  (if ignoreCidImages=true)           │
│  5  │ Content-Disposition = inline? → DROP  (if ignoreInline=true)      │
│─────┼──── Image-only checks ──────────────────────────────────────────  │
│  6  │ Filename matches signature pattern? → DROP  (if ignoreSignature)  │
│  7  │ Image size < minImageSize? → DROP                                  │
│─────┼───────────────────────────────────────────────────────────────────│
│  ✅  │ Passes all checks → KEEP                                          │
└─────┴───────────────────────────────────────────────────────────────────┘
```

> **Note:** Steps 3–4 both deal with Content-ID. Step 3 is the more specific check (only drops images actually embedded in the HTML via `cid:` references). Step 4 is the broader catch-all (drops all CID attachments). When both are enabled (the default), all CID images are dropped. Set `ignoreCidImages: false` while keeping `ignoreCidReferencedInHtml: true` if you want to keep CID attachments that are *not* referenced in the HTML body.

---

## Built-in Signature Patterns

The following filename patterns are filtered by default when `ignoreSignaturePatterns: true`:

**Generic names:** `logo`, `signature`, `avatar`, `icon`, `banner`, `spacer`, `divider`, `separator`

**Social media:** `facebook`, `twitter`, `linkedin`, `instagram`, `youtube`, `pinterest`, `tiktok`, `snapchat`, `whatsapp`, `telegram`

**Outlook patterns:** `image001.png`, `image0023.jpg`, `Outlook-abc123.png`

**Contact icons:** `mail`, `email`, `phone`, `website`, `arrow`

**Tracking:** `pixel`, `track`, `beacon`

You can add your own patterns via `customIgnorePatterns`:

```typescript
const attachments = await extractAttachments(rawEmail, {
  customIgnorePatterns: [
    /^acme[-_]logo/i,     // RegExp
    "mybrand.png",         // Exact filename match
  ],
});
```

---

## Always-Include Content Types

These types **always pass**, regardless of inline disposition, CID, size, or filename:

```
application/pdf
application/zip
application/msword
application/vnd.openxmlformats-officedocument.wordprocessingml.document
application/vnd.ms-excel
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
application/vnd.ms-powerpoint
application/vnd.openxmlformats-officedocument.presentationml.presentation
text/csv
text/plain
application/json
application/xml
application/rtf
application/x-7z-compressed
application/x-rar-compressed
... and more
```

Override by providing your own list:

```typescript
const attachments = await extractAttachments(rawEmail, {
  alwaysIncludeContentTypes: ["application/pdf"], // Only guarantee PDFs
});
```

---

## Utility Functions

Individual utilities are exported for advanced use cases:

```typescript
import {
  isSignatureFilename,
  isCidReferencedInHtml,
  extractCidReferences,
  isImageType,
  isAlwaysIncludedType,
} from "email-attachment-extractor";

// Check if a filename looks like a signature asset
isSignatureFilename("facebook.png");       // true
isSignatureFilename("invoice.pdf");        // false

// Check if an HTML body references a cid
const html = `<img src="cid:img@domain.com" />`;
const refs = extractCidReferences(html);  // Set { "img@domain.com" }
isCidReferencedInHtml("img@domain.com", refs);  // true

// Check MIME type
isImageType("image/png");       // true
isImageType("application/pdf"); // false
```

---

## Saving Attachments to Disk

```typescript
import { extractAttachments } from "email-attachment-extractor";
import fs from "fs/promises";
import path from "path";

const rawEmail = await fs.readFile("email.eml");
const attachments = await extractAttachments(rawEmail);

for (const att of attachments) {
  const outputPath = path.join("./downloads", att.filename);
  await fs.writeFile(outputPath, att.content);
  console.log(`Saved: ${outputPath}`);
}
```

---

## Debugging Filter Decisions

```typescript
import { extractAttachmentsWithLog } from "email-attachment-extractor";

const { attachments, filterLog } = await extractAttachmentsWithLog(rawEmail);

filterLog.forEach((entry) => {
  const icon = entry.kept ? "✅" : "❌";
  console.log(`${icon} ${entry.filename ?? "(unnamed)"}`);
  console.log(`   Reason: ${entry.reason}`);
  console.log(`   Type: ${entry.contentType}, Size: ${entry.size} bytes`);
});
```

Example debug output:

```
✅ invoice.pdf
   Reason: always-included content type
   Type: application/pdf, Size: 48291 bytes

❌ logo.png
   Reason: filename matches signature pattern: logo.png
   Type: image/png, Size: 15230 bytes

❌ image001.png
   Reason: filename matches signature pattern: image001.png
   Type: image/png, Size: 8120 bytes

❌ (unnamed)
   Reason: no filename
   Type: image/gif, Size: 43 bytes
```

---

## Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.x (optional — works with plain JS too)

---

## License

MIT © 2024

---

## Contributing

Issues and pull requests are welcome! Please run `npm test` before submitting.

---

## Author

- Ayush Jain
- GitHub: [@ayushjain070401](https://github.com/ayushjain070401)
