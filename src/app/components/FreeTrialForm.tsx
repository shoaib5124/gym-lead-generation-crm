"use client"
import React, { useState } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { FreeTrialFormData } from '../types';

export const FreeTrialForm: React.FC = () => {
  const [formData, setFormData] = useState<FreeTrialFormData>({
    fullName: '',
    email: '',
    fitnessGoal: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.fullName || !formData.email || !formData.fitnessGoal) {
    return;
  }

  try {
    const response = await fetch("/api/freeTrial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        purpose: formData.fitnessGoal,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    console.log("Success:", data);

    setIsSubmitted(true);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

  const handleReset = () => {
    setFormData({ fullName: '', email: '', fitnessGoal: '' });
    setIsSubmitted(false);
  };

  return (
    <section
      id="trial"
      className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto w-full relative"
    >
      {/* Lead Form Card */}
      <div className="bg-zinc-900/50 p-8 sm:p-12 md:p-14 border border-white/10 relative overflow-hidden isolate shadow-2xl max-w-2xl mx-auto">
        {/* Subtle decorative glow in top-right */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col gap-2 mb-10 text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-lime-400">
            GET STARTED
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            Claim Your Free Trial
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md mx-auto">
            Experience the IronForge standard for yourself. No commitment required.
          </p>
        </div>

        {isSubmitted ? (
          <div
            id="form-success-message"
            className="flex flex-col items-center justify-center text-center py-8 gap-4"
          >
            <div className="w-14 h-14 bg-lime-400 text-black flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-7 h-7 stroke-[3]" />
            </div>
            <h3 className="font-black text-2xl uppercase tracking-tight text-white">
              Trial Pass Reserved
            </h3>
            <p className="text-sm text-zinc-400 max-w-md">
              We&apos;ve sent your VIP trial pass to{' '}
              <span className="text-lime-400 font-bold">
                {formData.email}
              </span>
              . Our head trainer will reach out to confirm your session.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 text-xs font-black text-zinc-400 hover:text-lime-400 uppercase tracking-widest underline cursor-pointer"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form
            id="free-trial-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 max-w-xl mx-auto"
          >
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="full-name"
                className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-zinc-400"
              >
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="John Doe"
                className="w-full bg-black/50 border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-lime-400 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email-address"
                className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-zinc-400"
              >
                Email Address
              </label>
              <input
                id="email-address"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
                className="w-full bg-black/50 border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-lime-400 transition-colors"
              />
            </div>

            {/* Fitness Goal */}
            <div className="flex flex-col gap-2 relative">
              <label
                htmlFor="fitness-goal"
                className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-zinc-400"
              >
                Fitness Goal
              </label>
              <div className="relative">
                <select
                  id="fitness-goal"
                  required
                  value={formData.fitnessGoal}
                  onChange={(e) =>
                    setFormData({ ...formData, fitnessGoal: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 px-4 py-3.5 text-sm text-white outline-none focus:border-lime-400 appearance-none transition-colors cursor-pointer"
                >
                  <option value="" disabled className="bg-black text-zinc-500">
                    Select a fitness goal
                  </option>
                  <option value="strength" className="bg-black text-white">
                    Build Strength
                  </option>
                  <option value="weight-loss" className="bg-black text-white">
                    Weight Loss
                  </option>
                  <option value="endurance" className="bg-black text-white">
                    Improve Endurance
                  </option>
                  <option value="general" className="bg-black text-white">
                    General Fitness
                  </option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="trial-submit-btn"
              type="submit"
              className="mt-2 w-full bg-lime-400 text-black py-4 font-black uppercase text-xs sm:text-sm tracking-widest hover:bg-white active:scale-[0.98] transition-colors cursor-pointer text-center"
            >
              Activate Access
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
