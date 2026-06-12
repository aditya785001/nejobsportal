/**
 * Generate a URL-friendly slug from a string.
 * Handles English text, converts to lowercase, replaces spaces with hyphens,
 * and removes special characters.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
