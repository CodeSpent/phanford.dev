import * as React from 'react'
import { useMarkdownRendererProps } from './types'
import { isRelativePath } from '../../urls'
import Link from 'next/link'

export const getLinks = (_: useMarkdownRendererProps) => {
  return {
    a(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
      const { href, ...restProps } = props
      const isInternalLink = isRelativePath(href || '')
      if (!isInternalLink) {
        return (
          <a
            {...restProps}
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {props.children}
          </a>
        )
      }
      return (
        <Link {...restProps} href={href || ''} passHref>
          {props.children}
        </Link>
      )
    },
  }
}
