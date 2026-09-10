"use client";

import { useState } from "react";
import { getInternshipResume } from "@/app/data/resume";
import { Briefcase, Code, GraduationCap, ChevronRight, Download } from "lucide-react";

export function ResumeViewer({ lang }: { lang: 'en' | 'th' }) {
  const resume = getInternshipResume(lang);
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'projects'>('skills');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-fd-background text-fd-foreground rounded-2xl shadow-sm border border-fd-border mt-10 print:p-0 print:m-0 print:border-none print:shadow-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-fd-border pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{resume.name}</h1>
          <p className="text-fd-muted-foreground mt-1 text-lg">{resume.title}</p>
          <p className="text-fd-muted-foreground mt-2 text-sm max-w-2xl">{resume.summary}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-fd-primary text-fd-primary-foreground rounded-lg hover:bg-fd-primary/90 transition-colors print:hidden"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-fd-border pb-2 overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'skills' ? 'border-b-2 border-fd-primary text-fd-primary' : 'text-fd-muted-foreground hover:text-fd-foreground'}`}
        >
          <Code className="w-4 h-4" /> Core Skills
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'experience' ? 'border-b-2 border-fd-primary text-fd-primary' : 'text-fd-muted-foreground hover:text-fd-foreground'}`}
        >
          <Briefcase className="w-4 h-4" /> Experience
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'border-b-2 border-fd-primary text-fd-primary' : 'text-fd-muted-foreground hover:text-fd-foreground'}`}
        >
          <GraduationCap className="w-4 h-4" /> Projects
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        <div className={activeTab === 'skills' ? 'block' : 'hidden print:block'}>
          <div className="hidden print:flex items-center gap-2 mb-4 text-xl font-bold border-b border-fd-border pb-2">
            <Code className="w-5 h-5" /> Core Skills
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
            {resume.skillGroups.map((skillGroup, idx) => (
              <div key={idx} className="bg-fd-card print:bg-transparent p-4 rounded-xl border border-fd-border print:border-none">
                <h3 className="font-semibold text-lg mb-3 text-fd-card-foreground print:text-black">{skillGroup.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-fd-muted print:bg-gray-100 text-sm rounded-full border border-fd-border print:border-gray-300 print:text-black">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={activeTab === 'experience' ? 'block mt-8 print:mt-12' : 'hidden print:block print:mt-12'}>
          <div className="hidden print:flex items-center gap-2 mb-4 text-xl font-bold border-b border-fd-border pb-2">
            <Briefcase className="w-5 h-5" /> Experience
          </div>
          <div className="space-y-6">
            {resume.workExperience.map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-fd-muted print:break-inside-avoid">
                <div className="absolute w-3 h-3 bg-fd-primary print:bg-black rounded-full -left-[7px] top-2" />
                <h3 className="font-semibold text-lg print:text-black">{exp.role}</h3>
                <p className="text-fd-primary print:text-gray-800 font-medium">{exp.company}</p>
                <p className="text-sm text-fd-muted-foreground print:text-gray-600 mb-3">{exp.period}</p>
                <ul className="space-y-2">
                  {exp.description.map((ach, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm print:text-black">
                      <ChevronRight className="w-4 h-4 text-fd-primary print:text-black shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={activeTab === 'projects' ? 'block mt-8 print:mt-12' : 'hidden print:block print:mt-12'}>
          <div className="hidden print:flex items-center gap-2 mb-4 text-xl font-bold border-b border-fd-border pb-2">
            <GraduationCap className="w-5 h-5" /> Projects
          </div>
          <div className="grid grid-cols-1 gap-6">
            {resume.projects.map((proj, idx) => (
              <div key={idx} className="bg-fd-card print:bg-transparent p-5 rounded-xl border border-fd-border print:border-gray-200 hover:border-fd-primary transition-colors print:break-inside-avoid">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-fd-card-foreground print:text-black">{proj.title}</h3>
                  {proj.repoUrl && (
                    <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-xs text-fd-primary print:text-gray-600 hover:underline print:hidden">
                      View Repo
                    </a>
                  )}
                </div>
                <ul className="space-y-2 mb-4">
                  {proj.description.map((desc, i) => (
                    <li key={i} className="text-sm flex items-start gap-2 text-fd-muted-foreground print:text-gray-800">
                      <span className="w-1.5 h-1.5 bg-fd-muted-foreground print:bg-gray-600 rounded-full shrink-0 mt-1.5" />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
