app.templates.aboutPage = function () {
  let doc;
  const all_docs = app.docs.all().concat(...(app.disabledDocs.all() || []));
  // 按 doc.name 去重
  const docs = [];
  for (doc of all_docs) {
    if (!docs.find((d) => d.name === doc.name)) {
      docs.push(doc);
    }
  }
  return `\
<nav class="_toc" role="directory">
  <h3 class="_toc-title">目录</h3>
  <ul class="_toc-list">
    <li><a href="#copyright">版权</a>
    <li><a href="#plugins">插件</a>
    <li><a href="#faq">常见问题</a>
    <li><a href="#credits">致谢</a>
    <li><a href="#privacy">隐私政策</a>
  </ul>
</nav>

<h1 class="_lined-heading">DevDocs：API 文档浏览器</h1>
<p>DevDocs 将多个开发者文档整合在一个简洁有序的网页界面中，支持即时搜索、离线使用、移动端适配、深色主题、键盘快捷键等功能。
<p>DevDocs 是免费的 <a href="https://github.com/freeCodeCamp/devdocs">开源项目</a>。由 <a href="https://thibaut.me">Thibaut Courouble</a> 创建，并由 <a href="https://www.freecodecamp.org/">freeCodeCamp</a> 运营。
<p>关注最新动态：
<ul>
  <li>在 Twitter 上关注 <a href="https://twitter.com/DevDocs">@DevDocs</a>
  <li>在 <a href="https://github.com/freeCodeCamp/devdocs/subscription">GitHub</a> 关注项目 <iframe class="_github-btn" src="https://ghbtns.com/github-btn.html?user=freeCodeCamp&repo=devdocs&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="100" height="20" tabindex="-1"></iframe>
  <li>加入 <a href="https://discord.gg/PRyKn3Vbay">Discord</a> 聊天室
</ul>

<h2 class="_block-heading" id="copyright">版权与许可</h2>
<p class="_note">
  <strong>Copyright 2013&ndash;2025 Thibaut Courouble 及 <a href="https://github.com/freeCodeCamp/devdocs/graphs/contributors">其他贡献者</a></strong><br>
  本软件遵循 Mozilla Public License v2.0 许可协议。<br>
  源代码可在 <a href="https://github.com/freeCodeCamp/devdocs">github.com/freeCodeCamp/devdocs</a> 获取。<br>
  更多信息请参见 <a href="https://github.com/freeCodeCamp/devdocs/blob/main/COPYRIGHT">COPYRIGHT</a>
  和 <a href="https://github.com/freeCodeCamp/devdocs/blob/main/LICENSE">LICENSE</a> 文件。

<h2 class="_block-heading" id="plugins">插件与扩展</h2>
<ul>
  <li><a href="https://sublime.wbond.net/packages/DevDocs">Sublime Text 插件</a>
  <li><a href="https://atom.io/packages/devdocs">Atom 插件</a>
  <li><a href="https://marketplace.visualstudio.com/items?itemName=deibit.devdocs">Visual Studio Code 扩展</a>
  <li><a href="https://github.com/yannickglt/alfred-devdocs">Alfred 工作流</a>
  <li><a href="https://github.com/search?q=topic%3Adevdocs&type=Repositories">更多…</a>
</ul>

<h2 class="_block-heading" id="faq">常见问题</h2>
<dl>
  <dt>在哪里可以建议新文档和新功能？
  <dd>你可以在 <a href="https://trello.com/b/6BmTulfx/devdocs-documentation">Trello 看板</a> 上建议和投票新文档。<br>
      如果有具体的功能需求，请在 <a href="https://github.com/freeCodeCamp/devdocs/issues">问题追踪器</a> 提交。<br>
      也可以加入 <a href="https://discord.gg/PRyKn3Vbay">Discord</a> 聊天室与我们交流。
  <dt>在哪里可以报告 Bug？
  <dd>请在 <a href="https://github.com/freeCodeCamp/devdocs/issues">问题追踪器</a> 提交。感谢你的反馈！
</dl>

<h2 class="_block-heading" id="credits">致谢</h2>

<p><strong>特别感谢：</strong>
<ul>
  <li><a href="https://sentry.io/">Sentry</a> 和 <a href="https://get.gaug.es/?utm_source=devdocs&utm_medium=referral&utm_campaign=sponsorships" title="实时网页分析">Gauges</a> 为 DevDocs 提供免费账号
  <li><a href="https://out.devdocs.io/s/maxcdn">MaxCDN</a>、<a href="https://out.devdocs.io/s/shopify">Shopify</a>、<a href="https://out.devdocs.io/s/jetbrains">JetBrains</a> 和 <a href="https://out.devdocs.io/s/code-school">Code School</a> 曾赞助 DevDocs
  <li><a href="https://www.heroku.com">Heroku</a> 和 <a href="https://newrelic.com/">New Relic</a> 提供优质免费服务
  <li><a href="https://www.jeremykratz.com/">Jeremy Kratz</a> 设计 C/C++ 图标
</ul>

<div class="_table">
  <table class="_credits">
    <tr>
      <th>文档
      <th>版权/许可
      <th>源代码
    ${docs
      .map(
        (doc) =>
          `<tr><td><a href="${doc.links?.home}">${doc.name}</a></td><td>${doc.attribution}</td><td><a href="${doc.links?.code}">源代码</a></td></tr>`,
      )
      .join("")}
  </table>
</div>

<h2 class="_block-heading" id="privacy">隐私政策</h2>
<ul>
  <li><a href="https://devdocs.io">devdocs.io</a>（“应用”）由 <a href="https://www.freecodecamp.org/">freeCodeCamp</a>（“我们”）运营。
  <li>我们不会通过应用收集个人信息。
  <li>我们使用 Google Analytics 和 Gauges 收集匿名流量信息（需您同意）。您可在 <a href="/settings">设置</a> 中更改决定。
  <li>我们使用 Sentry 收集崩溃数据以改进应用。
  <li>应用使用 Cookie 存储用户偏好设置。
  <li>使用本应用即表示您同意本政策。如不同意，请勿使用本应用。
  <li>如有隐私相关问题，请发送邮件至 <a href="mailto:privacy@freecodecamp.org">privacy@freecodecamp.org</a>。
</ul>\
`;
};
