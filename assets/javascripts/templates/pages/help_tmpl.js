app.templates.helpPage = function () {
  const ctrlKey = $.isMac() ? "cmd" : "ctrl";
  const navKey = $.isMac() ? "cmd" : "alt";
  const arrowScroll = app.settings.get("arrowScroll");

  const aliases = Object.entries(app.config.docs_aliases);
  const middle = Math.ceil(aliases.length / 2);
  const aliases_one = aliases.slice(0, middle);
  const aliases_two = aliases.slice(middle);

  return `\
<nav class="_toc" role="directory">
  <h3 class="_toc-title">目录</h3>
  <ul class="_toc-list">
    <li><a href="#managing-documentations">管理文档</a>
    <li><a href="#search">搜索</a>
    <li><a href="#shortcuts">键盘快捷键</a>
    <li><a href="#aliases">搜索别名</a>
  </ul>
</nav>

<h1 class="_lined-heading">用户指南</h1>

<h2 class="_block-heading" id="managing-documentations">管理文档</h2>
<p>
  可以在<a href="/settings">偏好设置</a>中启用或禁用文档。
  或者，你也可以在主搜索中搜索文档并点击结果中的“启用”链接来启用文档。
  为了更快更好的搜索，请只启用你计划积极使用的文档。
<p>
  启用文档后，它将成为搜索的一部分，并且可以在<a href="/offline">离线</a>区域下载其内容以供离线访问——在线时也能加快页面加载速度。

<h2 class="_block-heading" id="search">搜索</h2>
<p>
  搜索不区分大小写并忽略空格。它支持模糊匹配
  （例如 <code class="_label">bgcp</code> 匹配 <code class="_label">background-clip</code>）
  以及别名（完整列表见<a href="#aliases">下方</a>）。
<dl>
  <dt id="doc_search">在单个文档中搜索
  <dd>
    可以通过输入文档名称（或缩写）并按下 <code class="_label">tab</code>（移动端为 <code class="_label">space</code>）将搜索范围限定在单个文档。
    例如，要搜索 JavaScript 文档，输入 <code class="_label">javascript</code>
    或 <code class="_label">js</code>，然后按 <code class="_label">tab</code>。<br>
    要清除当前范围，清空搜索框并按 <code class="_label">backspace</code> 或
    <code class="_label">esc</code>。
  <dt id="url_search">通过 URL 预填搜索框
  <dd>
    访问 <a href="/#q=keyword" target="_top">devdocs.io/#q=keyword</a>，即可通过 URL 预填搜索框。
    <code class="_label">#q=</code> 后的字符将作为搜索关键词。<br>
    若要在单个文档中搜索，在关键词前加上文档名称（或缩写）和空格：
    <a href="/#q=js%20date" target="_top">devdocs.io/#q=js date</a>。
  <dt id="browser_search">使用地址栏搜索
  <dd>
    DevDocs 支持 OpenSearch。它可以很容易地作为大多数浏览器的搜索引擎安装：
    <ul>
      <li>在 Chrome 上，设置会自动完成。当 devdocs.io 在地址栏自动补全时，直接按 <code class="_label">tab</code> 即可
          （如需自定义关键字，请在 Chrome 设置中点击 <em>管理搜索引擎…</em>）。
      <li>在 Firefox 上，<a href="https://support.mozilla.org/en-US/kb/add-or-remove-search-engine-firefox#w_add-a-search-engine-from-the-address-bar">可从地址栏添加搜索</a>：
          点击地址栏中的 •••，选择 <em>添加搜索引擎</em>。然后，你可以在偏好设置中为该搜索引擎添加关键字。
</dl>
<p>
  <i>注意：上述搜索功能仅适用于已启用的文档。</i>

<h2 class="_block-heading" id="shortcuts">键盘快捷键</h2>
<h3 class="_shortcuts-title">侧边栏</h3>
<dl class="_shortcuts-dl">
  <dt class="_shortcuts-dt">
    ${arrowScroll ? '<code class="_shortcut-code">shift</code> + ' : ""}
    <code class="_shortcut-code">&darr;</code>
    <code class="_shortcut-code">&uarr;</code>
  <dd class="_shortcuts-dd">移动选中项
  <dt class="_shortcuts-dt">
    ${arrowScroll ? '<code class="_shortcut-code">shift</code> + ' : ""}
    <code class="_shortcut-code">&rarr;</code>
    <code class="_shortcut-code">&larr;</code>
  <dd class="_shortcuts-dd">展开/收起子列表
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">enter</code>
  <dd class="_shortcuts-dd">打开选中项
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">${ctrlKey} + enter</code>
  <dd class="_shortcuts-dd">在新标签页中打开选中项
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">alt + r</code>
  <dd class="_shortcuts-dd">在侧边栏中显示当前页面
</dl>
<h3 class="_shortcuts-title">浏览</h3>
<dl class="_shortcuts-dl">
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">${navKey} + &larr;</code>
    <code class="_shortcut-code">${navKey} + &rarr;</code>
  <dd class="_shortcuts-dd">后退/前进
  <dt class="_shortcuts-dt">
    ${
      arrowScroll
        ? '<code class="_shortcut-code">&darr;</code> ' +
          '<code class="_shortcut-code">&uarr;</code>'
        : '<code class="_shortcut-code">alt + &darr;</code> ' +
          '<code class="_shortcut-code">alt + &uarr;</code>' +
          "<br>" +
          '<code class="_shortcut-code">shift + &darr;</code> ' +
          '<code class="_shortcut-code">shift + &uarr;</code>'
    }
  <dd class="_shortcuts-dd">逐步滚动<br><br>
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">space</code>
    <code class="_shortcut-code">shift + space</code>
  <dd class="_shortcuts-dd">整屏滚动
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">${ctrlKey} + &uarr;</code>
    <code class="_shortcut-code">${ctrlKey} + &darr;</code>
  <dd class="_shortcuts-dd">滚动到顶部/底部
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">alt + f</code>
  <dd class="_shortcuts-dd">聚焦内容区第一个链接<br>（按 tab 聚焦其他链接）
</dl>
<h3 class="_shortcuts-title">应用</h3>
<dl class="_shortcuts-dl">
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">ctrl + ,</code>
  <dd class="_shortcuts-dd">打开偏好设置
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">esc</code>
  <dd class="_shortcuts-dd">清空搜索框 / 重置界面
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">?</code>
  <dd class="_shortcuts-dd">显示本页面
</dl>
<h3 class="_shortcuts-title">其他</h3>
<dl class="_shortcuts-dl">
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">alt + c</code>
  <dd class="_shortcuts-dd">复制原页面 URL
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">alt + o</code>
  <dd class="_shortcuts-dd">打开原页面
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">alt + g</code>
  <dd class="_shortcuts-dd">在 Google 上搜索
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">alt + s</code>
  <dd class="_shortcuts-dd">在 Stack Overflow 上搜索
  <dt class="_shortcuts-dt">
    <code class="_shortcut-code">alt + d</code>
  <dd class="_shortcuts-dd">在 DuckDuckGo 上搜索
</dl>
<p class="_note _note-green">
  <strong>提示：</strong> 如果光标不在搜索框中，按 <code class="_label">/</code> 或
  直接输入内容即可重新聚焦搜索框并开始显示新结果。

<h2 class="_block-heading" id="aliases">搜索别名</h2>
<div class="_aliases">
  <table>
    <tr>
      <th>词语
      <th>别名
    ${aliases_one
      .map(
        ([key, value]) =>
          `<tr><td class=\"_code\">${key}<td class=\"_code\">${value}`,
      )
      .join("")}
  </table>
  <table>
    <tr>
      <th>词语
      <th>别名
      ${aliases_two
        .map(
          ([key, value]) =>
            `<tr><td class=\"_code\">${key}<td class=\"_code\">${value}`,
        )
        .join("")}
  </table>
</div>
<p>欢迎在<a href="https://github.com/freeCodeCamp/devdocs/issues/new">GitHub</a>上建议新的别名。\
`;
};
