import { config, fields, collection } from '@keystatic/core';
import { wrapper, block } from '@keystatic/core/content-components';

export default config({
  storage: {
    kind: process.env.NODE_ENV === 'production' && process.env.KEYSTATIC_GITHUB_CLIENT_ID ? 'github' : 'local',
    repo: {
      owner: 'taichi112', // Will need to be configured for prod
      name: 'personal-profile-prototype', // Will need to be configured for prod
    },
  },
  ui: {
    brand: { name: 'Taichi112 Content CMS' },
  },
  collections: {
    docs: collection({
      label: 'Documentation (MDX)',
      slugField: 'title',
      path: 'docs/**/',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({
          label: 'Title',
          validation: { length: { min: 1 } },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        icon: fields.text({
          label: 'Icon (Optional)',
        }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/docs',
              publicPath: '/images/docs',
            },
          },
          components: {
            Callout: wrapper({
              label: 'Callout',
              schema: {
                title: fields.text({ label: 'Title' }),
                type: fields.select({
                  label: 'Type',
                  options: [
                    { label: 'Info', value: 'info' },
                    { label: 'Warning', value: 'warning' },
                    { label: 'Warn', value: 'warn' },
                    { label: 'Error', value: 'error' },
                    { label: 'Success', value: 'success' },
                  ],
                  defaultValue: 'info',
                }),
              },
            }),
            Cards: wrapper({
              label: 'Cards',
              schema: {},
            }),
            Card: wrapper({
              label: 'Card',
              schema: {
                title: fields.text({ label: 'Title' }),
                description: fields.text({ label: 'Description' }),
                href: fields.text({ label: 'Link URL' }),
                icon: fields.text({ label: 'Icon (React Node/String)' }),
              },
            }),
          },
        }),
      },
    }),
  },
});
