import React, { useState } from 'react';
import { Button, Avatar, Badge, StarRating } from '../components/ui';
import { tutors } from '../data/mockData';

const STEPS = ['Select Tutor', 'Subject', 'Date', 'Time', 'Review', 'Payment', 'Confirmation'];

const times = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
const dates = ['Mon 28 Sep', 'Tue 29 Sep', 'Wed 30 Sep', 'Thu 1 Oct', 'Fri 2 Oct', 'Sat 3 Oct'];

export default function BookingFlow({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [step, setStep] = useState(0);
  const [selectedTutor, setSelectedTutor] = useState(tutors[0]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [momoNumber, setMomoNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const subtotal = (selectedTutor.rate * duration) / 60;
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1); };
  const back = () => { if (step > 0) setStep(s => s - 1); };

  const processPayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => setPaymentStatus('success'), 2000);
    next();
  };

  return (
    <div className="fade-in min-h-full bg-slate-50 p-5 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-[#0fb568] text-white' : i === step ? 'bg-[#1b3d7e] text-white' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`hidden sm:block text-[10px] font-medium ${i === step ? 'text-[#1b3d7e]' : 'text-slate-400'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-[#0fb568]' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl card-shadow p-6">
          {/* Step 0: Select Tutor */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 mb-1">Choose a Tutor</h2>
              <p className="text-slate-500 text-sm mb-5">Select the tutor you'd like to book a session with</p>
              <div className="space-y-3">
                {tutors.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTutor(t)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTutor?.id === t.id ? 'border-[#1b3d7e] bg-[#eef2fb]' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <Avatar src={t.avatar} name={t.name} size={48} online={t.available} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900">{t.name}</div>
                      <div className="text-sm text-slate-500">{t.subjects.join(', ')}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={t.rating} size={12} />
                        <span className="text-xs text-slate-500">({t.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#1b3d7e]">GH₵{t.rate}/hr</div>
                      {t.verified && <Badge label="Verified" color="teal" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Subject */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 mb-1">Select Subject</h2>
              <p className="text-slate-500 text-sm mb-5">Which subject would you like help with?</p>
              <div className="grid grid-cols-2 gap-3">
                {selectedTutor.subjects.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubject(s)}
                    className={`p-4 rounded-xl border-2 text-left font-semibold transition-all ${selectedSubject === s ? 'border-[#1b3d7e] bg-[#eef2fb] text-[#1b3d7e]' : 'border-slate-100 text-slate-700 hover:border-slate-200'}`}
                  >
                    📚 {s}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <label className="text-sm font-semibold text-slate-700 block mb-2">Session Duration</label>
                <div className="flex gap-3">
                  {[45, 60, 90, 120].map(d => (
                    <button key={d} onClick={() => setDuration(d)} className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${duration === d ? 'border-[#1b3d7e] bg-[#eef2fb] text-[#1b3d7e]' : 'border-slate-100 text-slate-600 hover:border-slate-200'}`}>
                      {d} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 mb-1">Select Date</h2>
              <p className="text-slate-500 text-sm mb-5">Choose a date for your session</p>
              <div className="grid grid-cols-3 gap-3">
                {dates.map(d => (
                  <button key={d} onClick={() => setSelectedDate(d)} className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all ${selectedDate === d ? 'border-[#1b3d7e] bg-[#eef2fb] text-[#1b3d7e]' : 'border-slate-100 text-slate-700 hover:border-slate-200'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Time */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 mb-1">Select Time</h2>
              <p className="text-slate-500 text-sm mb-5">Pick an available time slot for {selectedDate}</p>
              <div className="grid grid-cols-3 gap-3">
                {times.map((t, i) => {
                  const unavail = i === 2 || i === 5;
                  return (
                    <button
                      key={t}
                      onClick={() => !unavail && setSelectedTime(t)}
                      disabled={unavail}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${unavail ? 'border-slate-100 text-slate-300 cursor-not-allowed' : selectedTime === t ? 'border-[#1b3d7e] bg-[#eef2fb] text-[#1b3d7e]' : 'border-slate-100 text-slate-700 hover:border-slate-200'}`}
                    >
                      {t}
                      {unavail && <div className="text-[10px] text-slate-300 font-normal">Booked</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 mb-5">Review Booking</h2>
              <div className="bg-slate-50 rounded-xl p-5 space-y-3 mb-5">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar src={selectedTutor.avatar} name={selectedTutor.name} size={52} />
                  <div>
                    <div className="font-bold text-slate-900">{selectedTutor.name}</div>
                    <div className="text-sm text-slate-500">{selectedTutor.qualifications}</div>
                  </div>
                </div>
                {[
                  ['Subject', selectedSubject],
                  ['Date', selectedDate],
                  ['Time', selectedTime],
                  ['Duration', `${duration} minutes`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-semibold text-slate-900">{v}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-3 mt-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span>GH₵{subtotal.toFixed(0)}</span></div>
                  <div className="flex justify-between text-sm mt-1"><span className="text-slate-500">Platform fee (5%)</span><span>GH₵{fee.toFixed(0)}</span></div>
                  <div className="flex justify-between font-bold text-[#1b3d7e] mt-2 pt-2 border-t border-slate-200">
                    <span>Total</span><span>GH₵{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 mb-1">Payment</h2>
              <p className="text-slate-500 text-sm mb-5">Pay securely via Mobile Money</p>
              <div className="bg-[#eef2fb] rounded-xl p-4 mb-5 flex justify-between items-center">
                <span className="text-sm text-slate-600">Amount to pay</span>
                <span className="text-xl font-bold font-display text-[#1b3d7e]">GH₵{total.toFixed(0)}</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['MTN MoMo', 'Vodafone Cash', 'AirtelTigo'].map((m, i) => (
                      <button key={m} className={`p-3 rounded-xl border-2 text-xs font-semibold text-center transition-all ${i === 0 ? 'border-[#f07a22] bg-[#fff8ec] text-[#d45f10]' : 'border-slate-100 text-slate-600'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Mobile Money Number</label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={e => setMomoNumber(e.target.value)}
                    placeholder="e.g. 0541234567"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 focus:border-[#1b3d7e]"
                  />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-3">
                  <span className="text-amber-500 text-lg">ℹ️</span>
                  <p className="text-xs text-amber-800">You'll receive a payment prompt on your phone. Approve it to complete your booking.</p>
                </div>
              </div>
              <Button fullWidth className="mt-5" variant="secondary" size="lg" onClick={processPayment}>
                Pay GH₵{total.toFixed(0)} via Mobile Money
              </Button>
            </div>
          )}

          {/* Step 6: Confirmation */}
          {step === 6 && (
            <div className="text-center py-6">
              {paymentStatus === 'processing' && (
                <>
                  <div className="w-20 h-20 rounded-full bg-[#fff8ec] flex items-center justify-center text-4xl mx-auto mb-4 animate-pulse">💳</div>
                  <h2 className="text-xl font-bold font-display text-slate-900 mb-2">Processing Payment...</h2>
                  <p className="text-slate-500 text-sm">Please approve the prompt on your phone</p>
                </>
              )}
              {paymentStatus === 'success' && (
                <>
                  <div className="w-20 h-20 rounded-full bg-[#edfdf5] flex items-center justify-center text-4xl mx-auto mb-4">✅</div>
                  <h2 className="text-xl font-bold font-display text-[#0a7244] mb-2">Booking Confirmed!</h2>
                  <p className="text-slate-500 text-sm mb-6">Your session with <strong>{selectedTutor.name}</strong> is booked for <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong></p>
                  <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2 mb-6">
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Subject</span><span className="font-semibold">{selectedSubject}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Amount paid</span><span className="font-semibold text-[#0a7244]">GH₵{total.toFixed(0)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Payment ref</span><span className="font-semibold text-xs">TK-2026-{Math.random().toString(36).slice(2,8).toUpperCase()}</span></div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" fullWidth onClick={() => onNavigate('student-sessions')}>View Sessions</Button>
                    <Button fullWidth onClick={() => onNavigate('student-dashboard')}>Go to Dashboard</Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation */}
          {step < 6 && (
            <div className="flex justify-between mt-6 pt-5 border-t border-slate-100">
              <Button variant="outline" onClick={back} disabled={step === 0}>← Back</Button>
              {step < 5 ? (
                <Button onClick={next} disabled={(step === 1 && !selectedSubject) || (step === 2 && !selectedDate) || (step === 3 && !selectedTime)}>
                  Continue →
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
