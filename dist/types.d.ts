/**
 * Represents a real email attachment after filtering.
 */
export interface ExtractedAttachment {
    /** The filename of the attachment */
    filename: string;
    /** The MIME content type (e.g., "application/pdf") */
    contentType: string;
    /** Size of the attachment in bytes */
    size: number;
    /** Raw binary content of the attachment */
    content: Buffer;
    /** Content-ID if present (only set when explicitly requested) */
    cid?: string;
    /** Content-Disposition header value */
    contentDisposition?: string;
}
/**
 * Options to configure attachment extraction behavior.
 */
export interface ExtractOptions {
    /**
     * Minimum file size in bytes to consider as a real attachment.
     * Files smaller than this are treated as tracking pixels or tiny icons.
     * @default 5000 (5KB)
     */
    minImageSize?: number;
    /**
     * Whether to ignore attachments with contentDisposition === "inline".
     * @default true
     */
    ignoreInline?: boolean;
    /**
     * Whether to ignore attachments that have a Content-ID (cid) header,
     * as these are typically embedded/inline images.
     * @default true
     */
    ignoreCidImages?: boolean;
    /**
     * Whether to ignore attachments whose filenames match known
     * signature/logo patterns (e.g., logo.png, facebook.png).
     * @default true
     */
    ignoreSignaturePatterns?: boolean;
    /**
     * Additional custom filename patterns (regex strings or RegExp) to ignore.
     * @default []
     */
    customIgnorePatterns?: Array<string | RegExp>;
    /**
     * Whether to ignore images referenced in the HTML body via cid: URIs.
     * @default true
     */
    ignoreCidReferencedInHtml?: boolean;
    /**
     * List of MIME content types to always treat as real attachments
     * regardless of other filters. Takes priority over ignore rules.
     * @default ["application/pdf", "application/zip", "application/msword", ...]
     */
    alwaysIncludeContentTypes?: string[];
}
/**
 * Resolved options with all defaults applied.
 */
export interface ResolvedOptions {
    minImageSize: number;
    ignoreInline: boolean;
    ignoreCidImages: boolean;
    ignoreSignaturePatterns: boolean;
    customIgnorePatterns: Array<string | RegExp>;
    ignoreCidReferencedInHtml: boolean;
    alwaysIncludeContentTypes: string[];
}
/**
 * Internal representation of a raw parsed attachment before filtering.
 */
export interface RawAttachment {
    filename: string | undefined;
    contentType: string;
    size: number;
    content: Buffer;
    cid: string | undefined;
    contentDisposition: string | undefined;
    headers: Map<string, string | string[]>;
}
/**
 * Result from the filter pipeline explaining why an attachment was kept or dropped.
 */
export interface FilterResult {
    kept: boolean;
    reason: string;
}
//# sourceMappingURL=types.d.ts.map