**目录：**

* [概述](#概述)
* [实例方法](#实例方法)
* [核心过滤器](#核心过滤器)
* [自定义过滤器](#自定义过滤器)
  - [CleanHtmlFilter](#cleanhtmlfilter)
  - [EntriesFilter](#entriesfilter)

## 概述

过滤器使用 [HTML::Pipeline](https://github.com/jch/html-pipeline) 库。它们以 HTML 字符串或 [Nokogiri](http://nokogiri.org/) 节点作为输入，可选地对其进行修改和/或提取信息，然后输出结果。它们共同组成一个管道，每个过滤器将其输出传递给下一个过滤器的输入。每个文档页面在被复制到本地文件系统之前都会经过这个管道。

过滤器是 [`Docs::Filter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/core/filter.rb) 类的子类，并且需要实现一个 `call` 方法。一个基本实现如下：

```ruby
module Docs
  class CustomFilter < Filter
    def call
      doc
    end
  end
end
```

操作 Nokogiri 节点对象（`doc` 及相关方法）的过滤器称为 _HTML 过滤器_，不得操作 HTML 字符串（`html`）。反之，操作文档字符串表示的过滤器称为 _文本过滤器_，不得操作 Nokogiri 节点对象。这两类过滤器在爬虫中被分为两个堆栈，然后组合成一个管道，先调用 HTML 过滤器，再调用文本过滤器（更多细节见[此处](./scraper-reference.md#filter-stacks)）。这样可以避免多次解析文档。

`call` 方法必须根据过滤器类型返回 `doc` 或 `html`。

## 实例方法

* `doc` [Nokogiri::XML::Node]  
  容器元素的 Nokogiri 表示。  
  参见 [Nokogiri API 文档](http://www.rubydoc.info/github/sparklemotion/nokogiri/Nokogiri/XML/Node) 获取可用方法列表。

* `html` [String]  
  容器元素的字符串表示。

* `context` [Hash] **(冻结)**  
  爬虫的 `options`，以及一些额外的键：`:base_url`、`:root_url`、`:root_page` 和 `:url`。

* `result` [Hash]  
  用于存储页面元数据并向爬虫返回信息。  
  可能的键：

  - `:path` — 页面标准化路径
  - `:store_path` — 页面存储路径（等于 `:path`，末尾加 `.html`）
  - `:internal_urls` — 页面内发现的不同内部 URL 列表
  - `:entries` — 要添加到索引的 [`Entry`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/core/models/entry.rb) 对象

* `css`, `at_css`, `xpath`, `at_xpath`  
  `doc.css`、`doc.xpath` 等的快捷方式。

* `base_url`, `current_url`, `root_url` [Docs::URL]  
  分别为 `context[:base_url]`、`context[:url]` 和 `context[:root_url]` 的快捷方式。

* `root_path` [String]  
  `context[:root_path]` 的快捷方式。

* `subpath` [String]  
  当前 URL 相对于 base URL 的子路径。  
  _示例：如果 `base_url` 为 `example.com/docs`，`current_url` 为 `example.com/docs/file?raw`，返回值为 `/file`。_

* `slug` [String]  
  去除任何前导斜杠或 `.html` 扩展名的 `subpath`。  
  _示例：如果 `subpath` 为 `/dir/file.html`，返回值为 `dir/file`。_

* `root_page?` [Boolean]  
  如果当前页面是根页面，则返回 `true`。

* `initial_page?` [Boolean]  
  如果当前页面是根页面或其子路径属于爬虫的 `initial_paths`，则返回 `true`。

## 核心过滤器

* [`ContainerFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/container.rb) — 更改文档的根节点（移除外部所有内容）
* [`CleanHtmlFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/clean_html.rb) — 移除 HTML 注释、`<script>`、`<style>` 等
* [`NormalizeUrlsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/normalize_urls.rb) — 替换所有 URL 为完全限定形式
* [`InternalUrlsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/internal_urls.rb) — 检测内部 URL（需要爬取的）并替换为未限定的相对路径
* [`NormalizePathsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/normalize_paths.rb) — 使内部路径一致（如总以 `.html` 结尾）
* [`CleanLocalUrlsFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/clean_local_urls.rb) — 移除指向 localhost 的链接、iframe 和图片（仅限 `FileScraper`）
* [`InnerHtmlFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/inner_html.rb) — 将文档转换为字符串
* [`CleanTextFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/clean_text.rb) — 移除空节点
* [`AttributionFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/attribution.rb) — 添加许可信息和原文链接
* [`TitleFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/title.rb) — 在文档前添加标题（默认禁用）
* [`EntriesFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/entries.rb) — 用于提取页面元数据的抽象过滤器

## 自定义过滤器

爬虫可以有任意数量的自定义过滤器，但至少需要下面两种。

**注意：** 过滤器位于 [`lib/docs/filters`](https://github.com/freeCodeCamp/devdocs/tree/main/lib/docs/filters/) 目录。类名必须是文件名的 [CamelCase](http://api.rubyonrails.org/classes/String.html#method-i-camelize) 形式。

### `CleanHtmlFilter`

`CleanHtml` 过滤器负责在必要时清理 HTML 标记，并移除所有多余或非必要内容。最终只应保留核心文档内容。

Nokogiri 提供了许多类似 jQuery 的方法，便于查找和修改元素——参见 [API 文档](http://www.rubydoc.info/github/sparklemotion/nokogiri/Nokogiri/XML/Node)。

以下是涵盖常见用例的示例实现：

```ruby
module Docs
  class MyScraper
    class CleanHtmlFilter < Filter
      def call
        css('hr').remove
        css('#changelog').remove if root_page?

        # 将 id 属性设置在 <h3> 上，而不是空 <a> 上
        css('h3').each do |node|
          node['id'] = node.at_css('a')['id']
        end

        # 正确设置表头
        css('td.header').each do |node|
          node.name = 'th'
        end

        # 移除代码高亮
        css('pre').each do |node|
          node.content = node.content
        end

        doc
      end
    end
  end
end
```

**注意：**

* 空元素会在管道后续的核心 `CleanTextFilter` 自动移除。
* 虽然目标是得到页面的精简版本，但应尽量减少修改次数，以便代码易于维护。自定义 CSS 是规范化页面的首选方式（除了隐藏内容应始终通过移除标记实现）。
* 尽量记录过滤器的行为，尤其是仅适用于部分页面的修改，这将有助于后续文档的更新。

### `EntriesFilter`

`Entries` 过滤器负责提取页面的元数据，这些元数据由一组 _条目_ 表示，每个条目有名称、类型和路径。

底层使用以下两个模型来表示元数据：

* [`Entry(name, type, path)`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/core/models/entry.rb)
* [`Type(name, slug, count)`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/core/models/type.rb)

每个爬虫必须通过继承 [`Docs::EntriesFilter`](https://github.com/freeCodeCamp/devdocs/blob/main/lib/docs/filters/core/entries.rb) 类实现自己的 `EntriesFilter`。基类已实现 `call` 方法，并包含四个可被子类重写的方法：

* `get_name` [String]  
  默认条目的名称（即页面名称）。  
  通常从 `slug`（见上文）推断，或通过查找 HTML 标记获得。  
  **默认值：** `slug` 的修改版本（下划线替换为空格，斜杠替换为点）

* `get_type` [String]  
  默认条目的类型（即页面类型）。  
  没有类型的条目可以被搜索到，但不会在应用侧边栏中列出（除非没有其他条目有类型）。  
  **默认值：** `nil`

* `include_default_entry?` [Boolean]  
  是否包含默认条目。  
  当页面包含多个条目（由 `additional_entries` 返回）但自身没有名称/类型，或需要从索引中移除页面（如果没有额外条目）时使用。在这种情况下，页面不会被复制到本地文件系统，其他页面中的任何链接都会失效（如 [Scraper Reference](./scraper-reference.md) 所述，这有助于保持 `:skip` / `:skip_patterns` 选项的可维护性，或页面包含无法从其他地方访问的链接时）。  
  **默认值：** `true`

* `additional_entries` [Array]  
  额外条目列表。  
  每个条目由一个包含三个属性的数组表示：名称、片段标识符和类型。片段标识符指向 HTML 元素的 `id` 属性（通常是标题），与页面路径组合形成条目路径。若缺失或为 `nil`，则使用页面路径。若类型缺失或为 `nil`，则使用默认类型。  
  示例：`[ ['One'], ['Two', 'id'], ['Three', nil, 'type'] ]` 添加三个额外条目，第一个名为 "One"，使用默认路径和类型，第二个名为 "Two"，URL 片段为 "#id"，使用默认类型，第三个名为 "Three"，使用默认路径，类型为 "type"。  
  通常通过遍历标记生成列表。特殊情况也可为特定页面硬编码。  
  **默认值：** `[]`

以下访问器也可用，但不得被重写：

* `name` [String]  
  `get_name` 的记忆化版本（根页面为 `nil`）。

* `type` [String]  
  `get_type` 的记忆化版本（根页面为 `nil`）。

**注意：**

* 名称和类型的首尾空白会自动移除。
* 名称在整个文档中必须唯一，并尽量简短（理想情况下少于 30 个字符）。如有可能，方法应通过添加 `()` 与属性区分，实例方法应通过 `Class#method` 或 `object.method` 区分与类方法。
* 可以在 `get_type` 中调用 `name`，或在 `get_name` 中调用 `type`，但不能互相递归，否则会导致栈溢出（即可以从类型推断名称，或从名称推断类型，但不能同时这样做）。不要直接调用 `get_name` 或 `get_type`，因为它们的值未记忆化。
* 根页面没有名称和类型（均为 `nil`）。`get_name` 和 `get_type` 不会在根页面上调用（但 `additional_entries` 会）。
* `Docs::EntriesFilter` 是 _HTML 过滤器_。必须添加到爬虫的 `html_filters` 堆栈。
* 尽量记录代码，尤其是特殊情况，这将有助于后续文档的更新。

**示例：**

```ruby
module Docs
  class MyScraper
    class EntriesFilter < Docs::EntriesFilter
      def get_name
        node = at_css('h1')
        result = node.content.strip
        result << ' event' if type == 'Events'
        result << '()' if node['class'].try(:include?, 'function')
        result
      end

      def get_type
        object, method = *slug.split('/')
        method ? object : 'Miscellaneous'
      end

      def additional_entries
        return [] if root_page?

        css('h2').map do |node|
          [node.content, node['id']]
        end
      end

      def include_default_entry?
        !at_css('.obsolete')
      end
    end
  end
end
```

返回 [[Home]]
