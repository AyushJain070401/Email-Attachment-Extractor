"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesPattern = matchesPattern;
exports.isSignatureFilename = isSignatureFilename;
exports.isCidReferencedInHtml = isCidReferencedInHtml;
exports.isImageType = isImageType;
exports.isAlwaysIncludedType = isAlwaysIncludedType;
exports.filterAttachment = filterAttachment;
exports.applyFilters = applyFilters;
exports.applyFiltersWithDetails = applyFiltersWithDetails;
const constants_1 = require("./constants");
/**
 * Checks whether a filename matches any of the provided patterns.
 *
 * @param filename - The filename to test
 * @param patterns - Array of RegExp or string patterns to match against
 * @returns true if the filename matches any pattern
 */
function matchesPattern(filename, patterns) {
    const lower = filename.toLowerCase();
    return patterns.some((pattern) => {
        if (pattern instanceof RegExp) {
            return pattern.test(lower) || pattern.test(filename);
        }
        // String patterns: case-insensitive exact match
        return lower === pattern.toLowerCase() || filename === pattern;
    });
}
/**
 * Determines whether an attachment's filename matches known signature
 * or logo patterns.
 *
 * @param filename - The attachment filename
 * @param customPatterns - Additional user-defined patterns to check
 * @returns true if the filename is likely a signature asset
 */
function isSignatureFilename(filename, customPatterns = []) {
    return (matchesPattern(filename, constants_1.SIGNATURE_FILENAME_PATTERNS) ||
        matchesPattern(filename, customPatterns));
}
/**
 * Checks whether a CID (Content-ID) is referenced in the HTML body.
 * This detects inline images embedded using cid: URIs.
 *
 * @param cid - The Content-ID to search for (without "cid:" prefix)
 * @param cidReferences - Set of CIDs extracted from the HTML body
 * @returns true if the CID is referenced in the HTML
 */
function isCidReferencedInHtml(cid, cidReferences) {
    if (!cid)
        return false;
    const normalizedCid = cid.replace(/^<|>$/g, "").trim();
    // Direct match
    if (cidReferences.has(normalizedCid))
        return true;
    // Try matching without domain part (some clients strip it)
    const localPart = normalizedCid.split("@")[0];
    for (const ref of cidReferences) {
        if (ref === normalizedCid || ref.split("@")[0] === localPart) {
            return true;
        }
    }
    return false;
}
/**
 * Determines if an attachment is an image type.
 *
 * @param contentType - The MIME content type
 * @returns true if the content type is an image
 */
function isImageType(contentType) {
    return contentType.toLowerCase().startsWith(constants_1.IMAGE_CONTENT_TYPE_PREFIX);
}
/**
 * Checks whether an attachment's content type is in the always-include list.
 * These types bypass all other filters.
 *
 * @param contentType - The MIME content type to check
 * @param alwaysInclude - List of content types that always pass
 * @returns true if this content type should always be included
 */
function isAlwaysIncludedType(contentType, alwaysInclude) {
    const normalized = contentType.toLowerCase().split(";")[0].trim();
    return alwaysInclude.some((type) => type.toLowerCase() === normalized);
}
/**
 * Core filter pipeline for a single attachment.
 * Returns a FilterResult explaining whether the attachment should be kept.
 *
 * Priority order:
 * 1. Always-include content types (bypass all other filters)
 * 2. Must have a filename
 * 3. HTML cid: reference check (if enabled — more specific, runs first)
 * 4. CID image check (if enabled — broader catch-all)
 * 5. Inline disposition check (if enabled)
 * 6. Signature pattern check (if enabled, images only)
 * 7. Minimum size check (images only)
 *
 * @param attachment - The raw attachment to evaluate
 * @param cidReferences - CIDs referenced in the HTML body
 * @param options - Resolved extraction options
 * @returns FilterResult with kept=true/false and reason
 */
function filterAttachment(attachment, cidReferences, options) {
    const { filename, contentType, size, cid, contentDisposition } = attachment;
    // 1. Always-include content types bypass all filters
    if (isAlwaysIncludedType(contentType, options.alwaysIncludeContentTypes)) {
        return { kept: true, reason: "always-included content type" };
    }
    // 2. Must have a filename to be a real attachment
    if (!filename || filename.trim() === "") {
        return { kept: false, reason: "no filename" };
    }
    // 3. Ignore images referenced in HTML via cid: (more specific check first)
    if (options.ignoreCidReferencedInHtml &&
        cid &&
        isCidReferencedInHtml(cid, cidReferences)) {
        return { kept: false, reason: `cid referenced in HTML body: ${cid}` };
    }
    // 4. Ignore attachments with a CID (they're inline/embedded).
    //    This is a broader catch-all — only applies to CID attachments
    //    NOT already handled by the HTML-reference check above.
    if (options.ignoreCidImages && cid) {
        return { kept: false, reason: `has Content-ID: ${cid}` };
    }
    // 5. Ignore inline-disposed attachments
    if (options.ignoreInline &&
        contentDisposition?.toLowerCase().startsWith("inline")) {
        return { kept: false, reason: "contentDisposition is inline" };
    }
    // For images only: apply extra scrutiny
    if (isImageType(contentType)) {
        // 6. Ignore images matching signature filename patterns
        if (options.ignoreSignaturePatterns &&
            isSignatureFilename(filename, options.customIgnorePatterns)) {
            return {
                kept: false,
                reason: `filename matches signature pattern: ${filename}`,
            };
        }
        // 7. Ignore images below minimum size threshold
        if (size < options.minImageSize) {
            return {
                kept: false,
                reason: `image size ${size} bytes is below minimum ${options.minImageSize} bytes`,
            };
        }
    }
    return { kept: true, reason: "passed all filters" };
}
/**
 * Runs the filter pipeline across all raw attachments and returns
 * only those that pass.
 *
 * @param attachments - Array of raw attachments to filter
 * @param cidReferences - CIDs referenced in the HTML body
 * @param options - Resolved extraction options
 * @returns Array of raw attachments that passed the filter
 */
function applyFilters(attachments, cidReferences, options) {
    return attachments.filter((attachment) => {
        const result = filterAttachment(attachment, cidReferences, options);
        return result.kept;
    });
}
/**
 * Runs the filter pipeline and returns detailed results for each attachment,
 * including why each was kept or discarded. Useful for debugging.
 *
 * @param attachments - Array of raw attachments to evaluate
 * @param cidReferences - CIDs referenced in the HTML body
 * @param options - Resolved extraction options
 * @returns Array of objects with the attachment and its filter result
 */
function applyFiltersWithDetails(attachments, cidReferences, options) {
    return attachments.map((attachment) => ({
        attachment,
        result: filterAttachment(attachment, cidReferences, options),
    }));
}
//# sourceMappingURL=filters.js.map