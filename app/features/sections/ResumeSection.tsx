import { useMemo } from 'react';
import { FileCode, FileJson } from 'lucide-react';
import { MOCK_RESUME } from '../../data/content';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { createResumeExporters } from '../../services/content/ResumeExporters';
import type { EventType } from '../../services/system/notification/NotificationBridge';

type ResumeSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  onNotify: (message: string, level: EventType) => void;
};

export function ResumeSection({ currentStyle, labels, onNotify }: ResumeSectionProps) {
  const exporters = useMemo(() => createResumeExporters((message, level) => onNotify(message, level)), [onNotify]);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <div className={`${currentStyle.getCardClass()} p-8 print:shadow-none print:border-none`}>
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>{MOCK_RESUME.name}</h1>
            <h2 className={`text-xl font-medium mb-4 ${currentStyle.name === 'Future' ? 'text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>{MOCK_RESUME.title}</h2>
            <div className="flex flex-col sm:flex-row gap-4 text-gray-500 text-sm">
              <span>{MOCK_RESUME.contact.location}</span>
              <span>{MOCK_RESUME.contact.email}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className={currentStyle.getButtonClass('secondary')}
              onClick={() => exporters.markdown.export(MOCK_RESUME, 'resume-alex-dev')}
              title="Download as Markdown"
            >
              <FileCode size={16} className="inline mr-2" /> {labels.actions.exportMd}
            </button>
            <button
              className={currentStyle.getButtonClass('secondary')}
              onClick={() => exporters.json.export(MOCK_RESUME, 'resume-alex-dev')}
              title="Download as JSON"
            >
              <FileJson size={16} className="inline mr-2" /> {labels.actions.exportJson}
            </button>
          </div>
        </div>
        <div className="mb-8">
          <h3
            className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${
              currentStyle.name === 'Future'
                ? 'text-cyan-400 border-cyan-900'
                : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'
            }`}
          >
            {labels.sections.summary}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{MOCK_RESUME.summary}</p>
        </div>
        <div className="mb-8">
          <h3
            className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${
              currentStyle.name === 'Future'
                ? 'text-cyan-400 border-cyan-900'
                : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'
            }`}
          >
            {labels.sections.experience}
          </h3>
          <div className="space-y-8">
            {MOCK_RESUME.experience.map((experience) => (
              <div key={experience.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">{experience.role}</h4>
                  <span className="text-sm text-gray-500 font-medium">{experience.period}</span>
                </div>
                <div className={`${currentStyle.name === 'Future' ? 'text-purple-400' : 'text-blue-600 dark:text-blue-400'} font-medium mb-3`}>
                  {experience.company}
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-600 dark:text-gray-400">
                  {experience.description.map((description, index) => (
                    <li key={index}>{description}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3
            className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${
              currentStyle.name === 'Future'
                ? 'text-cyan-400 border-cyan-900'
                : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'
            }`}
          >
            {labels.sections.skills}
          </h3>
          <div className="flex flex-wrap gap-2">
            {MOCK_RESUME.skills.map((skill) => (
              <span key={skill} className={currentStyle.getBadgeClass()}>
                {skill}
              </span>
            ))}
          </div>
        </div>
        {/* <div>
          <h3
            className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${
              currentStyle.name === 'Future'
                ? 'text-cyan-400 border-cyan-900'
                : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'
            }`}
          >
            {labels.sections.education}
          </h3>
          <div className="flex flex-wrap gap-2">
            {MOCK_RESUME.education.map((edu) => (
              <span key={edu.id} className={currentStyle.getBadgeClass()}>
                {edu.degree} at {edu.institution}
              </span>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

            
