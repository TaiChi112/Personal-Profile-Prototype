import { useState } from 'react';
import { MOCK_DOCS } from '../../data/content';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';

type DocsSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
};

export function DocsSection({ currentStyle, labels }: DocsSectionProps) {
  const [activeDoc, setActiveDoc] = useState(MOCK_DOCS[0]);
  const sections = Array.from(new Set(MOCK_DOCS.map((doc) => doc.section)));

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto pt-8 min-h-[80vh] px-4">
      <div className="w-full md:w-64 shrink-0 mb-8 md:mb-0 md:border-r border-gray-200 dark:border-gray-700 md:pr-4">
        <h3 className={`text-lg font-bold mb-4 ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {labels.sections.docs}
        </h3>
        {sections.map((section) => (
          <div key={section} className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{section}</h4>
            <ul className="space-y-1">
              {MOCK_DOCS.filter((doc) => doc.section === section).map((doc) => (
                <li key={doc.id}>
                  <button
                    onClick={() => setActiveDoc(doc)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      activeDoc.id === doc.id
                        ? currentStyle.name === 'Future'
                          ? 'bg-cyan-900/50 text-cyan-400'
                          : 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-300 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {doc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex-1 md:pl-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className={currentStyle.getSectionTitleClass()}>{activeDoc.title}</h1>
          <div
            className={`p-4 my-6 border-l-4 ${
              currentStyle.name === 'Future'
                ? 'bg-cyan-950/30 border-cyan-500 text-cyan-200'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200'
            }`}
          >
            <p className="text-sm">Last updated on {activeDoc.lastUpdated}</p>
          </div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{activeDoc.content}</div>
        </div>
      </div>
    </div>
  );
}
