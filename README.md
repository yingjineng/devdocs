# [DevDocs](https://devdocs.io) — API 文档浏览器

DevDocs 将多种开发者文档整合到一个简洁有序的 Web 界面中，支持即时搜索、离线使用、移动端适配、深色主题、键盘快捷键等功能。

DevDocs 由 [Thibaut Courouble](https://thibaut.me) 创建，目前由 [freeCodeCamp](https://www.freecodecamp.org) 运营。

## 我们正在寻找维护者

如果你有兴趣加入团队，请在 [Discord](https://discord.gg/PRyKn3Vbay) 社区联系我们！

关注开发动态：

* 加入 DevDocs 聊天室：[Discord](https://discord.gg/PRyKn3Vbay)
* 关注 GitHub 仓库：[GitHub](https://github.com/freeCodeCamp/devdocs/subscription)
* 关注 Twitter 上的 [@DevDocs](https://twitter.com/DevDocs)

**目录：** [快速开始](#快速开始) · [愿景](#愿景) · [应用](#应用) · [爬虫](#爬虫) · [可用命令](#可用命令) · [贡献](#贡献) · [文档](#文档) · [相关项目](#相关项目) · [版权--许可证](#版权--许可证) · [常见问题](#常见问题)

## 快速开始

除非你希望为项目做贡献，否则推荐直接使用托管版 [devdocs.io](https://devdocs.io)。它始终保持最新，并且开箱即用支持离线。

### 使用 Docker（推荐）

本地运行 DevDocs 最简单的方法是使用 Docker：

```sh
docker run --name devdocs -d -p 9292:9292 ghcr.io/freecodecamp/devdocs:latest
```

这将在 [localhost:9292](http://localhost:9292) 启动 DevDocs。我们提供常规版和基于 Alpine 的镜像：
- `ghcr.io/freecodecamp/devdocs:latest` - 标准镜像
- `ghcr.io/freecodecamp/devdocs:latest-alpine` - 基于 Alpine（体积更小）

镜像会自动构建并每月更新，包含最新文档。

你也可以自行构建镜像：

```sh
git clone https://github.com/freeCodeCamp/devdocs.git && cd devdocs
docker build -t devdocs .
docker run --name devdocs -d -p 9292:9292 devdocs
```

### 手动安装

DevDocs 由两部分组成：一个 Ruby 爬虫用于生成文档和元数据，以及一个由小型 Sinatra 应用驱动的 JavaScript 应用。

DevDocs 需要 Ruby 3.4.1（见 [`Gemfile`](./Gemfile)）、libcurl 和一个 [ExecJS](https://github.com/rails/execjs#readme) 支持的 JavaScript 运行时（OS X 和 Windows 已内置，Linux 推荐 [Node.js](https://nodejs.org/en/)）。安装好这些依赖后，运行以下命令：

```sh
git clone https://github.com/freeCodeCamp/devdocs.git && cd devdocs
gem install bundler
bundle install
bundle exec thor docs:download --default
bundle exec rackup
```

最后，在浏览器中访问 [localhost:9292](http://localhost:9292)（首次请求会花几秒编译资源）。一切就绪！

`thor docs:download` 命令用于从 DevDocs 服务器下载预生成文档（如 `thor docs:download html css`）。可通过 `thor docs:list` 查看可用文档及版本。要更新所有已下载文档，运行 `thor docs:download --installed`。如需下载并安装所有可用文档，运行 `thor docs:download --all`。

**注意：** 目前没有自动更新机制，需通过 `git pull origin main` 更新代码，通过 `thor docs:download --installed` 下载最新文档。请 [关注](https://github.com/freeCodeCamp/devdocs/subscription) 仓库以获取新版本信息。

## 愿景

DevDocs 致力于让查阅和搜索参考文档变得快速、简单、愉悦。

应用的主要目标：

* 尽量缩短加载时间
* 提升搜索结果的质量、速度和排序
* 最大化缓存和其他性能优化的利用
* 保持界面简洁易读
* 完全支持离线功能
* 支持全键盘导航
* 通过统一的排版和设计减少“上下文切换”
* 通过聚焦 API/参考类内容并仅索引对大多数开发者有用的最小内容，减少杂乱

**注意：** DevDocs 不是编程指南或搜索引擎。所有内容均来自第三方，项目无意与全文搜索引擎竞争。其核心是元数据，每条内容都有唯一、简明的标识符。不符合此要求的教程、指南等内容不在项目范围内。

## 应用

Web 应用完全由客户端 JavaScript 实现，后端为小型 [Sinatra](http://www.sinatrarb.com)/[Sprockets](https://github.com/rails/sprockets) 应用。依赖 [爬虫](#scraper) 生成的文件。

许多设计决策源于应用通过 XHR 直接加载内容到主框架，包括去除原始文档的大部分 HTML 标记（如脚本和样式表），并为所有 CSS 类名前缀下划线以避免冲突。

另一个关键因素是性能及一切都在浏览器端完成。通过 service worker（有自身限制）和 `localStorage` 加速启动，同时允许用户自选文档以控制内存消耗。搜索算法保持简单，以便即使在 10 万条字符串中也能快速搜索。

作为开发者工具，浏览器要求较高：

* 最新版 Firefox、Chrome 或 Opera
* Safari 11.1+
* Edge 17+
* iOS 11.3+

这让代码能充分利用最新 DOM 和 HTML5 API，也让开发更有趣！

## 爬虫

爬虫负责生成 [应用](#app) 使用的文档和索引文件（元数据），用 Ruby 编写，位于 `Docs` 模块下。

目前有两类爬虫：`UrlScraper`（通过 HTTP 下载文件）和 `FileScraper`（从本地文件系统读取）。它们都会复制 HTML 文档，递归跟踪符合规则的链接并进行各种修改，同时构建文件及其元数据的索引。文档解析使用 [Nokogiri](http://nokogiri.org)。

每个文档的修改包括：

* 移除内容，如文档结构（`<html>`、`<head>` 等）、注释、空节点等
* 修复链接（如去重）
* 替换所有外部（未爬取）URL 为完整路径
* 替换所有内部（已爬取）URL 为相对路径
* 添加内容，如标题和原文链接
* 确保使用 [Prism](http://prismjs.com/) 正确语法高亮

这些修改通过 [HTML::Pipeline](https://github.com/jch/html-pipeline) 库的一组过滤器实现。每个爬虫包含自身特有的过滤器，其中之一负责提取页面元数据。

最终生成一组标准化的 HTML 片段和两个 JSON 文件（索引 + 离线数据）。因索引文件会根据用户偏好由 [应用](#app) 单独加载，爬虫还会创建一个 JSON 清单文件，包含当前系统可用文档的信息（如名称、版本、更新时间等）。

更多关于 [爬虫](./docs/scraper-reference.md) 和 [过滤器](./docs/filter-reference.md) 的信息见 `docs` 文件夹。

## 可用命令

命令行界面使用 [Thor](http://whatisthor.com)。查看所有命令和选项，请在项目根目录运行 `thor list`。

```sh
# 服务器
rackup              # 启动服务器（ctrl+c 停止）
rackup --help       # 列出服务器选项

# 文档
thor docs:list      # 列出可用文档
thor docs:download  # 下载一个或多个文档
thor docs:manifest  # 创建应用使用的清单文件
thor docs:generate  # 生成/爬取文档
thor docs:page      # 生成/爬取文档页面
thor docs:package   # 打包文档以供 docs:download 使用
thor docs:clean     # 删除文档包

# 控制台
thor console        # 启动 REPL
thor console:docs   # 在 "Docs" 模块下启动 REPL

# 可在控制台内用 "test" 命令快速运行测试。
# 运行 "help test" 查看用法说明。
thor test:all       # 运行所有测试
thor test:docs      # 运行 "Docs" 测试
thor test:app       # 运行 "App" 测试

# 资源
thor assets:compile # 编译资源（开发模式下无需）
thor assets:clean   # 清理旧资源
```

如系统安装了多个 Ruby 版本，命令需通过 `bundle exec` 运行。

## 贡献

欢迎贡献！请阅读[贡献指南](./.github/CONTRIBUTING.md)。

## 文档

* [向 DevDocs 添加文档](./docs/adding-docs.md)
* [爬虫参考](./docs/scraper-reference.md)
* [过滤器参考](./docs/filter-reference.md)
* [维护者指南](./docs/maintainers.md)

## 相关项目

做了什么有趣的项目？欢迎 PR 添加到下表！你也可以通过 https://github.com/topics/devdocs 发现新项目。

<!-- 按描述排序 -->

| 项目                                                                                     | 描述                          | 最近提交                                                                                                          | Star 数                                                                                                  |
| ---------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [yannickglt/alfred-devdocs](https://github.com/yannickglt/alfred-devdocs)                | Alfred 工作流                 | ![Latest GitHub commit](https://img.shields.io/github/last-commit/yannickglt/alfred-devdocs?logo=github&label)    | ![GitHub stars](https://img.shields.io/github/stars/yannickglt/alfred-devdocs?logo=github&label)         |
| [Merith-TK/devdocs_webapp_kotlin](https://github.com/Merith-TK/devdocs_webapp_kotlin)    | 安卓应用                      | ![Latest GitHub commit](https://img.shields.io/github/last-commit/Merith-TK/devdocs_webapp_kotlin?logo=github&label) | ![GitHub stars](https://img.shields.io/github/stars/Merith-TK/devdocs_webapp_kotlin?logo=github&label)   |
| [gruehle/dev-docs-viewer](https://github.com/gruehle/dev-docs-viewer)                    | Brackets 扩展                 | ![Latest GitHub commit](https://img.shields.io/github/last-commit/gruehle/dev-docs-viewer?logo=github&label)      | ![GitHub stars](https://img.shields.io/github/stars/gruehle/dev-docs-viewer?logo=github&label)           |
| [egoist/devdocs-desktop](https://github.com/egoist/devdocs-desktop)                      | Electron 应用                 | ![Latest GitHub commit](https://img.shields.io/github/last-commit/egoist/devdocs-desktop?logo=github&label)       | ![GitHub stars](https://img.shields.io/github/stars/egoist/devdocs-desktop?logo=github&label)            |
| [skeeto/devdocs-lookup](https://github.com/skeeto/devdocs-lookup)                        | Emacs 函数                    | ![Latest GitHub commit](https://img.shields.io/github/last-commit/skeeto/devdocs-lookup?logo=github&label)        | ![GitHub stars](https://img.shields.io/github/stars/skeeto/devdocs-lookup?logo=github&label)             |
| [astoff/devdocs.el](https://github.com/astoff/devdocs.el)                                | Emacs 查看器                  | ![Latest GitHub commit](https://img.shields.io/github/last-commit/astoff/devdocs.el?logo=github&label)            | ![GitHub stars](https://img.shields.io/github/stars/astoff/devdocs.el?logo=github&label)                 |
| [naquad/devdocs-shell](https://github.com/naquad/devdocs-shell)                          | GTK shell，集成 Vim           | ![Latest GitHub commit](https://img.shields.io/github/last-commit/naquad/devdocs-shell?logo=github&label)         | ![GitHub stars](https://img.shields.io/github/stars/naquad/devdocs-shell?logo=github&label)              |
| [hardpixel/devdocs-desktop](https://github.com/hardpixel/devdocs-desktop)                | GTK 应用                      | ![Latest GitHub commit](https://img.shields.io/github/last-commit/hardpixel/devdocs-desktop?logo=github&label)    | ![GitHub stars](https://img.shields.io/github/stars/hardpixel/devdocs-desktop?logo=github&label)         |
| [qwfy/doc-browser](https://github.com/qwfy/doc-browser)                                  | Linux 应用                     | ![Latest GitHub commit](https://img.shields.io/github/last-commit/qwfy/doc-browser?logo=github&label)             | ![GitHub stars](https://img.shields.io/github/stars/qwfy/doc-browser?logo=github&label)                  |
| [dteoh/devdocs-macos](https://github.com/dteoh/devdocs-macos)                            | macOS 应用                     | ![Latest GitHub commit](https://img.shields.io/github/last-commit/dteoh/devdocs-macos?logo=github&label)          | ![GitHub stars](https://img.shields.io/github/stars/dteoh/devdocs-macos?logo=github&label)               |
| [Sublime Text plugin](https://sublime.wbond.net/packages/DevDocs)                        | Sublime Text 插件               | ![Latest GitHub commit](https://img.shields.io/github/last-commit/vitorbritto/sublime-devdocs?logo=github&label)  | ![GitHub stars](https://img.shields.io/github/stars/vitorbritto/sublime-devdocs?logo=github&label)       |
| [mohamed3nan/DevDocs-Tab](https://github.com/mohamed3nan/DevDocs-Tab)                    | VS Code 扩展（标签页浏览）      | ![Latest GitHub commit](https://img.shields.io/github/last-commit/mohamed3nan/DevDocs-Tab?logo=github&label)      | ![GitHub stars](https://img.shields.io/github/stars/mohamed3nan/DevDocs-Tab?logo=github&label)           |
| [deibit/vscode-devdocs](https://marketplace.visualstudio.com/items?itemName=deibit.devdocs) | VS Code 扩展（浏览器打开）      | ![Latest GitHub commit](https://img.shields.io/github/last-commit/deibit/vscode-devdocs?logo=github&label)        | ![GitHub stars](https://img.shields.io/github/stars/deibit/vscode-devdocs?logo=github&label)             |
| [mdh34/quickDocs](https://github.com/mdh34/quickDocs)                                    | 基于 Vala/Python 的查看器        | ![Latest GitHub commit](https://img.shields.io/github/last-commit/mdh34/quickDocs?logo=github&label)              | ![GitHub stars](https://img.shields.io/github/stars/mdh34/quickDocs?logo=github&label)                   |
| [girishji/devdocs.vim](https://github.com/girishji/devdocs.vim)                          | Vim 插件 & TUI（Vim 内浏览）     | ![Latest GitHub commit](https://img.shields.io/github/last-commit/girishji/devdocs.vim?logo=github&label)          | ![GitHub stars](https://img.shields.io/github/stars/girishji/devdocs.vim?logo=github&label)               |
| [romainl/vim-devdocs](https://github.com/romainl/vim-devdocs)                            | Vim 插件                        | ![Latest GitHub commit](https://img.shields.io/github/last-commit/romainl/vim-devdocs?logo=github&label)           | ![GitHub stars](https://img.shields.io/github/stars/romainl/vim-devdocs?logo=github&label)               |
| [waiting-for-dev/vim-www](https://github.com/waiting-for-dev/vim-www)                    | Vim 插件                        | ![Latest GitHub commit](https://img.shields.io/github/last-commit/waiting-for-dev/vim-www?logo=github&label)       | ![GitHub stars](https://img.shields.io/github/stars/waiting-for-dev/vim-www?logo=github&label)           |
| [luckasRanarison/nvim-devdocs](https://github.com/luckasRanarison/nvim-devdocs)          | Neovim 插件                      | ![Latest GitHub commit](https://img.shields.io/github/last-commit/luckasRanarison/nvim-devdocs?logo=github&label)  | ![GitHub stars](https://img.shields.io/github/stars/luckasRanarison/nvim-devdocs?logo=github&label)      |
| [toiletbril/dedoc](https://github.com/toiletbril/dedoc)                                  | 终端查看器                       | ![Latest GitHub commit](https://img.shields.io/github/last-commit/toiletbril/dedoc?logo=github&label)              | ![GitHub stars](https://img.shields.io/github/stars/toiletbril/dedoc?logo=github&label)                  |
| [Raycast Devdocs](https://www.raycast.com/djpowers/devdocs)                              | Raycast 扩展                     | 不可用                 | 不可用                |
| [chrisgrieser/alfred-docs-searches](https://github.com/chrisgrieser/alfred-docs-searches) | Alfred 工作流                    | ![Latest GitHub commit](https://img.shields.io/github/last-commit/chrisgrieser/alfred-docs-searches?logo=github&label) | ![GitHub stars](https://img.shields.io/github/stars/chrisgrieser/alfred-docs-searches?logo=github&label) |

## 版权 / 许可证

Copyright 2013–2025 Thibaut Courouble 及 [其他贡献者](https://github.com/freeCodeCamp/devdocs/graphs/contributors)

本软件遵循 Mozilla Public License v2.0 许可协议。详见 [COPYRIGHT](./COPYRIGHT) 和 [LICENSE](./LICENSE) 文件。

未经维护者许可，请勿使用 DevDocs 名称为衍生产品背书或推广，除非为满足声明/署名要求所必需。

我们也希望任何使用本软件生成的文档文件能注明 DevDocs 来源。让我们共同尊重所有贡献者的劳动成果，谢谢！

## 常见问题

如有疑问，欢迎在 [Discord](https://discord.gg/PRyKn3Vbay) 贡献者聊天室提问。
