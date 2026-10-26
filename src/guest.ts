export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

// "Dear" is a greeting style, not part of the name: the message already starts with "Dear".
export function buildDisplayName(prefix: Prefix, guestName: string): string {
  const name = guestName.trim().replace(/\s+/g, ' ');
  if (!name) return '';
  if (prefix === 'Family') return `${name} and Family`;
  if (prefix === 'Dear') return name;
  return `${prefix} ${name}`;
}

export function buildInviteLink(baseUrl: string, displayName: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(displayName)}`;
}

// Reads the guest display name from a personalized URL such as /Mr.%20Sanjaya.
export function getGuestFromPath(pathname: string): string | null {
  const segment = pathname.replace(/^\/+|\/+$/g, '');
  if (!segment || segment.toLowerCase() === 'admin') return null;
  try {
    const name = decodeURIComponent(segment).trim();
    return name ? name.slice(0, 80) : null;
  } catch {
    return null;
  }
}
