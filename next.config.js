const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { withContentlayer } = require('next-contentlayer2')
const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost:3000', '127.0.0.1'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config, { isServer }) => {
    // Apply CopyPlugin only on the client build to avoid interfering with server compilation/emission
    if (!isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'content/articles'),
              to: path.resolve(__dirname, 'public/articles'),
              globOptions: {
                ignore: ['**/*.md', '**/*.mdx'],
              },
            },
          ],
        })
      )
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    })

    // Only alias Node's 'path' module to a browser polyfill on the client build
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        path: require.resolve('path-browserify'),
      }
    }

    return config
  },
}

// Wrap with Contentlayer first, then Sentry
const configWithContentlayer = withContentlayer(nextConfig)

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry webpack plugin
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps in production
  dryRun: process.env.NODE_ENV !== 'production',
}

// Export with Sentry wrapping
module.exports = withSentryConfig(configWithContentlayer, sentryWebpackPluginOptions)