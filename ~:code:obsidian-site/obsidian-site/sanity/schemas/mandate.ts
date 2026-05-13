import { defineType, defineField } from 'sanity'

function wordCount(value: string | undefined): number {
  if (!value) return 0
  return value.trim().split(/\s+/).filter(Boolean).length
}

export const mandate = defineType({
  name: 'mandate',
  title: 'Mandate',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      options: {
        list: [
          { title: 'Infrastructure', value: 'infrastructure' },
          { title: 'Technology', value: 'technology' },
          { title: 'Real Assets', value: 'realAssets' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deploymentMin',
      title: 'Deployment Minimum ($M)',
      type: 'number',
      description: 'Minimum deployment size in millions USD. DRAFT — legal review required.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'deploymentMax',
      title: 'Deployment Maximum ($M)',
      type: 'number',
      description: 'Maximum deployment size in millions USD. DRAFT — legal review required.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'MANDATE register. 25 words max.',
      validation: (Rule) =>
        Rule.custom((value: string | undefined) => {
          const words = wordCount(value)
          if (words > 25) {
            return `Description is ${words} words. Maximum is 25 words.`
          }
          return true
        }),
    }),
    defineField({
      name: 'targetReturn',
      title: 'Target Return',
      type: 'string',
      description:
        'Format: "X%–Y% net IRR". DRAFT — illustrative only. Legal review required before publication.',
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
  preview: {
    select: {
      title: 'title',
      subtitle: 'sector',
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
        title: title ?? 'Mandate',
        subtitle: [subtitle, status ? `[${status.toUpperCase()}]` : '']
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
