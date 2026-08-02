export const normalizeEmail = (email: string) => email.trim().toLowerCase()
export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export const parsePage = (value: unknown) => Math.max(1, Number(value) || 1)
export const parseLimit = (value: unknown) => Math.min(100, Math.max(1, Number(value) || 20))
