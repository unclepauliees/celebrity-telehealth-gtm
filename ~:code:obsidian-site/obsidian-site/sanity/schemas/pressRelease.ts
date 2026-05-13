import { defineType, defineField } from 'sanity'

function wordCount(value: string | undefined): number {
  if (!value) return 0
  return value.trim().split(/\s+/).filter(Boolean).length
}

export const pressRelease = defineType({
  name: 'pressRelease',
  title: 'Press Release',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Publication or wire service name.',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Link to original publication.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
      description: '50 words max.',
      validation: (Rule) =>
        Rule.custom((value: string | undefined) => {
          const words = wordCount(value)
          if (words > 50) {
            return `Excerpt is ${words} words. Maximum is 50 words.`
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'date',
    },
  },
})
