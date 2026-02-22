import { nanoid, customAlphabet } from "nanoid";

/**
 * Configuration options for URL shortener
 */
export interface ShortnerOptions {
  /** Length of the short code to generate */
  length?: number;
  /** Custom alphabet for code generation (default: base62) */
  alphabet?: string;
}

/**
 * Default short code length
 */
const DEFAULT_CODE_LENGTH = 8;

/**
 * Default base62 alphabet (A-Z, a-z, 0-9)
 */
const BASE62_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates a short URL code using base62 encoding
 * Uses nanoid library for cryptographically secure random code generation
 *
 * @param options - Configuration options for code generation
 * @returns A short alphanumeric code
 *
 * @example
 * ```ts
 * const code = generateShortCode();
 * // => "abc123XY"
 *
 * const customCode = generateShortCode({ length: 6 });
 * // => "xyz789"
 * ```
 */
export function generateShortCode(options: ShortnerOptions = {}): string {
  const { length = DEFAULT_CODE_LENGTH, alphabet = BASE62_ALPHABET } = options;

  // Use customAlphabet for non-default alphabets
  if (alphabet !== BASE62_ALPHABET) {
    const customNanoid = customAlphabet(alphabet, length);
    return customNanoid();
  }

  return nanoid(length);
}

/**
 * Validates if a given string is a valid URL
 *
 * @param url - The URL string to validate
 * @returns True if the URL is valid, false otherwise
 *
 * @example
 * ```ts
 * isValidUrl("https://example.com"); // true
 * isValidUrl("not-a-url"); // false
 * ```
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Normalizes a URL by adding https:// if no protocol is present
 *
 * @param url - The URL to normalize
 * @returns The normalized URL
 *
 * @example
 * ```ts
 * normalizeUrl("example.com"); // "https://example.com"
 * normalizeUrl("https://example.com"); // "https://example.com"
 * ```
 */
export function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

/**
 * URL shortener class for managing URL shortening operations
 */
export class UrlShortener {
  private codeLength: number;
  private alphabet: string;

  constructor(options: ShortnerOptions = {}) {
    this.codeLength = options.length || DEFAULT_CODE_LENGTH;
    this.alphabet = options.alphabet || BASE62_ALPHABET;
  }

  /**
   * Generate a new short code
   */
  generateCode(): string {
    return generateShortCode({
      length: this.codeLength,
      alphabet: this.alphabet,
    });
  }

  /**
   * Validate and normalize a long URL
   */
  prepareUrl(url: string): string | null {
    const normalized = normalizeUrl(url);
    if (!isValidUrl(normalized)) {
      return null;
    }
    return normalized;
  }
}

/**
 * Default URL shortener instance with standard settings
 */
export const defaultShortener = new UrlShortener();
