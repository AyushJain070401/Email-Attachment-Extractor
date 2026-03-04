import { ExtractedAttachment, ExtractOptions, ResolvedOptions, RawAttachment } from "./types";
/**
 * Merges user-provided options with defaults to produce a complete
 * ResolvedOptions object.
 *
 * @param options - Partial user options
 * @returns Fully resolved options with defaults
 */
export declare function resolveOptions(options?: ExtractOptions): ResolvedOptions;
/**
 * Converts a RawAttachment that has passed all filters into an
 * ExtractedAttachment for the public API response.
 * Provides a fallback filename derived from content type when the
 * original filename is missing.
 *
 * @param raw - A raw attachment that passed filtering
 * @returns A clean ExtractedAttachment object
 */
export declare function toExtractedAttachment(raw: RawAttachment): ExtractedAttachment;
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
export declare function extractAttachments(rawEmail: string | Buffer, options?: ExtractOptions): Promise<ExtractedAttachment[]>;
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
export declare function extractAttachmentsWithLog(rawEmail: string | Buffer, options?: ExtractOptions): Promise<{
    attachments: ExtractedAttachment[];
    filterLog: Array<{
        filename: string | undefined;
        contentType: string;
        size: number;
        kept: boolean;
        reason: string;
    }>;
}>;
//# sourceMappingURL=extractor.d.ts.map