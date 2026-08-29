import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: process.env.NODE_ENV === 'production' && process.env.KEYSTATIC_GITHUB_CLIENT_ID ? 'github' : 'local',
    repo: {
      owner: 'taichi112',
      name: 'personal-profile-prototype',
    },
  },
  ui: {
    brand: { name: 'Taichi112 Content CMS' },
  },
  collections: {
    blogs: collection({
      label: 'Blogs',
      slugField: 'title',
      path: 'content/blogs/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Personal', value: 'Personal' },
            { label: 'Lifestyle', value: 'Lifestyle' },
            { label: 'DevLog', value: 'DevLog' },
          ],
          defaultValue: 'Personal',
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/blogs',
          publicPath: '/images/blogs',
        }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/blogs',
              publicPath: '/images/blogs',
            },
          },
        }),
      },
    }),
    articles: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'content/articles/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        publishedAt: fields.date({ label: 'Published Date', defaultValue: { kind: 'today' } }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: props => props.value }),
        readTime: fields.text({ label: 'Read Time (e.g. 5 min)' }),
        authorName: fields.text({ label: 'Author Name', defaultValue: 'Anothai Vichapaiboon' }),
        authorAvatar: fields.image({
          label: 'Author Avatar',
          directory: 'public/images/authors',
          publicPath: '/images/authors',
        }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/articles',
              publicPath: '/images/articles',
            },
          },
        }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Web', value: 'Web' },
            { label: 'AI/ML', value: 'AI/ML' },
            { label: 'CLI', value: 'CLI' },
            { label: 'Other', value: 'Other' }, { label: 'Applications', value: 'Applications' }, { label: 'Tools', value: 'Tools' }, { label: 'Data', value: 'Data' }, { label: 'Security', value: 'Security' },
          ],
          defaultValue: 'Web',
        }),
        githubUrl: fields.url({ label: 'GitHub Repository URL' }),
        internalAppRoute: fields.text({ label: 'Internal App Route (e.g. /projects/todo)' }),
        featured: fields.checkbox({ label: 'Featured Project' }),
        techStack: fields.array(fields.text({ label: 'Technology' }), { label: 'Tech Stack', itemLabel: props => props.value }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/projects',
              publicPath: '/images/projects',
            },
          },
        }),
      },
    }),
  },
});
