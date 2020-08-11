# eslint-plugin-porn

disallow porn

## Installation
并没有发布到npm上，仅供本地玩玩：
1. clone本项目到本地
2. 进入项目目录中
3. 执行`sudo npm link`
4. 进入使用本eslint插件的项目目录（如本项目的演示项目demo目录）中并安装npm依赖
5. 执行`npm link eslint-plugin-porn`
6. 在demo目录下测试效果

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-porn`:

```
$ npm install eslint-plugin-porn --save-dev
```


## Usage


```json
{
    "plugins": [
        "porn"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "porn/no-console-log": 2
    }
}
```

## Supported Rules
porn/no-console-log

* Fill in provided rules here





