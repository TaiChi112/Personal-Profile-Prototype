import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface ResumeLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; company: string; email: string }) => Promise<void>;
}

export function ResumeLeadModal({ isOpen, onClose, onSubmit }: ResumeLeadModalProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) {
      setError('Name and Company are required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ name, company, email });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#111317] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Before you download...</h2>
          <p className="text-sm text-white/70 mb-6">
            Please let me know who you are and where you are from. This helps me track interest in my profile!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                disabled={isSubmitting}
              />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-white/90 font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing...
                  </>
                ) : (
                  'Download PDF'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
