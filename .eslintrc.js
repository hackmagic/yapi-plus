module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended'],
  rules: {
    'indent': ['off', 2],
    'comma-dangle': 'off',
    'no-console': ['off'],
    'no-empty': ['off']
  },
  overrides: [
    {
      files: ['client/**/*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      extends: ['plugin:vue/recommended'],
      rules: {
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/attributes-order': 'off',
        'vue/singleline-html-element-content-newline': 'off'
      }
    },
    {
      files: ['client/**/*.js'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      rules: {
        'no-unused-vars': 'off',
        'no-undef': 'off'
      }
    }
  ]
};

