/**
 * Default minimum image size in bytes (5KB).
 * Files smaller than this are likely tracking pixels or tiny icons.
 */
export declare const DEFAULT_MIN_IMAGE_SIZE = 5000;
/**
 * Common signature image filename patterns to filter out.
 * These cover typical email client signature icons and social media logos.
 */
export declare const SIGNATURE_FILENAME_PATTERNS: RegExp[];
/**
 * MIME content types that are always treated as real attachments
 * regardless of size, disposition, or name-based filters.
 */
export declare const DEFAULT_ALWAYS_INCLUDE_CONTENT_TYPES: string[];
/**
 * Image MIME type prefix — used to identify image attachments
 * that need extra scrutiny.
 */
export declare const IMAGE_CONTENT_TYPE_PREFIX = "image/";
//# sourceMappingURL=constants.d.ts.map