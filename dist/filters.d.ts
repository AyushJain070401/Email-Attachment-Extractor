import { RawAttachment, ResolvedOptions, FilterResult } from "./types";
/**
 * Checks whether a filename matches any of the provided patterns.
 *
 * @param filename - The filename to test
 * @param patterns - Array of RegExp or string patterns to match against
 * @returns true if the filename matches any pattern
 */
export declare function matchesPattern(filename: string, patterns: Array<string | RegExp>): boolean;
/**
 * Determines whether an attachment's filename matches known signature
 * or logo patterns.
 *
 * @param filename - The attachment filename
 * @param customPatterns - Additional user-defined patterns to check
 * @returns true if the filename is likely a signature asset
 */
export declare function isSignatureFilename(filename: string, customPatterns?: Array<string | RegExp>): boolean;
/**
 * Checks whether a CID (Content-ID) is referenced in the HTML body.
 * This detects inline images embedded using cid: URIs.
 *
 * @param cid - The Content-ID to search for (without "cid:" prefix)
 * @param cidReferences - Set of CIDs extracted from the HTML body
 * @returns true if the CID is referenced in the HTML
 */
export declare function isCidReferencedInHtml(cid: string | undefined, cidReferences: Set<string>): boolean;
/**
 * Determines if an attachment is an image type.
 *
 * @param contentType - The MIME content type
 * @returns true if the content type is an image
 */
export declare function isImageType(contentType: string): boolean;
/**
 * Checks whether an attachment's content type is in the always-include list.
 * These types bypass all other filters.
 *
 * @param contentType - The MIME content type to check
 * @param alwaysInclude - List of content types that always pass
 * @returns true if this content type should always be included
 */
export declare function isAlwaysIncludedType(contentType: string, alwaysInclude: string[]): boolean;
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
export declare function filterAttachment(attachment: RawAttachment, cidReferences: Set<string>, options: ResolvedOptions): FilterResult;
/**
 * Runs the filter pipeline across all raw attachments and returns
 * only those that pass.
 *
 * @param attachments - Array of raw attachments to filter
 * @param cidReferences - CIDs referenced in the HTML body
 * @param options - Resolved extraction options
 * @returns Array of raw attachments that passed the filter
 */
export declare function applyFilters(attachments: RawAttachment[], cidReferences: Set<string>, options: ResolvedOptions): RawAttachment[];
/**
 * Runs the filter pipeline and returns detailed results for each attachment,
 * including why each was kept or discarded. Useful for debugging.
 *
 * @param attachments - Array of raw attachments to evaluate
 * @param cidReferences - CIDs referenced in the HTML body
 * @param options - Resolved extraction options
 * @returns Array of objects with the attachment and its filter result
 */
export declare function applyFiltersWithDetails(attachments: RawAttachment[], cidReferences: Set<string>, options: ResolvedOptions): Array<{
    attachment: RawAttachment;
    result: FilterResult;
}>;
//# sourceMappingURL=filters.d.ts.map