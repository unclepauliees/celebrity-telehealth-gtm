import { defineType, defineField, defineArrayMember } from 'sanity'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platformCompany',
      title: 'Platform Company',
      type: 'reference',
      to: [{ type: 'platformCompany' }],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Featured case studies appear at the top of the listing.',
    }),
  ],
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'platformCompany.name',
      featured: 'featured',
    },
    prepare({
      title,
      subtitle,
      featured,
    }: {
      title?: string
      subtitle?: string
      featured?: boolean
    }) {
      return {
        title: title ?? 'Case Study',
        subtitle: [subtitle, featured ? '[FEATURED]' : ''].filter(Boolean).join(' · '),
      }
    },
  },
})
