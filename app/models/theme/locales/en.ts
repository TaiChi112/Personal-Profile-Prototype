export const EN_LABELS = {
  nav: { home: 'Home', feed: 'Feed', projects: 'Projects', library: 'Library', articles: 'Articles', blog: 'Blog', docs: 'Docs', resume: 'Resume', dashboard: 'Analytics', podcast: 'Podcast', contact: 'Contact' },
  hero: { titlePrefix: 'Building the', titleHighlight: 'Future', description: 'Software Engineering crafting scalable applications.', btnProjects: 'View Projects', btnArticles: 'Read Articles' },
  sections: {
    feed: 'Unified Feed', feedDesc: 'All content in one place.',
    projects: 'Projects', projectsDesc: 'Super Projects and their related sub-modules.',
    articles: 'Technical Articles', articlesDesc: 'Drill down into topics to see related content.',
    blog: 'Personal Blog', blogDesc: 'Main stories and related thoughts.',
    docs: 'Documentation', docsDesc: 'Guides and References in a structured view.',
    resume: 'Resume', experience: 'Experience', skills: 'Skills', education: 'Education', summary: 'Summary',
    dashboard: 'Content Analytics', dashboardDesc: 'Insights generated dynamically from the content tree using Visitor Pattern.',
    podcast: 'Tech Talks Podcast', podcastDesc: 'Listen to my latest thoughts on technology and career.',
    contact: 'Get in Touch', contactDesc: 'Use the Smart Hub below to send a message.',
  },
  actions: { readMore: 'Read more', downloadPdf: 'PDF', view: 'View', expand: 'Show Related', collapse: 'Hide Related', related: 'Related Items', search: 'Search content...', filterBy: 'Filter by', undo: 'Undo Last Action', locked: 'Premium Content', unlock: 'Unlock Access', sortBy: 'Sort by', tour: 'Start Guided Tour', tourNext: 'Next Section', tourPrev: 'Previous', tourEnd: 'End Tour', tourPause: 'Pause Tour', tourPlay: 'Resume Tour', tourSpeed: 'Speed', snapshotSave: 'Save View', snapshotLoad: 'Load View', snapshotPlaceholder: 'Snapshot name...', listen: 'Listen', playing: 'Now Playing', submit: 'Send Message', exportMd: 'Export MD', exportJson: 'Export JSON', adminActions: 'Admin Actions', cloneTemplate: 'Clone', switchChannel: 'Toggle Notification Mode' },
} as const;

export const EN_LOCALE = {
  code: 'EN',
  labels: EN_LABELS,
} as const;
