import { lazy, Suspense } from 'react'
import {
  Activity,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  GraduationCap,
  HeartHandshake,
  Layers3,
  Route,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router'
import { Logo } from '../components/Logo'

const RelationshipScene = lazy(() => import('../components/RelationshipScene').then((module) => ({ default: module.RelationshipScene })))

const features = [
  {
    icon: Target,
    number: '01',
    title: 'A pipeline with a pulse',
    text: 'Move each lead through clear stages, see what is waiting, and keep ownership visible.',
    action: 'Open the pipeline',
    next: '/app/pipeline',
    tone: 'copper',
  },
  {
    icon: UsersRound,
    number: '02',
    title: 'Context that stays together',
    text: 'Open one record to see contact details, notes, activity, and tasks together.',
    action: 'Open customer records',
    next: '/app/customers',
    tone: 'blue',
  },
  {
    icon: Layers3,
    number: '03',
    title: 'A focus queue for today',
    text: 'See overdue tasks, upcoming due dates, quiet leads, and proposals waiting for a response.',
    action: 'Open the task list',
    next: '/app/tasks',
    tone: 'green',
  },
]

const domainCards = [
  { icon: Building2, label: 'Agencies & services', text: 'Keep every client, project conversation, renewal, and owner connected.', action: 'Open customer records', next: '/app/customers', tone: 'copper' },
  { icon: HeartHandshake, label: 'Account management', text: 'Turn relationship health into visible follow-ups before accounts go quiet.', action: 'Open active leads', next: '/app/leads', tone: 'blue' },
  { icon: GraduationCap, label: 'Education & recruiting', text: 'Track applicants, partners, and time-sensitive next steps with less chasing.', action: 'Plan next steps', next: '/app/tasks', tone: 'green' },
]

function EntryLink({ next, children, className = '' }: { next: string; children: React.ReactNode; className?: string }) {
  return <Link className={className} to={`/register?next=${encodeURIComponent(next)}`}>{children}</Link>
}

export function LandingPage() {
  return <div className="landing">
    <header className="landing-nav">
      <Logo />
      <nav aria-label="Landing page sections"><a href="#workflow">Workflow</a><a href="#surface">Coverage</a><a href="#security">Trust</a></nav>
      <div className="landing-actions"><Link className="text-button" to="/login">Sign in</Link><Link className="button button-dark button-small" to="/register">Launch CRM <ArrowRight size={15} /></Link></div>
    </header>

    <main>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> The relationship operating layer</div>
          <h1>Make every<br /><em>next step</em> visible.</h1>
          <p className="hero-lede">CRM360 gives small teams one calm place for customer context, sales momentum, ownership, and the follow-through that turns conversations into progress.</p>
          <div className="hero-actions"><Link className="button button-dark" to="/register">Start with CRM360 <ArrowRight size={17} /></Link><a className="button button-quiet" href="#workflow">Trace the workflow <ChevronRight size={17} /></a></div>
          <div className="hero-proof"><span><CheckCircle2 size={15} /> Real records and actions</span><span><CheckCircle2 size={15} /> Role-aware access</span><span><CheckCircle2 size={15} /> No dashboard theatre</span></div>
          <div className="hero-index"><span>CRM360 / 01</span><span>Relationship atlas</span><span>Scroll to explore <ArrowRight size={13} /></span></div>
        </div>
        <div className="hero-visual" aria-label="CRM360 relationship atlas preview">
          <img className="hero-atlas-image" src="/relationship-atlas-hero.png" alt="" aria-hidden="true" />
          <div className="hero-image-wash" aria-hidden="true" />
          <Suspense fallback={<div className="relationship-scene-fallback" aria-hidden="true"><b>CRM360</b></div>}><RelationshipScene /></Suspense>
          <div className="hero-stage-label"><Sparkles size={14} /><span>Product view / illustrative</span><small>How context moves through the workspace</small></div>
          <div className="hero-orbit-note"><span className="signal signal-accent" /><div><strong>One connected thread</strong><small>Customer · Lead · Task</small></div></div>
          <div className="floating-card floating-card-top"><span className="mini-avatar accent-avatar">A</span><div><strong>Example account</strong><small>Proposal sent · $18.4k</small></div><span className="signal signal-accent" /></div>
          <div className="floating-card floating-card-bottom"><span className="task-check"><CheckCircle2 size={16} /></span><div><strong>Example next action</strong><small>Follow up on proposal · Today</small></div><span className="signal signal-warning" /></div>
          <div className="hero-visual-caption"><span>01</span><span>Context</span><span>Ownership</span><span>Momentum</span></div>
        </div>
      </section>

      <section className="trust-strip section-wrap"><span>One calm layer over your sales motion</span><div><b>LEADS</b><i>→</i><b>FOLLOW-UPS</b><i>→</i><b>CONTEXT</b><i>→</i><b>PROGRESS</b></div></section>

      <section id="workflow" className="section-wrap workflow-section">
        <div className="section-intro editorial-intro"><div><span className="eyebrow">01 / The workflow</span><h2>From first signal<br /><em>to next win.</em></h2></div><p>CRM360 turns the loose ends around a relationship into a visible, owned sequence. The point is not more admin. It is fewer moments where the team wonders what happens next.</p></div>
        <div className="workflow-grid">
          <div className="workflow-rail"><span className="rail-line" /><div className="workflow-step active"><b>01</b><div><strong>Capture</strong><span>Get every new opportunity into one place.</span></div></div><div className="workflow-step"><b>02</b><div><strong>Clarify</strong><span>Assign an owner, stage, and next action.</span></div></div><div className="workflow-step"><b>03</b><div><strong>Follow through</strong><span>Turn conversations into tasks and history.</span></div></div><div className="workflow-step"><b>04</b><div><strong>Convert</strong><span>Move qualified relationships into customers.</span></div></div></div>
          <div className="workflow-preview product-frame"><div className="preview-top"><span className="preview-label">CRM360 / focus queue <span>Example view</span></span><span className="preview-dots">•••</span></div><div className="preview-highlight"><div><span className="eyebrow">Next actions</span><strong>5 signals need a response</strong><small>Illustrative records, not live account data</small></div><span className="preview-ring">5</span></div><div className="preview-row"><span className="preview-icon danger-bg">!</span><div><strong>Overdue follow-up</strong><small>Example account · Proposal Sent</small></div><span className="preview-time">1d late</span></div><div className="preview-row"><span className="preview-icon accent-bg"><CircleDot size={15} /></span><div><strong>Confirm buying committee</strong><small>Example account · Qualified</small></div><span className="preview-time">Due Fri</span></div><div className="preview-row"><span className="preview-icon warning-bg"><CircleDot size={15} /></span><div><strong>Review renewal health</strong><small>Example account · Customer</small></div><span className="preview-time">Due Mon</span></div><div className="preview-footer"><span><Clock3 size={13} /> Due dates stay visible</span><span><Check size={13} /> Ownership stays clear</span></div></div>
        </div>
      </section>

      <section id="surface" className="surface-section section-wrap">
        <div className="section-intro split-intro"><div><span className="eyebrow">02 / The complete surface</span><h2>Useful across the whole relationship—not only the deal.</h2></div><p>Customers, leads, pipeline, tasks, notifications, and the dashboard are connected modules—not six links that lead to the same empty room.</p></div>
        <div className="surface-layout"><div className="surface-map"><div className="surface-map-line" /><div><span className="surface-map-number">01</span><strong>Leads</strong><small>Capture source, owner, stage</small></div><div><span className="surface-map-number">02</span><strong>Customers</strong><small>Context, contacts, activity</small></div><div><span className="surface-map-number">03</span><strong>Tasks</strong><small>Due dates, priority, handoff</small></div><div><span className="surface-map-number">04</span><strong>Insights</strong><small>Pipeline, trends, focus queue</small></div></div><div className="domain-grid">{domainCards.map(({ icon: Icon, label, text, action, next, tone }) => <EntryLink className={`domain-card domain-card-${tone}`} next={next} key={label}><span className="domain-icon"><Icon size={19} /></span><div><strong>{label}</strong><p>{text}</p><small className="card-action">{action} <ArrowRight size={14} /></small></div><span className="domain-index">0{domainCards.findIndex((card) => card.label === label) + 1}</span></EntryLink>)}</div></div>
        <div className="coverage-row"><span><SearchCheck size={16} /> Search across the workspace</span><span><Route size={16} /> Track a clear next action</span><span><Activity size={16} /> See momentum before it slips</span></div>
      </section>

      <section id="features" className="section-wrap feature-section">
        <div className="section-intro split-intro"><div><span className="eyebrow">03 / Designed for momentum</span><h2>Less admin.<br /><em>More meaningful follow-through.</em></h2></div><p>Each module exists to help someone decide what to do next. Explore the real destination before you create a workspace.</p></div>
        <div className="feature-grid">{features.map(({ icon: Icon, number, title, text, action, next, tone }) => <article className={`feature-card feature-card-${tone}`} key={title}><div className="feature-card-top"><span className="feature-number">{number}</span><span className="feature-icon"><Icon size={21} /></span></div><div className="feature-card-body"><h3>{title}</h3><p>{text}</p><EntryLink next={next}>{action} <ArrowRight size={15} /></EntryLink></div><div className="feature-visual" aria-hidden="true">{tone === 'copper' ? <><span className="mock-column mock-column-a" /><span className="mock-column mock-column-b" /><span className="mock-column mock-column-c" /><span className="mock-line" /></> : tone === 'blue' ? <><span className="mock-avatar">A</span><span className="mock-line mock-line-long" /><span className="mock-line" /><span className="mock-chip">context</span></> : <><span className="mock-check"><Check size={12} /></span><span className="mock-line mock-line-long" /><span className="mock-line" /><span className="mock-date">TODAY</span></>}</div></article>)}</div>
      </section>

      <section id="security" className="trust-section section-wrap"><div className="trust-badge"><ShieldCheck size={24} /></div><div><span className="eyebrow">04 / Trust by default</span><h2>Clear permissions.<br />Honest status. Safe foundations.</h2><p>Role-aware access, validated forms, hashed passwords, and a backend that treats ownership as a permission—not a UI preference.</p></div><Link className="button button-quiet" to="/register">See CRM360 in action <ArrowRight size={16} /></Link></section>
      <section className="final-cta section-wrap"><div className="cta-orbit" aria-hidden="true"><span /><span /><span /></div><div className="cta-glow" /><span className="eyebrow">05 / Start with one relationship</span><h2>Make the next step<br /><em>the obvious one.</em></h2><p>Bring the first customer, lead, and follow-up into one visible rhythm.</p><Link className="button button-light" to="/register">Launch your workspace <ArrowRight size={17} /></Link></section>
    </main>
    <footer className="landing-footer section-wrap"><Logo /><span>© 2026 CRM360. Every relationship. Every next step.</span><div><a href="#workflow">Workflow</a><Link to="/login">Sign in</Link></div></footer>
  </div>
}
