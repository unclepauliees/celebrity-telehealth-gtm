import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Singleton document — one landing page.
 * The six acts map to scroll regions defined in the visual brief:
 *   act1 (0–1200px)   THE VOID
 *   act2 (1200–2500px) EMERGENCE
 *   act3 (2500–14000px) THE CAPITAL CHAIN
 *   act4 (14000–21000px) PRINCIPALS
 *   act5 (21000–33000px) PLATFORMS
 *   act6 (33000–36000px) ENGAGE
 */

const ACT_IDS = ['act1', 'act2', 'act3', 'act4', 'act5', 'act6'] as const

/** Count words in a portable text array by walking block.children[].text */
function countPortableTextWords(value: unknown): number {
  if (!Array.isArray(value)) return 0
  let count = 0
  for (const block of value) {
    if (block?._type === 'block' && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof child?.text === 'string') {
          const words = child.text.trim().split(/\s+/).filter(Boolean)
          count += words.length
        }
      }
    }
  }
  return count
}

const actBlock = defineArrayMember({
  type: 'object',
  name: 'actBlock',
  title: 'Act Block',
  fields: [
    defineField({
      name: 'actId',
      title: 'Act',
      type: 'string',
      options: {
        list: ACT_IDS.map((id) => ({ title: id.toUpperCase(), value: id })),
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'VISION or MANDATE register. 60 characters max.',
      validation: (Rule) =>
        Rule.max(60).warning('Headline should be 60 characters or fewer.'),
    }),
    defineField({
      name: 'subhead',
      title: 'Subhead',
      type: 'text',
      rows: 2,
      description: 'MANDATE register. One sentence.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description: 'Block content. 120 words max per act.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          const words = countPortableTextWords(value)
          if (words > 120) {
            return `Body is ${words} words. Maximum is 120 words per act.`
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'actId',
      subtitle: 'headline',
    },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title ? title.toUpperCase() : 'Act',
        subtitle: subtitle ?? '—',
      }
    },
  },
})

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Internal reference only. Not displayed on site.',
      initialValue: 'Landing Page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'acts',
      title: 'Acts',
      type: 'array',
      of: [actBlock],
      description: 'Six scroll acts in order: act1–act6.',
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
