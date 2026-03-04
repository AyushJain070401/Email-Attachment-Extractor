/**
 * email-attachment-extractor
 *
 * Extracts only real email attachments from raw RFC822 emails,
 * intelligently filtering out signature images, inline images,
 * logos, and tracking pixels.
 *
 * @packageDocumentation
 */
export { extractAttachments, extractAttachmentsWithLog } from "./extractor";
export { isSignatureFilename, isCidReferencedInHtml, isImageType, isAlwaysIncludedType, matchesPattern, } from "./filters";
export { parseRawEmail, extractHtmlBody, extractCidReferences, getRawAttachments, normalizeAttachment, } from "./parser";
export type { ExtractedAttachment, ExtractOptions, ResolvedOptions, RawAttachment, FilterResult, } from "./types";
export { DEFAULT_MIN_IMAGE_SIZE, SIGNATURE_FILENAME_PATTERNS, DEFAULT_ALWAYS_INCLUDE_CONTENT_TYPES, } from "./constants";
//# sourceMappingURL=index.d.ts.map