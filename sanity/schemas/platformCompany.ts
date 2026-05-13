import { defineType, defineField } from 'sanity'

/** Count words in a plain string */
function wordCount(value: string | undefined): number {
  if (!value) return 0
  return value.trim().split(/\s+/).filter(Boolean).length
}

export const platformCompany = defineType({
  name: 'platformCompany',
  title: 'Platform Company',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mandate',
      title: 'Mandate',
      type: 'string',
      description: 'One-line mandate description. 80 characters max.',
      validation: (Rule) =>
        Rule.required().max(80).error('Mandate must be 80 characters or fewer.'),
    }),
    defineField({
      name: 'logoMark',
      title: 'Logo Mark',
      type: 'image',
      options: { hotspot: false },
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
    defineField({
      name: 'mandateSummary',
      title: 'Mandate Summary',
      type: 'text',
      rows: 3,
      description: 'Extended mandate description. 40 words max.',
      validation: (Rule) =>
        Rule.custom((value: string | undefined) => {
          const words = wordCount(value)
          if (words > 40) {
            return `Mandate summary is ${words} words. Maximum is 40 words.`
          }
          return true
        }),
    }),
    defineField({
      name: 'ocpLabel',
      title: 'OCP Label',
      type: 'string',
      description: 'Hardcoded governance label. Do not edit.',
      initialValue: 'AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'status',
    },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title ?? 'Platform Company',
        subtitle: subtitle ? `[${subtitle.toUpperCase()}]` : '',
      }
    },
  },
})
