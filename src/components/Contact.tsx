import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  AlertCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';

interface ContactProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    onShowToast('success', 'Copied to Clipboard!', `${label} (${text}) copied.`);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setErrorMsg('Please write a message of at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      onShowToast('success', 'Message Sent!', 'Thank you! Prince will get back to you shortly.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      setTimeout(() => setIsSuccess(false), 5000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Contact <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Prince</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl">
            Have an internship, project collaboration, or software engineering opportunity? Feel free to reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Info & Links */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Email Address</span>
                  <a 
                    href={`mailto:${personalInfo.email}`} 
                    className="block text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <button
                onClick={() => handleCopy(personalInfo.email, 'Email')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Email"
                aria-label="Copy Email address"
              >
                {copiedItem === 'Email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Phone & WhatsApp</span>
                  <a 
                    href={`tel:${personalInfo.phone}`} 
                    className="block text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors font-mono"
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>

              <button
                onClick={() => handleCopy(personalInfo.phone, 'Phone')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Phone"
                aria-label="Copy Phone number"
              >
                {copiedItem === 'Phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* LinkedIn Card */}
            <a
              href="https://www.linkedin.com/in/prince-gupta-b115582b8/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-600/30 text-blue-400">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">LinkedIn Profile</span>
                  <span className="block text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    in/prince-gupta-b115582b8
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>

            {/* GitHub Card */}
            <a
              href="https://github.com/prince-gupta7"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">GitHub Profile</span>
                  <span className="block text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    github.com/prince-gupta7
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>

            {/* Location Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex items-center gap-4">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Location</span>
                <span className="block text-sm font-semibold text-white">
                  Batraha Saharsa, Bihar - 852201, India
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl relative">
              
              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>Send a Direct Message</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Fill out the form below to reach out directly.
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isSuccess && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Message sent successfully! Prince will respond promptly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5" htmlFor="contact-name">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5" htmlFor="contact-email">
                      Your Email *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5" htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="e.g. Internship Opportunity / Project Collaboration"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-mono uppercase text-slate-300" htmlFor="contact-message">
                      Message *
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formData.message.length}/500 chars
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    maxLength={500}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
