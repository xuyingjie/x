// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // parserOptions: {
  //   parser: 'babel-eslint'
  // },
  env: {
    browser: true,
    node: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  rules: {
    'indent': ['off', 4],
    'linebreak-style': ['warn', 'unix'],
    'quotes': ['warn', 'single'],
    // 'semi': ['warn', 'always'],
    'no-unused-vars': ['warn'],
    'no-undef': ['error'],
  }
}
