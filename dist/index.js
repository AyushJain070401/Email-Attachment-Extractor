"use strict";
/**
 * email-attachment-extractor
 *
 * Extracts only real email attachments from raw RFC822 emails,
 * intelligently filtering out signature images, inline images,
 * logos, and tracking pixels.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ALWAYS_INCLUDE_CONTENT_TYPES = exports.SIGNATURE_FILENAME_PATTERNS = exports.DEFAULT_MIN_IMAGE_SIZE = exports.normalizeAttachment = exports.getRawAttachments = exports.extractCidReferences = exports.extractHtmlBody = exports.parseRawEmail = exports.matchesPattern = exports.isAlwaysIncludedType = exports.isImageType = exports.isCidReferencedInHtml = exports.isSignatureFilename = exports.extractAttachmentsWithLog = exports.extractAttachments = void 0;
// ─── Public API ─────────────────────────────────────────────────────────────
var extractor_1 = require("./extractor");
Object.defineProperty(exports, "extractAttachments", { enumerable: true, get: function () { return extractor_1.extractAttachments; } });
Object.defineProperty(exports, "extractAttachmentsWithLog", { enumerable: true, get: function () { return extractor_1.extractAttachmentsWithLog; } });
// ─── Utility Helpers ────────────────────────────────────────────────────────
var filters_1 = require("./filters");
Object.defineProperty(exports, "isSignatureFilename", { enumerable: true, get: function () { return filters_1.isSignatureFilename; } });
Object.defineProperty(exports, "isCidReferencedInHtml", { enumerable: true, get: function () { return filters_1.isCidReferencedInHtml; } });
Object.defineProperty(exports, "isImageType", { enumerable: true, get: function () { return filters_1.isImageType; } });
Object.defineProperty(exports, "isAlwaysIncludedType", { enumerable: true, get: function () { return filters_1.isAlwaysIncludedType; } });
Object.defineProperty(exports, "matchesPattern", { enumerable: true, get: function () { return filters_1.matchesPattern; } });
var parser_1 = require("./parser");
Object.defineProperty(exports, "parseRawEmail", { enumerable: true, get: function () { return parser_1.parseRawEmail; } });
Object.defineProperty(exports, "extractHtmlBody", { enumerable: true, get: function () { return parser_1.extractHtmlBody; } });
Object.defineProperty(exports, "extractCidReferences", { enumerable: true, get: function () { return parser_1.extractCidReferences; } });
Object.defineProperty(exports, "getRawAttachments", { enumerable: true, get: function () { return parser_1.getRawAttachments; } });
Object.defineProperty(exports, "normalizeAttachment", { enumerable: true, get: function () { return parser_1.normalizeAttachment; } });
// ─── Constants ──────────────────────────────────────────────────────────────
var constants_1 = require("./constants");
Object.defineProperty(exports, "DEFAULT_MIN_IMAGE_SIZE", { enumerable: true, get: function () { return constants_1.DEFAULT_MIN_IMAGE_SIZE; } });
Object.defineProperty(exports, "SIGNATURE_FILENAME_PATTERNS", { enumerable: true, get: function () { return constants_1.SIGNATURE_FILENAME_PATTERNS; } });
Object.defineProperty(exports, "DEFAULT_ALWAYS_INCLUDE_CONTENT_TYPES", { enumerable: true, get: function () { return constants_1.DEFAULT_ALWAYS_INCLUDE_CONTENT_TYPES; } });
//# sourceMappingURL=index.js.map