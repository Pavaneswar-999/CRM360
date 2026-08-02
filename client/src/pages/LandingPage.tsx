import { lazy, Suspense, type ReactNode } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ClipboardCheck,
  FolderKanban,
  ListChecks,
  ShieldCheck,
  Target,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router'
import { LandingMotion } from '../components/LandingMotion'
import { Logo } from '../components/Logo'

const RelationshipScene = lazy(() => import('../components/RelationshipScene').then((module) => ({ default: module.RelationshipScene })))

const workflow = [
  {
    index: '01',
    icon: Target,
    title: 'Capture the lead.',
    text: 'Add a lead with the contact, source, stage, and the next action your team agreed to take.',
    action: 'Create a lead',
    next: '/app/leads',
  },
  {
    index: '02',
    icon: UserRoundCheck,
    title: 'Give the relationship an owner.',
    text: 'Keep the people, notes, tasks, and activity around a customer record instead of scattered across messages.',
    action: 'Open customers',
    next: '/app/customers',
  },
  {
    index: '03',
    icon: ClipboardCheck,
    title: 'Turn the conversation into work.',
    text: 'Create tasks with due dates and priorities so a follow-up is visible before it is missed.',
    action: 'Plan a task',
    next: '/app/tasks',
  },
  {
    index: '04',
    icon: FolderKanban,
    title: 'Move the opportunity forward.',
    text: 'Update the sales stage as the work changes and keep a clear view of what is active, won, or lost.',
    action: 'View pipeline',
    next: '/app/pipeline',
  },
]

function EntryLink({ next, children, className = '' }: { next: string; children: ReactNode; className?: string }) {
  return <Link className={className} to={`/register?next=${encodeURIComponent(next)}`}>{children}</Link>
}

export function LandingPage() {
  return <div className="landing" data-landing-root>
    <LandingMotion />
    <header className="landing-nav">
      <Logo />
      <nav aria-label="Landing page sections">
        <a href="#how-it-works">How it works</a>
        <a href="#product">Product</a>
        <a href="#security">Security</a>
      </nav>
      <div className="landing-actions"><Link className="text-button" to="/login">Sign in</Link><Link className="button button-dark button-small" to="/register">Start CRM360 <ArrowRight size={15} /></Link></div>
    </header>

    <main>
      <section className="signal-hero">
        <div className="signal-hero-art" aria-hidden="true" />
        <div className="signal-hero-grid section-wrap">
          <div className="signal-hero-copy" data-reveal>
            <span className="signal-kicker"><i /> CRM360 relationship workspace</span>
            <h1>Every relationship.<br /><em>Every next move.</em></h1>
            <p>Bring customer context, sales opportunities, and follow-up work into one place your team can act on.</p>
            <div className="hero-actions">
              <Link className="button button-accent" to="/register">Create your workspace <ArrowRight size={17} /></Link>
              <a className="button button-ghost-light" href="#how-it-works">See how it works <ArrowDownRight size={17} /></a>
            </div>
          </div>
          <aside className="hero-route-list" aria-label="CRM360 capabilities" data-reveal>
            <EntryLink next="/app/leads"><span>01</span><strong>Capture leads</strong><ArrowRight size={16} /></EntryLink>
            <EntryLink next="/app/customers"><span>02</span><strong>Keep customer context</strong><ArrowRight size={16} /></EntryLink>
            <EntryLink next="/app/tasks"><span>03</span><strong>Make follow-ups visible</strong><ArrowRight size={16} /></EntryLink>
          </aside>
        </div>
        <div className="signal-hero-rule section-wrap" aria-hidden="true"><span>CRM360 / Relationship thread</span><span>Customer · Lead · Task · Progress</span></div>
      </section>

      <section id="how-it-works" className="landing-section workflow-story section-wrap">
        <div className="editorial-heading" data-reveal>
          <span className="eyebrow">A working sequence</span>
          <h2>Less hunting for context.<br /><em>More time moving work forward.</em></h2>
          <p>CRM360 is built around the moments that keep a relationship moving: recording the lead, assigning the work, completing the follow-up, and seeing what changed.</p>
        </div>
        <div className="story-list">
          {workflow.map(({ index, icon: Icon, title, text, action, next }) => <article className="story-step" data-story-step key={index}>
            <div className="story-number">{index}</div>
            <div className="story-icon"><Icon size={19} /></div>
            <div className="story-copy"><h3>{title}</h3><p>{text}</p></div>
            <EntryLink className="story-link" next={next}>{action} <ArrowRight size={16} /></EntryLink>
          </article>)}
        </div>
      </section>

      <section id="product" className="landing-section product-section">
        <div className="product-section-inner section-wrap">
          <div className="product-copy" data-reveal>
            <span className="eyebrow">Made for the work behind the sale</span>
            <h2>One connected thread—from the first contact to the next completed task.</h2>
            <p>Customers, leads, pipeline stages, task deadlines, and activity history stay connected through the same real records.</p>
            <div className="product-links">
              <EntryLink next="/app/customers"><UsersRound size={17} /> Customer records <ArrowRight size={15} /></EntryLink>
              <EntryLink next="/app/pipeline"><FolderKanban size={17} /> Sales pipeline <ArrowRight size={15} /></EntryLink>
              <EntryLink next="/app/tasks"><ListChecks size={17} /> Task queue <ArrowRight size={15} /></EntryLink>
            </div>
          </div>
          <div className="thread-scene-frame" data-reveal>
            <span className="thread-scene-label">Relationship thread</span>
            <Suspense fallback={<div className="relationship-scene-fallback" aria-hidden="true"><span /><span /><span /></div>}><RelationshipScene /></Suspense>
            <p>This visual is an abstract guide to how records connect. The CRM itself uses live database records after you sign in.</p>
          </div>
        </div>
      </section>

      <section id="security" className="landing-section security-section section-wrap" data-reveal>
        <div className="security-sign"><ShieldCheck size={26} /></div>
        <div><span className="eyebrow">Built with protected access in mind</span><h2>Real work deserves real controls.</h2><p>CRM360 uses signed sessions, rotating refresh tokens, hashed passwords, validated requests, and role checks on protected API actions.</p></div>
        <Link className="button button-outline" to="/register">Open CRM360 <ArrowRight size={16} /></Link>
      </section>

      <section className="landing-final section-wrap" data-reveal>
        <div className="landing-final-art" aria-hidden="true" />
        <div className="landing-final-copy"><span className="eyebrow">Start with the work in front of you</span><h2>Make the next move clear.</h2><p>Create a workspace, add the first relationship, and give the next follow-up a home.</p><Link className="button button-accent" to="/register">Create your account <ArrowRight size={17} /></Link></div>
      </section>
    </main>

    <footer className="landing-footer section-wrap"><Logo /><span>© 2026 CRM360</span><div><a href="#how-it-works">How it works</a><Link to="/login">Sign in</Link></div></footer>
  </div>
}
