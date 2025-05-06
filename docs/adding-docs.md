添加文档可能看起来是一项艰巨的任务，但一旦掌握了方法，其实非常简单。如果遇到困难，欢迎随时[在 Discord 上寻求帮助](https://discord.gg/PRyKn3Vbay)。

**注意：**在提交新文档前，请先阅读[贡献指南](../.github/CONTRIBUTING.md)。

1. 在 `lib/docs/scrapers/` 目录下创建一个 `Docs::UrlScraper` 或 `Docs::FileScraper` 的子类。类名应为文件名的 [PascalCase](http://api.rubyonrails.org/classes/String.html#method-i-camelize) 形式（例如 `my_doc` → `MyDoc`）。
2. 添加合适的类属性和过滤器选项（参见 [Scraper Reference](./scraper-reference.md) 页面）。
3. 检查 scraper 是否已在 `thor docs:list` 中列出。
4. 在 `lib/docs/filters/[my_doc]/` 目录下为 scraper 创建专用过滤器，并将其添加到类的[过滤器栈](./scraper-reference.md#filter-stacks)。你可以创建任意数量的过滤器，但至少需要以下两种：
   * 一个 [`CleanHtml`](./filter-reference.md#cleanhtmlfilter) 过滤器，用于清理 HTML 标记（如为标题添加 `id` 属性）并移除所有多余或非必要内容。
   * 一个 [`Entries`](./filter-reference.md#entriesfilter) 过滤器，用于确定页面的元数据（条目列表，每个条目包含名称、类型和路径）。
   更多关于过滤器的细节请参见 [Filter Reference](./filter-reference.md) 页面。
5. 使用 `thor docs:page [my_doc] [path]` 命令，检查 scraper 是否正常工作。文件会出现在 `public/docs/[my_doc]/` 目录下（该命令不会影响应用内的索引）。此处的 `path` 指远程路径（若使用 `UrlScraper`）或本地路径（若使用 `FileScraper`）。
6. 使用 `thor docs:generate [my_doc] --force` 命令生成完整文档。你还可以使用 `--verbose` 选项查看哪些文件被创建/更新/删除（便于了解自上次运行以来的变化），以及 `--debug` 选项查看哪些 URL 被请求并加入队列（便于定位哪些页面添加了不需要的 URL）。
7. 启动服务器，打开应用，启用文档，查看实际效果。
8. 调整 scraper/过滤器，并重复第 5、6 步，直到页面和元数据都符合要求。
9. 如需自定义页面样式，在 `assets/stylesheets/pages/` 目录下创建 SCSS 文件，并在 `application.css.scss` 中导入。文件名和 CSS 类应为 `_[type]`，其中 [type] 等于 scraper 的 `type` 属性（同类型的文档共用自定义 CSS 和 JS）。将 type 设为 `simple` 时，会应用 `assets/stylesheets/pages/_simple.scss` 中的通用样式，适用于样式变动较少的文档。
10. 如需添加语法高亮或自定义 JavaScript，在 `assets/javascripts/views/pages/` 目录下创建文件（可参考其他文件的实现方式）。
11. 在 `public/icons/docs/[my_doc]/` 目录下添加文档的图标，需提供 16x16 和 32x32 像素两种格式。每次（重新）启动本地 DevDocs 实例时，图标精灵表会自动生成。
12. 将文档的版权信息添加到 `options[:attribution]`。这些信息会显示在 [about](https://devdocs.io/about) 页面上的表格中，并按字母顺序排列。请参考现有 scraper 的排版方式。
13. 确保 `thor updates:check [my_doc]` 能正确显示最新版本。

如果文档包含数百页以上且可下载，建议本地抓取（如使用 `FileScraper`），这样开发过程会更快，也能避免对源站点造成过大压力。（如果 scraper 依赖本地环境也没关系，只需在 pull request 中说明其工作方式即可。）

最后，尽量通过注释详细记录 scraper 和过滤器的行为（如为何忽略某些 URL、移除哪些 HTML 标记、为何这样处理元数据等）。这样有助于后续文档的维护和更新。
