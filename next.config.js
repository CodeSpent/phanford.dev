const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");


module.exports = withPlugins(
  [
    withImages,
],
  {
  images: {
    disableStaticImages: true,
    domains: ["localhost:3000", "127.0.0.1"],
    path: "http://localhost:3000/images",
  },
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "content/articles"),
            to: path.resolve(__dirname, "public/articles"),
            globOptions: {
              ignore: ["**/*.md"],
            },
          },
        ],
      })
    );

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
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
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      path: require.resolve("path-browserify"),
    };
    return config;
  },
});
