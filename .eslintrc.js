module.exports = {
  'extends': './node_modules/@mlz/lint/ts-eslintrc-react.js',
  'rules': {
    'react/no-deprecated': 0, // 不开启废弃方法检查，例如componentWillReceiveProps
    'react/no-children-prop': 0,
    '@typescript-eslint/no-empty-interface': 0, // 不开启空interface类型检查
    'react/sort-comp': 0, // 不开启组件内方法顺序检查
    'react/no-array-index-key': 0, // 允许index作为key值
    '@typescript-eslint/no-this-alias': 0, // 允许赋值this给变量
    'react-hooks/exhaustive-deps': 0, // useEffect不检查第二个参数的依赖
    '@typescript-eslint/camelcase': 0,
    'react/jsx-closing-tag-location': 0,
    'react/prop-types': 0,
    'react/no-multi-comp': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
};
