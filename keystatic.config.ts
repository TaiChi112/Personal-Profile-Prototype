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
    docs: collection({
      label: 'Documentation (MDX)',
      slugField: 'title',
      path: 'docs/**/',
      format: {
        contentField: 'content',
      },
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
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/docs',
              publicPath: '/images/docs',
            },
          },
        }),
      },
    }),
  },
});
