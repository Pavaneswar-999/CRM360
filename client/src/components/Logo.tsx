import { Link } from 'react-router'
export function Logo({ compact = false }: { compact?: boolean }) {
  return <Link className="logo" to="/" aria-label="CRM360 home"><span className="logo-mark" aria-hidden="true"><svg viewBox="0 0 32 32" role="presentation"><circle cx="16" cy="16" r="5.5" fill="currentColor" /><circle cx="7" cy="9" r="2.5" fill="currentColor" /><circle cx="25" cy="9" r="2.5" fill="currentColor" /><circle cx="25" cy="24" r="2.5" fill="currentColor" /><path d="M11.2 12.1 8.8 10.3M20.8 12.1l2.4-1.8M20.8 19.6l2.4 2.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>{!compact && <span>CRM<span className="logo-number">360</span></span>}</Link>
}
