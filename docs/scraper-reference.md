**目录：**

* [概述](#概述)
* [配置](#配置)
  - [属性](#属性)
  - [过滤器栈](#过滤器栈)
  - [过滤器选项](#过滤器选项)

## 概述

从根 URL 开始，爬虫会递归地跟随符合一组规则的链接，将每个有效响应传递给一系列过滤器，最后将文件写入本地文件系统。它们还会创建页面元数据的索引（由某个过滤器决定），并在结束时导出为 JSON 文件。

爬虫依赖以下库：

* [Typhoeus](https://github.com/typhoeus/typhoeus) 用于发起 HTTP 请求
* [HTML::Pipeline](https://github.com/jch/html-pipeline) 用于应用过滤器
* [Nokogiri](http://nokogiri.org/) 用于解析 HTML

目前有两种爬虫类型：[UrlScraper](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/core/scrapers/url_scraper.rb) 通过 HTTP 下载文件，[FileScraper](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/core/scrapers/file_scraper.rb) 从本地文件系统读取文件。它们的功能几乎相同（都使用 URL），只是 `FileScraper` 会在读取文件前将基础 URL 替换为本地路径。`FileScraper` 默认使用 `localhost` 作为基础 URL，并在最后包含一个过滤器以移除指向它的任何 URL。

要被处理，响应必须满足以下要求：

* 状态码为 200
* 内容类型为 HTML
* 有效 URL（重定向后）包含在基础 URL 内（见下文）

（`FileScraper` 只检查文件是否存在且非空。）

每个 URL 只请求一次（不区分大小写）。

## 配置

配置通过类属性完成，分为三大类：

* [属性](#属性) — 关键信息，如名称、版本、URL 等。
* [过滤器栈](#过滤器栈) — 应用于每个页面的过滤器列表。
* [过滤器选项](#过滤器选项) — 传递给上述过滤器的选项。

**注意：** 爬虫位于 [`lib/docs/scrapers`](https://github.com/freeCodeCamp/devdocs/tree/main/lib/docs/scrapers/) 目录。类名必须是文件名的 [CamelCase](http://api.rubyonrails.org/classes/String.html#method-i-camelize) 形式。

### 属性

* `name` [字符串]
  必须唯一。
  默认为类名。

* `slug` [字符串]
  必须唯一、小写且不能包含短横线（可用下划线）。
  默认为小写的 `name`。

* `type` [字符串] **（必填，继承）**
  定义将添加/加载到每个页面的 CSS 类名（`_[type]`）和自定义 JavaScript 类（`app.views.[Type]Page`）。结构相似的文档（如由同一工具生成或来自同一网站）应使用相同的 `type`，以避免重复 CSS 和 JS。
  只能包含小写字母。

* `release` [字符串] **（必填）**
  爬虫上次运行时软件的版本。仅供参考，不影响爬虫行为。

* `base_url` [字符串] **（`UrlScraper` 必填）**
  文档位置。只有 _在_ `base_url` 内的 URL 会被爬取。“在内”大致等同于“以其开头”，但 `/docs` 不在 `/doc` 内（而 `/doc/` 在内）。
   `FileScraper` 默认为 `localhost`。 _(注意：任何指向 localhost 的 iframe、图片或跳过的链接会被 `CleanLocalUrls` 过滤器移除；如果文档可在线获取，应覆盖该值。)_
  若未设置 `root_path`，根/初始 URL 等于 `base_url`。

* `base_urls` [数组] **（需包含 `MultipleBaseUrls` 模块）** 文档位置。与 `base_url` 类似，但可添加多个 URL，适用于文档分布在不同 URL 或需多个 URL 才完整的情况。见 [`typescript.rb`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/scrapers/typescript.rb)。

* `root_path` [字符串] **（继承）**
  根 URL 相对于 `base_url` 的路径。

* `initial_paths` [数组] **（继承）**
  初始队列中要添加的路径列表（相对于 `base_url`）。适用于爬取孤立文档。
  默认为 `[]`。 _(注意：`root_path` 会在运行时添加到数组中。)_

* `dir` [字符串] **（必填，仅 `FileScraper`）**
  本地文件系统上文件所在的绝对路径。
  _注意：`FileScraper` 与 `UrlScraper` 工作方式完全相同（操作同类 URL），只是将 `base_url` 替换为 `dir` 以读取文件而非发起 HTTP 请求。_

* `params` [哈希] **（继承，仅 `UrlScraper`）**
  要附加到每个 URL 的查询字符串参数。（如 `{ format: 'raw' }` → `?format=raw`）
  默认为 `{}`。

* `abstract` [布尔]
  使爬虫为抽象类/不可运行。用于与其他爬虫类共享行为（如所有 MDN 爬虫继承自抽象 [`Mdn`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/scrapers/mdn/mdn.rb) 类）。
  默认为 `false`。

### 过滤器栈

每个爬虫有两个[过滤器](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/core/filter.rb)[栈](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/core/filter_stack.rb)：`html_filters` 和 `text_filters`。它们组合成一个管道（使用 [HTML::Pipeline](https://github.com/jch/html-pipeline) 库），每个过滤器将输出传递给下一个过滤器的输入。

HTML 过滤器先执行，操作解析后的文档（[Nokogiri](http://nokogiri.org/Nokogiri/XML/Node.html) 节点对象），而文本过滤器操作字符串形式的文档。这样可避免多次解析文档。

过滤器栈类似有序集合，可用以下方法修改：

```ruby
push(*names)                 # 在末尾追加一个或多个过滤器
insert_before(index, *names) # 在指定过滤器前插入
insert_after(index, *names)  # 在指定过滤器后插入
replace(index, name)         # 替换指定过滤器
```

“names”为相对于 `Docs` 的 `require` 路径（如 `jquery/clean_html` → `Docs::Jquery::CleanHtml`）。

默认 `html_filters`：

* [`ContainerFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/container.rb) — 更改文档根节点（移除外部内容）
* [`CleanHtmlFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/clean_html.rb) — 移除 HTML 注释、`<script>`、`<style>` 等
* [`NormalizeUrlsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/normalize_urls.rb) — 替换所有 URL 为完整格式
* [`InternalUrlsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/internal_urls.rb) — 检测内部 URL（需爬取的）并替换为未限定的相对路径
* [`NormalizePathsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/normalize_paths.rb) — 规范化内部路径（如总以 `.html` 结尾）
* [`CleanLocalUrlsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/clean_local_urls.rb) — 移除指向 localhost 的链接、iframe 和图片（仅 `FileScraper`）

默认 `text_filters`：

* [`InnerHtmlFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/inner_html.rb) — 将文档转为字符串
* [`CleanTextFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/clean_text.rb) — 移除空节点
* [`AttributionFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/attribution.rb) — 添加版权信息和原文链接

此外：

* [`TitleFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/title.rb) 是核心 HTML 过滤器，默认禁用，会为文档添加标题（`<h1>`）。
* [`EntriesFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/entries.rb) 是每个爬虫必须实现的抽象 HTML 过滤器，负责提取页面元数据。

### 过滤器选项

过滤器选项存储在 `options` 哈希中。该哈希可继承（递归复制），默认为空。

关于过滤器工作原理的更多信息见 [过滤器参考](./filter-reference.md) 页面。

* [`ContainerFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/container.rb)

  - `:container` [字符串或 Proc]
    容器元素的 CSS 选择器。其外的内容会被移除，对其他过滤器不可用。若有多个匹配元素，取 DOM 中第一个。若无匹配元素，抛出错误。
    若为 Proc，则对每页调用，参数为过滤器实例，应返回选择器或 `nil`。
    默认容器为 `<body>` 元素。
    _注意：容器外的链接不会被爬虫跟随。如需移除应被跟随的链接，可在栈后续使用 [`CleanHtml`](./filter-reference.md#cleanhtmlfilter) 过滤器。_

* [`NormalizeUrlsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/normalize_urls.rb)
  以下选项用于修改页面中的 URL。可用于去重（同一页面有多个 URL）和修复有重定向的网站（应被爬取的 URL 在重定向后才在 `base_url` 内——见 MDN 爬虫示例）。

  - `:replace_urls` [哈希]
    替换所有 URL 实例。
    格式：`{ 'original_url' => 'new_url' }`
  - `:replace_paths` [哈希]
    替换所有子路径（相对于 `base_url` 的路径）。
    格式：`{ 'original_path' => 'new_path' }`
  - `:fix_urls` [Proc]
    对每个 URL 调用。返回值为 `nil` 时不修改，否则用返回值替换。

  _注意：应用这些规则前，所有 URL 会转为完整格式（http://...）。_

* [`InternalUrlsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/internal_urls.rb)

  内部 URL 指 _在_ 爬虫 `base_url` 内的 URL（“在内”大致等同于“以其开头”，但 `/docs` 不在 `/doc` 内）。除非被以下规则排除，内部 URL 会被爬取。所有内部 URL 会在页面中转为相对路径。

  - `:skip_links` [布尔或 Proc]
    若为 `false`，不转换或跟随任何内部 URL（生成单页文档）。
    若为 Proc，对每页调用，参数为过滤器实例。
  - `:follow_links` [Proc]
    对每页调用，参数为过滤器实例。返回 `false` 时不将内部 URL 加入队列。
  - `:trailing_slash` [布尔]
    若为 `true`，为所有内部 URL 添加斜杠结尾。为 `false` 时移除。
    也用于去重。
  - `:skip` [数组]
    忽略子路径（相对于 `base_url`）在数组中的内部 URL（不区分大小写）。
  - `:skip_patterns` [数组]
    忽略子路径匹配数组中任意正则表达式的内部 URL。
  - `:only` [数组]
    忽略子路径不在数组中（不区分大小写）且不匹配 `:only_patterns` 的内部 URL。
  - `:only_patterns` [数组]
    忽略子路径不匹配数组中任意正则表达式且不在 `:only` 中的内部 URL。

  若爬虫有 `root_path`，空路径和 `/` 会自动跳过。
  若设置了 `:only` 或 `:only_patterns`，根路径会自动加入 `:only`。

  _注意：可通过 [`Entries`](./filter-reference.md#entriesfilter) 过滤器根据内容将页面排除在索引外。但其 URL 仍会在其他页面转为相对路径，尝试打开会返回 404。虽然不理想，但通常比维护长长的 `:skip` 列表更好。_

* [`AttributionFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/attribution.rb)

  - `:attribution` [字符串] **（必填）**
    包含版权和许可信息的 HTML 字符串。可参考其他爬虫示例。

* [`TitleFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/title.rb)

  - `:title` [字符串、布尔或 Proc]
    只要值不为 `false`，就为每页添加标题。
    若为 `nil`，标题为 [`Entries`](./filter-reference.md#entriesfilter) 过滤器确定的页面名称。否则为字符串或 Proc 返回值（对每页调用，参数为过滤器实例）。若 Proc 返回 `nil` 或 `false`，则不添加标题。
  - `:root_title` [字符串或布尔]
    仅对根页面覆盖 `:title` 选项。

  _注意：该过滤器默认禁用。_

### 过滤器前处理响应

这些方法在过滤器栈前运行，可直接处理响应。

* `process_response?(response)`

  判断响应是否应被处理。返回 `false` 时丢弃响应。

  适用于过滤空、无效或重定向页面等。

  示例：[lib/docs/scrapers/kotlin.rb](../lib/docs/scrapers/kotlin.rb)


* `parse(response)`

  解析 HTTP/文件响应，默认转为 Nokogiri 文档。

  若需在 Nokogiri 解析前修改 HTML 源码，可重写此方法。
  适用于保留非 pre 块代码段的空白符，因为 Nokogiri 可能会删除它们。

  示例：[lib/docs/scrapers/go.rb](../lib/docs/scrapers/go.rb)



## 保持爬虫最新

为保持爬虫最新，应重写 `get_latest_version(opts)` 方法。若定义了 `self.release`，应返回文档的最新版本。若未定义，则返回文档最后修改的 Epoch 时间。若文档永不变更，直接返回 `1.0.0`。该方法的结果会定期汇报在“文档版本报告” issue，帮助维护者跟踪过时文档。

为方便起见，`get_latest_version` 可用以下工具方法：

### 通用 HTTP 方法
* `fetch(url, opts)`

  发起 GET 请求并返回响应体。

  示例：[lib/docs/scrapers/bash.rb](../lib/docs/scrapers/bash.rb)
* `fetch_doc(url, opts)`

  发起 GET 请求并将 HTML 响应体转为 Nokogiri 文档。

  示例：[lib/docs/scrapers/git.rb](../lib/docs/scrapers/git.rb)
* `fetch_json(url, opts)`

  发起 GET 请求并将 JSON 响应体转为字典。

  示例：[lib/docs/scrapers/mdn/mdn.rb](../lib/docs/scrapers/mdn/mdn.rb)

### 包仓库方法
* `get_npm_version(package, opts)`

  返回指定 npm 包的最新版本。

  示例：[lib/docs/scrapers/bower.rb](../lib/docs/scrapers/bower.rb)

### GitHub 方法
* `get_latest_github_release(owner, repo, opts)`

  返回指定仓库最新 GitHub 发布的标签名。若标签名前有 "v"，会去除。

  示例：[lib/docs/scrapers/jsdoc.rb](../lib/docs/scrapers/jsdoc.rb)
* `get_github_tags(owner, repo, opts)`

  返回指定仓库的标签列表（[格式](https://developer.github.com/v3/repos/#list-tags)）。

  示例：[lib/docs/scrapers/liquid.rb](../lib/docs/scrapers/liquid.rb)
* `get_github_file_contents(owner, repo, path, opts)`

  返回指定仓库默认分支下指定文件的内容。

  示例：[lib/docs/scrapers/minitest.rb](../lib/docs/scrapers/minitest.rb)
* `get_latest_github_commit_date(owner, repo, opts)`

    返回指定仓库默认分支最近一次提交的日期。

    示例：[lib/docs/scrapers/reactivex.rb](../lib/docs/scrapers/reactivex.rb)

### GitLab 方法
* `get_gitlab_tags(hostname, group, project, opts)`

  返回指定仓库的标签列表（[格式](https://docs.gitlab.com/ee/api/tags.html)）。

  示例：[lib/docs/scrapers/gtk.rb](../lib/docs/scrapers/gtk.rb)
