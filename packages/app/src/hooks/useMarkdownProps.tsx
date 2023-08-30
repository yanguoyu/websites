import { ComponentProps, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { HeadingProps } from 'react-markdown/lib/ast-to-react'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import clsx from 'clsx'
import { TOCItem } from '../components/TableOfContents'

type MarkdownProps = Omit<ComponentProps<typeof ReactMarkdown>, 'children'>

export function useMarkdownProps({
  supportToc = true,
  imgClass,
}: {
  supportToc?: boolean
  imgClass?: string
}): MarkdownProps {
  const components: MarkdownProps['components'] = useMemo(
    () => ({
      ...(supportToc && {
        h1: wrapHeadingWithTOCItem('h1'),
        h2: wrapHeadingWithTOCItem('h2'),
        h3: wrapHeadingWithTOCItem('h3'),
        h4: wrapHeadingWithTOCItem('h4'),
        h5: wrapHeadingWithTOCItem('h5'),
        h6: wrapHeadingWithTOCItem('h6'),
      }),

      a: ({ node, ...tagProps }) => <a {...tagProps} target="_blank" rel="noopener noreferrer" />,
      img: ({ node, ...tagProps }) => (
        // Expectedly, all the links are external (content from GitHub), so there is no need to use next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img {...tagProps} alt={tagProps.alt ?? 'image'} className={clsx(tagProps.className, imgClass)} />
      ),
    }),
    [imgClass, supportToc],
  )

  const remarkPlugins = useMemo(() => [remarkGfm], [])
  const rehypePlugins = useMemo(() => [rehypeRaw, rehypeSanitize], [])

  return { remarkPlugins, rehypePlugins, components }
}

function wrapHeadingWithTOCItem(HeadingTag: string) {
  return function tagWithTOCItem({ node, ...tagProps }: HeadingProps) {
    const content = tagProps.children[0]
    if (typeof content !== 'string') return <HeadingTag {...tagProps} />

    return (
      <TOCItem id={content} titleInTOC={content}>
        <HeadingTag {...tagProps} />
      </TOCItem>
    )
  }
}
