'use client';

import { useState } from 'react';
import { Copy, Github, FileText, Bot, Printer, Check, ChevronDown, MessageSquare, Code, Cpu } from 'lucide-react';

type DocsActionsDropdownProps = {
  readonly markdownContent: string;
  readonly githubEditUrl?: string;
  readonly githubRawUrl?: string;
  readonly title: string;
};

export function DocsActionsDropdown({ markdownContent, githubEditUrl, githubRawUrl, title }: DocsActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = async () => {
    try {
      if (!markdownContent) {
        console.warn("No markdown content to copy");
        return;
      }
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const openInNewTab = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setIsOpen(false);
  };

  const handleViewRaw = () => {
    if (githubRawUrl) {
      openInNewTab(githubRawUrl);
    }
  };

  const handleOpenChatGPT = () => {
    const prompt = `I am reading a documentation page titled "${title}". Here is the raw markdown content:\n\n${markdownContent}\n\nPlease help me understand this or answer my questions about it.`;
    openInNewTab(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`);
  };

  const handleOpenClaude = () => {
    // Claude doesn't have a direct query param API like ChatGPT yet, but we can link to the homepage
    openInNewTab('https://claude.ai/new');
  };

  const handleOpenScira = () => {
    const prompt = `Explain "${title}" based on this content:\n${markdownContent}`;
    openInNewTab(`https://scira.app/?q=${encodeURIComponent(prompt)}`);
  };

  const handleOpenCursor = () => {
    // Generic cursor protocol, might not work out of the box without a specific file path
    openInNewTab('cursor://');
  };

  const handlePrint = () => {
    setIsOpen(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="inline-flex rounded-md shadow-sm print:hidden" role="group">
      <button
        onClick={handleCopyMarkdown}
        className="inline-flex items-center px-4 py-2 text-sm font-medium border border-fd-border rounded-l-lg text-fd-foreground bg-fd-background hover:bg-fd-accent focus:z-10 focus:ring-1 focus:ring-fd-primary focus:border-fd-primary transition-colors"
      >
        {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
        {copied ? 'Copied' : 'Copy Markdown'}
      </button>

      <div className="relative flex">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium border border-l-0 border-fd-border rounded-r-lg text-fd-foreground bg-fd-background hover:bg-fd-accent focus:z-10 focus:ring-1 focus:ring-fd-primary focus:border-fd-primary transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          Open <ChevronDown className="w-4 h-4 ml-1" />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg bg-fd-popover text-fd-popover-foreground ring-1 ring-black ring-opacity-5 border border-fd-border z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {githubEditUrl && (
                  <button
                    onClick={() => openInNewTab(githubEditUrl)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-3 transition-colors"
                    role="menuitem"
                  >
                    <Github className="w-4 h-4 text-fd-muted-foreground" />
                    Open in GitHub
                  </button>
                )}

                <button
                  onClick={handleViewRaw}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-3 transition-colors"
                  role="menuitem"
                >
                  <FileText className="w-4 h-4 text-fd-muted-foreground" />
                  View as Markdown
                </button>

                <div className="h-px bg-fd-border my-1"></div>

                <button
                  onClick={handleOpenScira}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-3 transition-colors"
                  role="menuitem"
                >
                  <Bot className="w-4 h-4 text-fd-muted-foreground" />
                  Open in Scira AI
                </button>

                <button
                  onClick={handleOpenChatGPT}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-3 transition-colors"
                  role="menuitem"
                >
                  <MessageSquare className="w-4 h-4 text-fd-muted-foreground" />
                  Open in ChatGPT
                </button>

                <button
                  onClick={handleOpenClaude}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-3 transition-colors"
                  role="menuitem"
                >
                  <Cpu className="w-4 h-4 text-fd-muted-foreground" />
                  Open in Claude
                </button>

                <button
                  onClick={handleOpenCursor}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-3 transition-colors"
                  role="menuitem"
                >
                  <Code className="w-4 h-4 text-fd-muted-foreground" />
                  Open in Cursor
                </button>

                <div className="h-px bg-fd-border my-1"></div>

                <button
                  onClick={handlePrint}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground flex items-center gap-3 transition-colors"
                  role="menuitem"
                >
                  <Printer className="w-4 h-4 text-fd-muted-foreground" />
                  Download PDF
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
