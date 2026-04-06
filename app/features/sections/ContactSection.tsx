import { useMemo, useState } from 'react';
import { Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import { SectionBanner } from '../../components/section/SectionPrimitives';
import { MOCK_RESUME } from '../../data/content';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { ContactFormMediator } from '../../services/contact/ContactFormMediator';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type ContactSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  onNotify: (message: string, level: EventType) => void;
};

export function ContactSection({ currentStyle, labels, onNotify }: ContactSectionProps) {
  const [formState, setFormState] = useState({ email: '', message: '', isSubmitDisabled: true });
  const mediator = useMemo(() => new ContactFormMediator(setFormState, (message, level) => onNotify(message, level)), [onNotify]);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <SectionBanner title={labels.sections.contact} description={labels.sections.contactDesc} currentStyle={currentStyle} className="mb-10" />
      <div className={`${currentStyle.getCardClass()} p-8 md:p-12 shadow-2xl overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-100 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold dark:text-white flex items-center gap-2">
              <MessageSquare className="text-blue-500" /> Let`s Connect
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">I`m always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-blue-500">
                  <Mail size={18} />
                </div>
                <span>{MOCK_RESUME.contact.email}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-green-500">
                  <MapPin size={18} />
                </div>
                <span>{MOCK_RESUME.contact.location}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={formState.email}
                  onChange={(event) => mediator.email.setValue(event.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    formState.email.length > 0 && !formState.email.includes('@')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  } bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                rows={4}
                value={formState.message}
                onChange={(event) => mediator.message.setValue(event.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>
            <button
              onClick={() => mediator.submitButton.click()}
              disabled={formState.isSubmitDisabled}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${currentStyle.getButtonClass('primary')}`}
            >
              <Send size={18} /> {labels.actions.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
