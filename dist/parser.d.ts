import { ParsedMail, Attachment } from "mailparser";
import { RawAttachment } from "./types";
/**
 * Parses a raw RFC822 email string or Buffer using mailparser.
 *
 * @param rawEmail - The raw email content in RFC822 format
 * @returns The parsed mail object from mailparser
 * @throws {Error} If the email cannot be parsed
 */
export declare function parseRawEmail(rawEmail: string | Buffer): Promise<ParsedMail>;
/**
 * Extracts the HTML body content from a parsed mail object.
 *
 * @param parsed - The parsed mail object
 * @returns The HTML body string, or empty string if not present
 */
export declare function extractHtmlBody(parsed: ParsedMail): string;
/**
 * Extracts all CID references found in an HTML body string.
 * CID references look like: cid:abc123@domain.com or src="cid:imageId"
 *
 * @param html - The HTML body content
 * @returns A Set of CID strings (without the "cid:" prefix)
 */
export declare function extractCidReferences(html: string): Set<string>;
/**
 * Converts a mailparser Attachment object into our internal RawAttachment format.
 *
 * @param attachment - The mailparser attachment object
 * @returns A normalized RawAttachment object
 */
export declare function normalizeAttachment(attachment: Attachment): RawAttachment;
/**
 * Retrieves all raw attachments from a parsed mail object.
 *
 * @param parsed - The parsed mail object
 * @returns Array of normalized raw attachments
 */
export declare function getRawAttachments(parsed: ParsedMail): RawAttachment[];
//# sourceMappingURL=parser.d.ts.map