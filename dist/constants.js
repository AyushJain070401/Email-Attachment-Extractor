"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE_CONTENT_TYPE_PREFIX = exports.DEFAULT_ALWAYS_INCLUDE_CONTENT_TYPES = exports.SIGNATURE_FILENAME_PATTERNS = exports.DEFAULT_MIN_IMAGE_SIZE = void 0;
/**
 * Default minimum image size in bytes (5KB).
 * Files smaller than this are likely tracking pixels or tiny icons.
 */
exports.DEFAULT_MIN_IMAGE_SIZE = 5000;
/**
 * Common signature image filename patterns to filter out.
 * These cover typical email client signature icons and social media logos.
 */
exports.SIGNATURE_FILENAME_PATTERNS = [
    // Generic signature/logo names
    /^logo(\.[a-z]+)?$/i,
    /^signature(\.[a-z]+)?$/i,
    /^avatar(\.[a-z]+)?$/i,
    /^icon(\.[a-z]+)?$/i,
    /^banner(\.[a-z]+)?$/i,
    // Outlook-generated embedded image names
    /^image\d{3,}\.(png|jpg|jpeg|gif|bmp)$/i,
    /^image\d{3,}$/i,
    /^Outlook-[a-zA-Z0-9]+\.(png|jpg|jpeg|gif)$/i,
    // Social media logos
    /^facebook(\.[a-z]+)?$/i,
    /^twitter(\.[a-z]+)?$/i,
    /^linkedin(\.[a-z]+)?$/i,
    /^instagram(\.[a-z]+)?$/i,
    /^youtube(\.[a-z]+)?$/i,
    /^pinterest(\.[a-z]+)?$/i,
    /^tiktok(\.[a-z]+)?$/i,
    /^snapchat(\.[a-z]+)?$/i,
    /^whatsapp(\.[a-z]+)?$/i,
    /^telegram(\.[a-z]+)?$/i,
    // Common business/mail icons
    /^mail(\.[a-z]+)?$/i,
    /^email(\.[a-z]+)?$/i,
    /^phone(\.[a-z]+)?$/i,
    /^website(\.[a-z]+)?$/i,
    /^arrow(\.[a-z]+)?$/i,
    /^divider(\.[a-z]+)?$/i,
    /^spacer(\.[a-z]+)?$/i,
    /^separator(\.[a-z]+)?$/i,
    // Tracking pixel patterns
    /^pixel(\.[a-z]+)?$/i,
    /^track(\.[a-z]+)?$/i,
    /^beacon(\.[a-z]+)?$/i,
    // Generic numbered files often used by mail clients
    /^att\d+\.(png|jpg|jpeg|gif)$/i,
    /^part\d+\.\d+\.(png|jpg|jpeg|gif)$/i,
];
/**
 * MIME content types that are always treated as real attachments
 * regardless of size, disposition, or name-based filters.
 */
exports.DEFAULT_ALWAYS_INCLUDE_CONTENT_TYPES = [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "application/gzip",
    "application/x-tar",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.presentation",
    "text/csv",
    "text/plain",
    "application/json",
    "application/xml",
    "application/rtf",
    "application/x-7z-compressed",
    "application/x-rar-compressed",
];
/**
 * Image MIME type prefix — used to identify image attachments
 * that need extra scrutiny.
 */
exports.IMAGE_CONTENT_TYPE_PREFIX = "image/";
//# sourceMappingURL=constants.js.map