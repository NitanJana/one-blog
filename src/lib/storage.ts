import type { JSONContent } from '@tiptap/react';

export type StoredEntry = {
  id: string;
  title: string;
  content: JSONContent;
  wordCount: { charactersCount: number; wordsCount: number };
  savedAt: number;
};

const STORAGE_KEY = 'one-blog-entries';
const MAX_ENTRIES = 10;

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function generateTitle(): string {
  return formatTimestamp(Date.now());
}

export function loadEntries(): StoredEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveEntry(
  content: JSONContent,
  wordCount: { charactersCount: number; wordsCount: number },
  replaceEntryId?: string,
): { entries: StoredEntry[]; entryId: string } {
  const entries = loadEntries();
  const now = Date.now();
  const entryId = replaceEntryId || `entry-${now}`;
  const newEntry: StoredEntry = {
    id: entryId,
    title: generateTitle(),
    content,
    wordCount,
    savedAt: now,
  };

  if (replaceEntryId) {
    const index = entries.findIndex((e) => e.id === replaceEntryId);
    if (index !== -1) {
      entries[index] = newEntry;
    } else {
      entries.push(newEntry);
    }
  } else {
    entries.push(newEntry);
  }

  const sortedEntries = entries.sort((a, b) => b.savedAt - a.savedAt);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedEntries));
  return { entries: sortedEntries, entryId };
}

export function deleteEntry(entryId: string): StoredEntry[] {
  const entries = loadEntries().filter((e) => e.id !== entryId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries;
}

export function isStorageFull(): boolean {
  return loadEntries().length >= MAX_ENTRIES;
}
