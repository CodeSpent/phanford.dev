module.exports = {
  plugins: [
    'remark-preset-lint-recommended',
    // Disable specific rules that conflict with MDX
    ['remark-lint-no-html', false],
    ['remark-lint-no-undefined-references', false],
  ],
}
