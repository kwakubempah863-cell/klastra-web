import { useMemo, useState } from 'react';
import { Button } from '../components/ui';
import { submitDemoRequest } from '../services/demoRequests';

type FormState = {
  fullName: string;
  schoolName: string;
  role: string;
  email: string;
  phone: string;
  studentCount: string;
  message: string;
};

const initialForm: FormState = {
  fullName: '',
  schoolName: '',
  role: 'Headmaster/Headmistress',
  email: '',
  phone: '',
  studentCount: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidPhone = useMemo(() => /^\+?233[0-9]{9}$|^0[0-9]{9}$/.test(form.phone.trim()), [form.phone]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!form.schoolName.trim()) nextErrors.schoolName = 'School name is required.';
    if (!form.role.trim()) nextErrors.role = 'Role is required.';
    if (!form.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (!form.phone.trim()) nextErrors.phone = 'Phone is required.';
    else if (!isValidPhone) nextErrors.phone = 'Use a valid Ghanaian phone number.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitDemoRequest({
        fullName: form.fullName.trim(),
        schoolName: form.schoolName.trim(),
        role: form.role,
        email: form.email.trim(),
        phone: form.phone.trim(),
        studentCount: form.studentCount ? Number(form.studentCount) : undefined,
        message: form.message.trim() || undefined,
      });

      setIsSubmitted(true);
      setForm(initialForm);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Unable to submit your request right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl bg-[#0F172A] p-8 text-white">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">Pilot schools</div>
          <h1 className="mt-5 text-3xl font-black md:text-4xl">Request a demo</h1>
          <p className="mt-3 text-sm leading-relaxed text-sky-100/80">
            We will walk your school through the app, set up the first class, and show you exactly how attendance, scores, and parent updates work in practice.
          </p>
          <div className="mt-8 space-y-4 text-sm text-sky-100/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold text-white">What happens next</div>
              <div className="mt-2">We review your school details and contact you within 24 hours.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold text-white">Pilot support</div>
              <div className="mt-2">We help with first-class setup, class setup, and teacher onboarding on site.</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {isSubmitted ? (
            <div className="flex h-full min-h-[320px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF5] text-3xl">✓</div>
                <h2 className="mt-5 text-2xl font-black text-slate-900">Thanks — we&apos;ll reach out within 24 hours.</h2>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Full name</label>
                  <input value={form.fullName} onChange={(event) => handleChange('fullName', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10" />
                  {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">School name</label>
                  <input value={form.schoolName} onChange={(event) => handleChange('schoolName', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10" />
                  {errors.schoolName && <p className="mt-1 text-xs text-red-600">{errors.schoolName}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
                  <select value={form.role} onChange={(event) => handleChange('role', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10">
                    <option>Headmaster/Headmistress</option>
                    <option>Administrator</option>
                    <option>Teacher</option>
                    <option>Parent</option>
                    <option>Other</option>
                  </select>
                  {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Number of students</label>
                  <input type="number" min="1" value={form.studentCount} onChange={(event) => handleChange('studentCount', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10" placeholder="Optional" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
                  <input type="email" value={form.email} onChange={(event) => handleChange('email', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10" />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Phone</label>
                  <input type="tel" value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10" placeholder="024 000 0000" />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Message</label>
                <textarea value={form.message} onChange={(event) => handleChange('message', event.target.value)} rows={5} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#102A43] focus:ring-2 focus:ring-[#102A43]/10" placeholder="Tell us about your school, class sizes, and what you would like to trial." />
              </div>

              {serverError && <p className="text-sm text-red-600">{serverError}</p>}

              <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Request demo'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
