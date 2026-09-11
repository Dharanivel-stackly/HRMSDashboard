/**
 * Persistence seam for the in-memory mock API.
 *
 * This module is part of the browser bundle (via apiClient -> mockApiRouter), so it
 * must stay free of Node imports. The Vite mock middleware injects an fs-backed
 * adapter at request time; without an adapter the store behaves as plain memory.
 */

export interface MockStateSnapshot {
  rolePermissions?: Record<string, string[]>
  users?: unknown[]
  goals?: unknown[]
}

export interface MockPersistenceAdapter {
  read(): MockStateSnapshot | null
  write(snapshot: MockStateSnapshot): void
}

let adapter: MockPersistenceAdapter | null = null
let snapshot: MockStateSnapshot | null = null

export function configureMockPersistence(next: MockPersistenceAdapter): void {
  if (adapter === next) return
  adapter = next
  // Drop the cache so the next read hydrates from the newly attached adapter.
  snapshot = null
}

export function readMockState(): MockStateSnapshot {
  if (snapshot) return snapshot

  if (!adapter) {
    snapshot = {}
    return snapshot
  }

  try {
    snapshot = adapter.read() ?? {}
  } catch {
    snapshot = {}
  }
  return snapshot
}

export function writeMockState(patch: Partial<MockStateSnapshot>): void {
  const next: MockStateSnapshot = { ...readMockState(), ...patch }
  snapshot = next

  if (!adapter) return
  try {
    adapter.write(next)
  } catch {
    // Persistence is best effort — a disk failure must never break a mock request.
  }
}
