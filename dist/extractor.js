"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOptions = resolveOptions;
exports.toExtractedAttachment = toExtractedAttachment;
exports.extractAttachments = extractAttachments;
exports.extractAttachmentsWithLog = extractAttachmentsWithLog;
const constants_1 = require("./constants");
const parser_1 = require("./parser");
const filters_1 = require("./filters");
/**
 * Maps a MIME content type to a file extension for fallback filenames.
 */
const MIME_EXT_MAP = {
    "application/pdf": ".pdf",
    "application/zip": ".zip",
    "application/x-zip-compressed": ".zip",
    "application/gzip": ".gz",
    "application/x-tar": ".tar",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    "application/vnd.oasis.opendocument.text": ".odt",
    "application/vnd.oasis.opendocument.spreadsheet": ".ods",
    "application/vnd.oasis.opendocument.presentation": ".odp",
    "text/csv": ".csv",
    "text/plain": ".txt",
    "application/json": ".json",
    "application/xml": ".xml",
    "application/rtf": ".rtf",
    "application/x-7z-compressed": ".7z",
    "application/x-rar-compressed": ".rar",
    "application/octet-stream": ".bin",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "image/bmp": ".bmp",
    "image/tiff": ".tiff",
};
function mimeToExtension(contentType) {
    const normalized = contentType.toLowerCase().split(";")[0].trim();
    return MIME_EXT_MAP[normalized] || "";
}
/**
 * Merges user-provided options with defaults to produce a complete
 * ResolvedOptions object.
 *
 * @param options - Partial user options
 * @returns Fully resolved options with defaults
 */
function resolveOptions(options = {}) {
    return {
        minImageSize: options.minImageSize ?? constants_1.DEFAULT_MIN_IMAGE_SIZE,
        ignoreInline: options.ignoreInline ?? true,
        ignoreCidImages: options.ignoreCidImages ?? true,
        ignoreSignaturePatterns: options.ignoreSignaturePatterns ?? true,
        customIgnorePatterns: options.customIgnorePatterns ?? [],
        ignoreCidReferencedInHtml: options.ignoreCidReferencedInHtml ?? true,
        alwaysIncludeContentTypes: options.alwaysIncludeContentTypes ?? constants_1.DEFAULT_ALWAYS_INCLUDE_CONTENT_TYPES,
    };
}
/**
 * Converts a RawAttachment that has passed all filters into an
 * ExtractedAttachment for the public API response.
 *
 * @param raw - A raw attachment that passed filtering
 * @returns A clean ExtractedAttachment object
 */
function toExtractedAttachment(raw) {
    // Provide a fallback filename when one is missing (e.g. always-include
    // types that bypass the filename check). Derive the extension from the
    // content type so consumers always get a usable name.
    let filename = raw.filename;
    if (!filename || filename.trim() === "") {
        const ext = mimeToExtension(raw.contentType);
        filename = `attachment${ext}`;
    }
    return {
        filename,
        contentType: raw.contentType,
        size: raw.size,
        content: raw.content,
        ...(raw.cid !== undefined && { cid: raw.cid }),
        ...(raw.contentDisposition !== undefined && {
            contentDisposition: raw.contentDisposition,
        }),
    };
}
/**
 * The core extraction pipeline:
 * 1. Parses the raw email
 * 2. Extracts the HTML body and finds cid: references
 * 3. Gets all attachments from the parsed email
 * 4. Runs the filter pipeline
 * 5. Returns clean ExtractedAttachment objects
 *
 * @param rawEmail - Raw RFC822 email as string or Buffer
 * @param options - Optional configuration for filtering behavior
 * @returns Promise resolving to an array of real attachments
 *
 * @example
 * ```typescript
 * import { extractAttachments } from 'email-attachment-extractor';
 *
 * const attachments = await extractAttachments(rawEmailString);
 * attachments.forEach(att => {
 *   console.log(`${att.filename} (${att.size} bytes)`);
 * });
 * ```
 */
async function extractAttachments(rawEmail, options = {}) {
    const resolvedOptions = resolveOptions(options);
    // Step 1: Parse the raw email
    const parsed = await (0, parser_1.parseRawEmail)(rawEmail);
    // Step 2: Extract HTML body and find all cid: references
    const htmlBody = (0, parser_1.extractHtmlBody)(parsed);
    const cidReferences = (0, parser_1.extractCidReferences)(htmlBody);
    // Step 3: Get all raw attachments
    const rawAttachments = (0, parser_1.getRawAttachments)(parsed);
    if (rawAttachments.length === 0) {
        return [];
    }
    // Step 4: Apply filter pipeline
    const filtered = (0, filters_1.applyFilters)(rawAttachments, cidReferences, resolvedOptions);
    // Step 5: Convert to public API format
    return filtered.map(toExtractedAttachment);
}
/**
 * Same as extractAttachments but also returns metadata about
 * why each attachment was kept or discarded. Useful for debugging.
 *
 * @param rawEmail - Raw RFC822 email as string or Buffer
 * @param options - Optional configuration for filtering behavior
 * @returns Promise with real attachments and a detailed filter log
 *
 * @example
 * ```typescript
 * const { attachments, filterLog } = await extractAttachmentsWithLog(rawEmail);
 * filterLog.forEach(entry => {
 *   console.log(`${entry.filename}: ${entry.kept ? 'KEPT' : 'DROPPED'} — ${entry.reason}`);
 * });
 * ```
 */
async function extractAttachmentsWithLog(rawEmail, options = {}) {
    const { applyFiltersWithDetails } = await Promise.resolve().then(() => __importStar(require("./filters")));
    const resolvedOptions = resolveOptions(options);
    const parsed = await (0, parser_1.parseRawEmail)(rawEmail);
    const htmlBody = (0, parser_1.extractHtmlBody)(parsed);
    const cidReferences = (0, parser_1.extractCidReferences)(htmlBody);
    const rawAttachments = (0, parser_1.getRawAttachments)(parsed);
    const detailed = applyFiltersWithDetails(rawAttachments, cidReferences, resolvedOptions);
    const attachments = detailed
        .filter((d) => d.result.kept)
        .map((d) => toExtractedAttachment(d.attachment));
    const filterLog = detailed.map((d) => ({
        filename: d.attachment.filename,
        contentType: d.attachment.contentType,
        size: d.attachment.size,
        kept: d.result.kept,
        reason: d.result.reason,
    }));
    return { attachments, filterLog };
}
//# sourceMappingURL=extractor.js.map