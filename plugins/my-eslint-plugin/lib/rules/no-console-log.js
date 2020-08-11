/**
 * @fileoverview Rule to no console.log().
 * @author wangpeng
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "disallow console.log()",
      category: "Possible Errors",
      recommended: true
    },
    fixable: "code",
    // 用来描述一个规则的选项，ESLint 会用它来验证配置中的选项是否有效
    schema: [] // no options
  },
  create: function(context) {
    return {
      // key是节点类型、选择器或事件名字
      // https://eslint.bootcss.com/docs/developer-guide/working-with-rules
      "CallExpression[callee.object.name='console'][callee.property.name='log']": function(node) {
        context.report({
          node,
          message: '求你不要使用 console.log',
          fix: function(fixer) {
            return [
              fixer.insertTextAfter(node, ";"),
              fixer.insertTextAfter(node, "// 帮你换成了jbconsole"),
              fixer.replaceText(node.callee.object, 'jbconsole')
            ]
          }
        })
      }
    };
  }
};
