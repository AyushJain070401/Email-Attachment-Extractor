"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRawEmail = parseRawEmail;
exports.extractHtmlBody = extractHtmlBody;
exports.extractCidReferences = extractCidReferences;
exports.normalizeAttachment = normalizeAttachment;
exports.getRawAttachments = getRawAttachments;
const mailparser_1 = require("mailparser");
/**
 * Parses a raw RFC822 email string or Buffer using mailparser.
 *
 * @param rawEmail - The raw email content in RFC822 format
 * @returns The parsed mail object from mailparser
 * @throws {Error} If the email cannot be parsed
 */
async function parseRawEmail(rawEmail) {
    try {
        const parsed = await (0, mailparser_1.simpleParser)(rawEmail, {
            skipHtmlToText: false,
            skipTextToHtml: false,
            skipImageLinks: true, // Keep cid: references in HTML so extractCidReferences can find them
        });
        return parsed;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown parse error";
        throw new Error(`Failed to parse email: ${message}`);
    }
}
/**
 * Extracts the HTML body content from a parsed mail object.
 *
 * @param parsed - The parsed mail object
 * @returns The HTML body string, or empty string if not present
 */
function extractHtmlBody(parsed) {
    return parsed.html || "";
}
/**
 * Extracts all CID references found in an HTML body string.
 * CID references look like: cid:abc123@domain.com or src="cid:imageId"
 *
 * @param html - The HTML body content
 * @returns A Set of CID strings (without the "cid:" prefix)
 */
function extractCidReferences(html) {
    const cids = new Set();
    if (!html)
        return cids;
    // Match cid: references in src, href, or background attributes
    const cidPattern = /cid:([^\s"'>)]+)/gi;
    let match;
    while ((match = cidPattern.exec(html)) !== null) {
        // Normalize: strip angle brackets if present
        const cid = match[1].replace(/[<>]/g, "").trim();
        if (cid) {
            cids.add(cid);
        }
    }
    return cids;
}
/**
 * Converts a mailparser Attachment object into our internal RawAttachment format.
 *
 * @param attachment - The mailparser attachment object
 * @returns A normalized RawAttachment object
 */
function normalizeAttachment(attachment) {
    const content = attachment.content;
    const size = attachment.size ?? (Buffer.isBuffer(content) ? content.length : 0);
    // Normalize CID: strip surrounding angle brackets if present
    let cid = attachment.cid;
    if (cid) {
        cid = cid.replace(/^<|>$/g, "").trim();
    }
    return {
        filename: attachment.filename,
        contentType: (attachment.contentType || "application/octet-stream")
            .toLowerCase()
            .trim(),
        size,
        content: Buffer.isBuffer(content) ? content : Buffer.from(content),
        cid: cid || undefined,
        contentDisposition: attachment.contentDisposition ?? undefined,
        headers: attachment.headers ?? new Map(),
    };
}
/**
 * Retrieves all raw attachments from a parsed mail object.
 *
 * @param parsed - The parsed mail object
 * @returns Array of normalized raw attachments
 */
function getRawAttachments(parsed) {
    if (!parsed.attachments || parsed.attachments.length === 0) {
        return [];
    }
    return parsed.attachments.map(normalizeAttachment);
}
//# sourceMappingURL=parser.js.map