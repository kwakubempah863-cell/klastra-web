import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { registerSchool } from '../services/schoolRequests';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const regions = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  schoolName: string;
  schoolRegion: string;
  schoolCity: string;
  studentCount: string;
  agreedToTerms: boolean;
};

type FormField = keyof FormState;

const initialForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  schoolName: '',
  schoolRegion: '',
  schoolCity: '',
  studentCount: '',
  agreedToTerms: false,
};

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10';

export default function Register() {
  useDocumentTitle(
    'Register your school — Klastra',
    'Register your school on Klastra and start managing attendance, scores, and parent communication.',
  );
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = <K extends FormField>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const nextErrors: Partial<Record<FormField, string>> = {};

    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!form.phone.trim()) nextErrors.phone = 'Phone is required.';
    else if (!/^\+?233[0-9]{9}$|^0[0-9]{9}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Use a valid Ghanaian phone number.';
    }
    if (!form.password) nextErrors.password = 'Password is required.';
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (!form.schoolName.trim()) nextErrors.schoolName = 'School name is required.';
    if (!form.schoolRegion) nextErrors.schoolRegion = 'Select a region.';
    if (!form.schoolCity.trim()) nextErrors.schoolCity = 'City is required.';
    if (
      form.studentCount &&
      (!Number.isInteger(Number(form.studentCount)) || Number(form.studentCount) < 1)
    ) {
      nextErrors.studentCount = 'Enter a valid number of students.';
    }
    if (!form.agreedToTerms) nextErrors.agreedToTerms = 'You must agree before creating an account.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await registerSchool({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        schoolName: form.schoolName.trim(),
        schoolRegion: form.schoolRegion,
        schoolCity: form.schoolCity.trim(),
        studentCount: form.studentCount ? Number(form.studentCount) : undefined,
      });
      navigate('/register/pending');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Unable to register your school right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mesh-bg mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl bg-[#0F172A]">
          <div className="glass-dark h-full rounded-3xl p-8 text-white">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
              School registration
            </div>
            <h1 className="mt-5 text-3xl font-black md:text-4xl">Register your school</h1>
            <p className="mt-3 text-sm leading-relaxed text-sky-100/80">
              Create your school account and start the verification process. We&apos;ll guide you through each next step.
            </p>
            <div className="mt-8 space-y-4 text-sm text-sky-100/80">
              {[
                "We'll review your application within 24 hours",
                'Upload your verification documents next',
                "You'll receive an email when approved",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="text-[#22A06B]" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="glass-medium rounded-3xl border p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <h2 className="text-xl font-bold text-slate-900">Headmaster information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-semibold text-slate-700">Full name</label>
                <input id="fullName" autoComplete="name" value={form.fullName} onChange={(event) => handleChange('fullName', event.target.value)} className={inputClassName} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'fullName-error' : undefined} />
                {errors.fullName && <p id="fullName-error" role="alert" className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
                <input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => handleChange('email', event.target.value)} className={inputClassName} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-slate-700">Phone</label>
                <input id="phone" type="tel" autoComplete="tel" placeholder="024 000 0000" value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} className={inputClassName} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} />
                {errors.phone && <p id="phone-error" role="alert" className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={(event) => handleChange('password', event.target.value)} className={`${inputClassName} pr-16`} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute inset-y-0 right-3 min-h-11 px-1 text-xs font-semibold text-slate-600">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p id="password-error" role="alert" className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>
            </div>

            <h2 className="pt-2 text-xl font-bold text-slate-900">School information</h2>
            <div>
              <label htmlFor="schoolName" className="mb-1 block text-sm font-semibold text-slate-700">School name</label>
              <input id="schoolName" autoComplete="organization" value={form.schoolName} onChange={(event) => handleChange('schoolName', event.target.value)} className={inputClassName} aria-invalid={Boolean(errors.schoolName)} aria-describedby={errors.schoolName ? 'schoolName-error' : undefined} />
              {errors.schoolName && <p id="schoolName-error" role="alert" className="mt-1 text-xs text-red-600">{errors.schoolName}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="schoolRegion" className="mb-1 block text-sm font-semibold text-slate-700">Region</label>
                <select id="schoolRegion" value={form.schoolRegion} onChange={(event) => handleChange('schoolRegion', event.target.value)} className={inputClassName} aria-invalid={Boolean(errors.schoolRegion)} aria-describedby={errors.schoolRegion ? 'schoolRegion-error' : undefined}>
                  <option value="">Select a region</option>
                  {regions.map((region) => <option key={region} value={region}>{region}</option>)}
                </select>
                {errors.schoolRegion && <p id="schoolRegion-error" role="alert" className="mt-1 text-xs text-red-600">{errors.schoolRegion}</p>}
              </div>
              <div>
                <label htmlFor="schoolCity" className="mb-1 block text-sm font-semibold text-slate-700">City</label>
                <input id="schoolCity" autoComplete="address-level2" value={form.schoolCity} onChange={(event) => handleChange('schoolCity', event.target.value)} className={inputClassName} aria-invalid={Boolean(errors.schoolCity)} aria-describedby={errors.schoolCity ? 'schoolCity-error' : undefined} />
                {errors.schoolCity && <p id="schoolCity-error" role="alert" className="mt-1 text-xs text-red-600">{errors.schoolCity}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="studentCount" className="mb-1 block text-sm font-semibold text-slate-700">Number of students <span className="font-normal text-slate-500">(optional)</span></label>
              <input id="studentCount" type="number" min="1" step="1" placeholder="e.g. 250" value={form.studentCount} onChange={(event) => handleChange('studentCount', event.target.value)} className={inputClassName} aria-invalid={Boolean(errors.studentCount)} aria-describedby={errors.studentCount ? 'studentCount-error' : undefined} />
              {errors.studentCount && <p id="studentCount-error" role="alert" className="mt-1 text-xs text-red-600">{errors.studentCount}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input id="agreedToTerms" type="checkbox" checked={form.agreedToTerms} onChange={(event) => handleChange('agreedToTerms', event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#2563EB]" aria-invalid={Boolean(errors.agreedToTerms)} aria-describedby={errors.agreedToTerms ? 'agreedToTerms-error' : undefined} />
                <span>
                  I agree to the <Link to="/terms" className="font-semibold text-[#2563EB] underline">Terms of Service</Link> and <Link to="/privacy" className="font-semibold text-[#2563EB] underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreedToTerms && <p id="agreedToTerms-error" role="alert" className="mt-1 text-xs text-red-600">{errors.agreedToTerms}</p>}
            </div>

            {serverError && <p role="alert" className="text-sm text-red-600">{serverError}</p>}

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
