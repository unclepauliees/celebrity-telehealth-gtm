import { defineType, defineField } from 'sanity'

function wordCount(value: string | undefined): number {
  if (!value) return 0
  return value.trim().split(/\s+/).filter(Boolean).length
}

export const principal = defineType({
  name: 'principal',
  title: 'Principal',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Managing Principal" or "Principal, Technology"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'MANDATE register. Strict 40 words maximum.',
      validation: (Rule) =>
        Rule.required().custom((value: string | undefined) => {
          const words = wordCount(value)
          if (words > 40) {
            return `Bio is ${words} words. Strict maximum is 40 words.`
          }
          return true
        }),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Per photography specification in brand guidelines.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Live', value: 'live' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      status: 'status',
    },
    prepare({
      title,
      subtitle,
      status,
    }: {
      title?: string
      subtitle?: string
      status?: string
    }) {
      return {
        title: title ?? 'Principal',
        subtitle: [subtitle, status ? `[${status.toUpperCase()}]` : '']
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
