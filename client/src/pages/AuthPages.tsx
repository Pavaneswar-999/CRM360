import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, type UseFormRegister } from 'react-hook-form'
import axios from 'axios'
import { ArrowRight, Check, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Field } from '../components/FormField'
import { api, request } from '../api'
import { useAuth } from '../auth'

function authError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'CRM360 API is offline. Start the API and MongoDB, then try again.'
    return error.response.data?.error || fallback
  }
  return fallback
}

function AuthLayout({ title, intro, children, side = true }: { title: string; intro: string; children: React.ReactNode; side?: boolean }) {
  return <div className="auth-page">
    <div className="auth-panel">
      <div className="auth-panel-top"><Logo /><Link className="auth-back-link" to="/">Back to overview</Link></div>
      <div className="auth-copy"><span className="eyebrow">Workspace access</span><h1>{title}</h1><p>{intro}</p></div>
      {children}
    </div>
    {side && <div className="auth-aside">
      <div className="auth-aside-top"><span className="eyebrow">The operating layer for follow-through</span><span className="auth-status"><i /> Live workspace pattern</span></div>
      <div className="auth-product-preview" aria-label="CRM360 focus queue preview">
        <div className="auth-preview-head"><div><span className="eyebrow">Today</span><strong>Focus queue</strong></div><span className="auth-preview-count">05</span></div>
        <div className="auth-preview-row auth-preview-row-alert"><span className="auth-preview-mark">!</span><div><strong>Follow up on proposal</strong><small>Northstar Studio · 1 day late</small></div><b>Now</b></div>
        <div className="auth-preview-row"><span className="auth-preview-mark auth-preview-mark-blue"><Check size={13} /></span><div><strong>Confirm buying committee</strong><small>Greenline Logistics · Qualified</small></div><b>Fri</b></div>
        <div className="auth-preview-row"><span className="auth-preview-mark auth-preview-mark-green"><Check size={13} /></span><div><strong>Review renewal health</strong><small>Coregrid Labs · Customer</small></div><b>Mon</b></div>
        <div className="auth-preview-footer"><span>Ownership is visible</span><span>Next action is never hidden</span></div>
      </div>
      <div className="auth-aside-copy"><span className="eyebrow">Every relationship. Every next step.</span><h2>Clarity for the work between the meetings.</h2><p>CRM360 connects the person, conversation, opportunity, task, and outcome so the team can act with context.</p><div className="auth-capabilities"><span><Check size={14} /> Customer context</span><span><Check size={14} /> Pipeline momentum</span><span><Check size={14} /> Permission-aware work</span></div></div>
    </div>}
  </div>
}

function PasswordInput({ register, name, label }: { register: UseFormRegister<any>; name: string; label: string }) {
  const [show, setShow] = useState(false)
  return <Field label={label} required><div className="password-field"><input aria-label={label} autoComplete={name === 'password' ? 'current-password' : 'new-password'} minLength={8} type={show ? 'text' : 'password'} {...register(name, { required: `${label} is required`, minLength: { value: 8, message: 'Use at least 8 characters' } })} /><button type="button" className="icon-button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></Field>
}

export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting, errors }, setError } = useForm<{ email: string; password: string }>()
  const { login } = useAuth(); const navigate = useNavigate()
  const onSubmit = async (data: { email: string; password: string }) => { try { await login(data.email, data.password); navigate('/app') } catch (error) { setError('root', { message: authError(error, 'Unable to sign in. Check your details.') }) } }
  return <AuthLayout title="Welcome back" intro="Sign in to see what needs your attention today."><form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
    <Field label="Work email" error={errors.email?.message} required><div className="input-with-icon"><Mail size={16} /><input type="email" autoComplete="email" placeholder="you@company.com" {...register('email', { required: 'Your email is required' })} /></div></Field>
    <PasswordInput register={register} name="password" label="Password" />
    {errors.root && <div className="form-error" role="alert" aria-live="polite">{errors.root.message}</div>}
    <button className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} /></button>
    <div className="auth-links"><Link to="/forgot-password">Forgot password?</Link><span>New to CRM360? <Link to="/register">Create an account</Link></span></div>
  </form></AuthLayout>
}

export function RegisterPage() {
  const { register, handleSubmit, formState: { isSubmitting, errors }, setError } = useForm<{ name: string; email: string; password: string }>()
  const { register: signUp } = useAuth(); const navigate = useNavigate()
  const onSubmit = async (data: { name: string; email: string; password: string }) => { try { await signUp(data.name, data.email, data.password); navigate('/app') } catch (error) { setError('root', { message: authError(error, 'Unable to create your account.') }) } }
  return <AuthLayout title="Start with clarity" intro="Create a workspace for the relationships and follow-ups your team cannot afford to lose."><form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
    <Field label="Full name" error={errors.name?.message} required><input autoComplete="name" placeholder="Your name" {...register('name', { required: 'Your name is required', minLength: { value: 2, message: 'Use at least 2 characters' } })} /></Field>
    <Field label="Work email" error={errors.email?.message} required><input type="email" autoComplete="email" placeholder="you@company.com" {...register('email', { required: 'Your email is required' })} /></Field>
    <PasswordInput register={register} name="password" label="Password" />
    <p className="password-hint"><ShieldCheck size={15} /> Use at least 8 characters.</p>
    {errors.root && <div className="form-error" role="alert" aria-live="polite">{errors.root.message}</div>}
    <button className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Creating workspace...' : 'Create account'} <ArrowRight size={17} /></button>
    <p className="auth-footnote">By continuing, you agree to use CRM360 with accurate, permissioned data.</p>
    <div className="auth-links"><span>Already have an account? <Link to="/login">Sign in</Link></span></div>
  </form></AuthLayout>
}

export function ForgotPasswordPage() { const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string }>(); const [result, setResult] = useState<{ message: string; resetToken?: string } | null>(null); const [error, setError] = useState(''); const onSubmit = async (data: { email: string }) => { try { setError(''); const response = await request<{ message: string; resetToken?: string }>(api.post('/auth/forgot-password', data)); setResult(response) } catch (e) { setError(authError(e, 'Unable to create a reset flow.')) } }; return <AuthLayout title="Reset your password" intro="We’ll help you get back into your workspace securely."><form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>{result ? <div className="success-panel"><KeyRound size={22} /><strong>{result.message}</strong>{result.resetToken && <><p>Development reset token:</p><code>{result.resetToken}</code><Link className="button button-primary" to={`/reset-password?token=${result.resetToken}`}>Continue to reset <ArrowRight size={16} /></Link></>}</div> : <><Field label="Work email" required><input type="email" autoComplete="email" placeholder="you@company.com" {...register('email', { required: true })} /></Field>{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Creating reset flow...' : 'Create reset flow'} <ArrowRight size={17} /></button></>}<div className="auth-links"><Link to="/login">Back to sign in</Link></div></form></AuthLayout> }

export function ResetPasswordPage() { const [params] = useSearchParams(); const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ token: string; password: string }>({ defaultValues: { token: params.get('token') || '' } }); const [done, setDone] = useState(false); const [error, setError] = useState(''); const onSubmit = async (data: { token: string; password: string }) => { try { await request(api.post('/auth/reset-password', data)); setDone(true) } catch (e) { setError(authError(e, 'The reset link is invalid or expired.')) } }; return <AuthLayout title="Choose a new password" intro="Set a fresh password and return to the work that matters."><form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>{done ? <div className="success-panel"><LockKeyhole size={22} /><strong>Password updated.</strong><p>Your account is ready. Sign in with your new password.</p><Link className="button button-primary" to="/login">Go to sign in <ArrowRight size={16} /></Link></div> : <><Field label="Reset token" required><input {...register('token', { required: true })} /></Field><PasswordInput register={register} name="password" label="New password" />{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update password'} <ArrowRight size={17} /></button></>}</form></AuthLayout> }
