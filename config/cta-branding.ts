import { CTAButtonConfig } from '@/components/common/CTAButton'

/**
 * CTA Button Branding Configuration
 *
 * Customize the appearance of CTA buttons across the site.
 * Each project can have its own branding by importing and using a specific config.
 *
 * Usage:
 * 1. Import the desired config: `import { DISCORD_BRANDING } from '@/config/cta-branding'`
 * 2. Pass to CTAButton component: `<CTAButton config={DISCORD_BRANDING} ... />`
 * 3. Or create a custom config for your project
 */

// Discord Branding (Default)
export const DISCORD_BRANDING: CTAButtonConfig = {
  primaryColor: '#5865F2', // Discord Blurple
  primaryHoverColor: '#4752C4', // Darker Blurple
  secondaryIconColor: '#5865F2',
  shadowColor: 'blue-500/20',
}

// GitHub Branding
export const GITHUB_BRANDING: CTAButtonConfig = {
  primaryColor: '#238636', // GitHub Green
  primaryHoverColor: '#2ea043',
  secondaryIconColor: '#238636',
  shadowColor: 'green-500/20',
}

// Twitter/X Branding
export const TWITTER_BRANDING: CTAButtonConfig = {
  primaryColor: '#1DA1F2', // Twitter Blue
  primaryHoverColor: '#1A8CD8',
  secondaryIconColor: '#1DA1F2',
  shadowColor: 'blue-400/20',
}

// Neutral/Generic Branding
export const NEUTRAL_BRANDING: CTAButtonConfig = {
  primaryColor: '#3B82F6', // Blue-500
  primaryHoverColor: '#2563EB', // Blue-600
  secondaryIconColor: '#3B82F6',
  shadowColor: 'blue-500/20',
}

// Red/Alert Branding
export const ALERT_BRANDING: CTAButtonConfig = {
  primaryColor: '#EF4444', // Red-500
  primaryHoverColor: '#DC2626', // Red-600
  secondaryIconColor: '#EF4444',
  shadowColor: 'red-500/20',
}

// Purple Branding
export const PURPLE_BRANDING: CTAButtonConfig = {
  primaryColor: '#8B5CF6', // Purple-500
  primaryHoverColor: '#7C3AED', // Purple-600
  secondaryIconColor: '#8B5CF6',
  shadowColor: 'purple-500/20',
}

// Export default as Discord branding
export const DEFAULT_BRANDING = DISCORD_BRANDING
