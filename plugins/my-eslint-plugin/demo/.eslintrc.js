module.exports = {
    // eslint内置规则集默认都是关闭的，通过以下来启用推荐的规则（内置规则集的子集）
    // extends: 'eslint:recommended',
    plugins: [
      'porn'
    ],
    rules: {
        // 'eqeqeq' : ['error', 'always'], //
        'porn/no-console-log': 2
    }
};
