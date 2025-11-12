'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProjectLink } from '../blog/ProjectLinks'
import { GitHubRepoStats, GitHubCommit, formatRelativeTime, formatNumber } from '@/lib/github-api'
import { CTAButton, CTAButtonConfig } from '../common/CTAButton'

interface StickyHeaderBarProps {
  title: string
  icon?: string | null
  status: string
  links?: ProjectLink[]
  githubStats?: GitHubRepoStats | null
  latestCommit?: GitHubCommit | null
  ctaButtonConfig?: CTAButtonConfig
  className?: string
}

export const StickyHeaderBar: React.FC<StickyHeaderBarProps> = ({
  title,
  icon,
  status,
  links = [],
  githubStats,
  latestCommit,
  ctaButtonConfig,
  className = '',
}) => {
  // TEMPORARILY DISABLED - Will be re-enabled and fixed later
  // TODO: Re-implement sticky header with proper navbar coordination
  return null
}
