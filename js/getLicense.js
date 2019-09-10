const fs = require('fs');
const packageJson = require('./package.json');

// 遍历依赖的包名，从 node_modules 目录下读取相应包的 package.json 文件的 license 许可证字段，输出文件。

function init() {
  // if (fs.existsSync('license_summary.json')) {
  //   fs.unlinkSync('license_summary.json');
  //   console.log('\n已清空上次结果！\n');
  // }
  const allDependencies = Object.assign({}, packageJson.dependencies, packageJson.devDependencies);
  const nameKeys = Object.keys(allDependencies);
  const result = nameKeys.map((nItem, index) => {
    const packageJson = fs.readFileSync(`node_modules/${nItem}/package.json`);
    const { name, version, license } = JSON.parse(packageJson);
    console.log(`成功写入第 ${index} 项：${nItem}`);
    return { name, version, license };
  });
  fs.writeFile('license_summary.json', JSON.stringify(result, null, '\t'), _err => {
    console.log('\n输出结果请查看当前目录下 licence_summary.json 文件。\n');
  });
}

init();
