import { defineType, defineField } from 'sanity'

export const footnote = defineType({
  name: 'footnote',
  title: 'Footnote',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Footnote ID',
      type: 'string',
      description: 'Format: "fn-001", "fn-002", etc. Must be unique.',
      validation: (Rule) =>
        Rule.required()
          .regex(/^fn-\d{3,}$/, {
            name: 'footnote-id-format',
            invert: false,
          })
          .error('Footnote ID must follow the format "fn-001".'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      description: 'The footnote text displayed on site.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'legalDisclaimer',
      title: 'Legal Disclaimer',
      type: 'text',
      rows: 4,
      description:
        'Full legal disclaimer text. Required when footnote references financial figures or return targets.',
    }),
    defineField({
      name: 'appliesTo',
      title: 'Applies To',
      type: 'string',
      description:
        'Section or field reference. e.g. "act3.infrastructure.targetReturn" or "act4.principalOneName.bio".',
    }),
  ],
  preview: {
    select: {
      title: 'id',
      subtitle: 'appliesTo',
    },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title ?? 'Footnote',
        subtitle: subtitle ?? '',
      }
    },
  },
})
