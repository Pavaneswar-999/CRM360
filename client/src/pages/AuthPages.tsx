import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useForm, type UseFormRegister } from 'react-hook-form'
import axios from 'axios'
import { ArrowRight, Check, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Logo } from '../components/Logo'
import { PageTransition } from '../components/PageTransition'
import { Field } from '../components/FormField'
import { api, request } from '../api'
import { useAuth } from '../auth'

function authError(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'We could not reach the service. Please try again shortly.'
    return error.response.data?.error || fallback
  }
  return fallback
}

function AuthLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <div className="auth-page">
    <div className="auth-backdrop" aria-hidden="true" />
    <header className="auth-header"><Logo /><Link className="auth-back-link" to="/">Back to home</Link></header>
    <PageTransition className="auth-stage">
      <aside className="auth-brief" aria-label="About CRM360">
        <span className="signal-kicker"><i /> CRM360 relationship workspace</span>
        <h2>Keep the work between conversations from disappearing.</h2>
        <p>One place for customer context, open opportunities, and the follow-up that should happen next.</p>
        <ul>
          <li><Check size={15} /> Customer and lead records</li>
          <li><Check size={15} /> Tasks with dates and priorities</li>
          <li><Check size={15} /> Role-based access</li>
        </ul>
      </aside>
      <section className="auth-panel" aria-labelledby="auth-title">
        <span className="eyebrow">Secure workspace access</span>
        <h1 id="auth-title">{title}</h1>
        <p>{intro}</p>
        {children}
      </section>
    </PageTransition>
  </div>
}

function PasswordInput({ register, name, label }: { register: UseFormRegister<any>; name: string; label: string }) {
  const [show, setShow] = useState(false)
  return <Field label={label} required><div className="password-field"><input aria-label={label} autoComplete={name === 'password' ? 'current-password' : 'new-password'} minLength={8} type={show ? 'text' : 'password'} {...register(name, { required: `${label} is required`, minLength: { value: 8, message: 'Use at least 8 characters' } })} /><button type="button" className="icon-button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></Field>
}

export function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting, errors }, setError } = useForm<{ email: string; password: string }>()
  const { login } = useAuth()
  const navigate = useNavigate()
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password)
      navigate('/app')
    } catch (error) {
      setError('root', { message: authError(error, 'Unable to sign in. Check your email and password.') })
    }
  }

  return <AuthLayout title="Welcome back" intro="Sign in to pick up the customer work that needs your attention."><form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
    <Field label="Work email" error={errors.email?.message} required><div className="input-with-icon"><Mail size={16} /><input type="email" autoComplete="email" placeholder="you@company.com" {...register('email', { required: 'Your email is required' })} /></div></Field>
    <PasswordInput register={register} name="password" label="Password" />
    {errors.root && <div className="form-error" role="alert" aria-live="polite">{errors.root.message}</div>}
    <button className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} /></button>
    <div className="auth-links"><Link to="/forgot-password">Forgot password?</Link><span>New to CRM360? <Link to="/register">Create an account</Link></span></div>
  </form></AuthLayout>
}

export function RegisterPage() {
  const { register, handleSubmit, formState: { isSubmitting, errors }, setError } = useForm<{ name: string; email: string; password: string }>()
  const { register: signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const requestedNext = params.get('next')
  const nextPath = ['/app/pipeline', '/app/customers', '/app/leads', '/app/tasks'].includes(requestedNext || '') ? requestedNext! : '/app'
  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    try {
      await signUp(data.name, data.email, data.password)
      navigate(nextPath)
    } catch (error) {
      setError('root', { message: authError(error, 'Unable to create your account.') })
    }
  }

  return <AuthLayout title="Create your account" intro="Start keeping customer relationships, sales opportunities, and follow-up work in one place."><form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
    <Field label="Full name" error={errors.name?.message} required><input autoComplete="name" placeholder="Your name" {...register('name', { required: 'Your name is required', minLength: { value: 2, message: 'Use at least 2 characters' } })} /></Field>
    <Field label="Work email" error={errors.email?.message} required><input type="email" autoComplete="email" placeholder="you@company.com" {...register('email', { required: 'Your email is required' })} /></Field>
    <PasswordInput register={register} name="password" label="Password" />
    <p className="password-hint"><ShieldCheck size={15} /> Use at least 8 characters.</p>
    {errors.root && <div className="form-error" role="alert" aria-live="polite">{errors.root.message}</div>}
    <button className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'} <ArrowRight size={17} /></button>
    <p className="auth-footnote">Use CRM360 only with data you are authorised to manage.</p>
    <div className="auth-links"><span>Already have an account? <Link to="/login">Sign in</Link></span></div>
  </form></AuthLayout>
}

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string }>()
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const onSubmit = async (data: { email: string }) => {
    try {
      setError('')
      const response = await request<{ message: string }>(api.post('/auth/forgot-password', data))
      setMessage(response.message)
      setSent(true)
    } catch (requestError) {
      setError(authError(requestError, 'Unable to start password reset.'))
    }
  }

  return <AuthLayout title="Reset your password" intro="Enter your email address and we will send instructions if it belongs to an account."><form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>{sent ? <div className="success-panel"><KeyRound size={22} /><strong>Check your inbox.</strong><p>{message}</p><Link className="button button-primary" to="/login">Back to sign in <ArrowRight size={16} /></Link></div> : <><Field label="Work email" required><input type="email" autoComplete="email" placeholder="you@company.com" {...register('email', { required: true })} /></Field>{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send reset instructions'} <ArrowRight size={17} /></button></>}<div className="auth-links"><Link to="/login">Back to sign in</Link></div></form></AuthLayout>
}

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ token: string; password: string }>({ defaultValues: { token: params.get('token') || '' } })
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const onSubmit = async (data: { token: string; password: string }) => {
    try {
      await request(api.post('/auth/reset-password', data))
      setDone(true)
    } catch (requestError) {
      setError(authError(requestError, 'That reset link is invalid or expired.'))
    }
  }

  return <AuthLayout title="Choose a new password" intro="Set a new password, then return to your CRM360 workspace."><form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>{done ? <div className="success-panel"><LockKeyhole size={22} /><strong>Password updated.</strong><p>Your account is ready. Sign in with your new password.</p><Link className="button button-primary" to="/login">Go to sign in <ArrowRight size={16} /></Link></div> : <><Field label="Reset token" required><input {...register('token', { required: true })} /></Field><PasswordInput register={register} name="password" label="New password" />{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-primary button-full" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update password'} <ArrowRight size={17} /></button></>}</form></AuthLayout>
}
