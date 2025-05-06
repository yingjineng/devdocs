app.templates.offlinePage = (docs) => `\
<h1 class="_lined-heading">离线文档</h1>

<div class="_docs-tools">
  <label>
    <input type="checkbox" name="autoUpdate" value="1" ${
      app.settings.get("manualUpdate") ? "" : "checked"
    }>自动安装更新
  </label>
  <div class="_docs-links">
    <button type="button" class="_btn-link" data-action-all="install">全部安装</button><button type="button" class="_btn-link" data-action-all="update"><strong>全部更新</strong></button><button type="button" class="_btn-link" data-action-all="uninstall">全部卸载</button>
  </div>
</div>

<div class="_table">
  <table class="_docs">
    <tr>
      <th>文档</th>
      <th class="_docs-size">大小</th>
      <th>状态</th>
      <th>操作</th>
    </tr>
    ${docs}
  </table>
</div>
<p class="_note"><strong>注意：</strong>如果您的计算机磁盘空间不足且长时间未使用该应用，浏览器可能会删除 DevDocs 的离线数据。请在离线前加载此页面以确保数据仍然存在。
<h2 class="_block-heading">常见问题</h2>
<dl>
  <dt>这是如何工作的？
  <dd>每个页面都作为 <a href="https://devdocs.io/dom/indexeddb_api">IndexedDB</a> 中的键值对缓存（从单个文件下载）。<br>
      应用还使用 <a href="https://devdocs.io/dom/service_worker_api/using_service_workers">Service Worker</a> 和 <a href="https://devdocs.io/dom/web_storage_api">localStorage</a> 缓存资源和索引文件。
  <dt>我可以关闭标签页/浏览器吗？
  <dd>${canICloseTheTab()}
  <dt>如果我不更新某个文档会怎样？
  <dd>您将看到过时的内容，并且部分页面可能缺失或损坏，因为应用的其他部分（包括搜索和侧边栏的数据）使用的是自动更新的不同缓存机制。
  <dt>我发现了一个 bug，在哪里反馈？
  <dd>请在 <a href="https://github.com/freeCodeCamp/devdocs/issues">问题追踪器</a> 中反馈。谢谢！
  <dt>如何卸载/重置应用？
  <dd>点击 <a href="#" data-behavior="reset">这里</a>。
  <dt>为什么上面没有列出所有文档？
  <dd>您需要先在<a href="/settings">设置</a>中启用它们。
</dl>\
`;

var canICloseTheTab = function () {
  if (app.ServiceWorker.isEnabled()) {
    return ' 可以！即使离线，您也可以打开新标签页，访问 <a href="//devdocs.io">devdocs.io</a>，一切都会像在线一样正常工作（前提是您已提前安装好所需文档）。 ';
  } else {
    let reason = "在您的浏览器中不可用（或已被禁用）";

    if (app.config.env !== "production") {
      reason =
        "在您的 DevDocs 开发环境中被禁用（可通过设置 <code>ENABLE_SERVICE_WORKER</code> 环境变量为 <code>true</code> 启用）";
    }

    return ` 不可以。Service Worker ${reason}，因此离线加载 <a href="//devdocs.io">devdocs.io</a> 将无法使用。<br>
当前标签页在离线后仍可继续使用（前提是您已提前安装好所需文档）。 `;
  }
};

app.templates.offlineDoc = function (doc, status) {
  const outdated = doc.isOutdated(status);

  let html = `\
<tr data-slug="${doc.slug}"${outdated ? ' class="_highlight"' : ""}>
  <td class="_docs-name _icon-${doc.icon}">${doc.fullName}</td>
  <td class="_docs-size">${
    Math.ceil(doc.db_size / 100000) / 10
  }&nbsp;<small>MB</small></td>\
`;

  html += !(status && status.installed)
    ? `\
<td>-</td>
<td><button type="button" class="_btn-link" data-action="install">安装</button></td>\
`
    : outdated
      ? `\
<td><strong>已过期</strong></td>
<td><button type="button" class="_btn-link _bold" data-action="update">更新</button> - <button type="button" class="_btn-link" data-action="uninstall">卸载</button></td>\
`
      : `\
<td>最新</td>
<td><button type="button" class="_btn-link" data-action="uninstall">卸载</button></td>\
`;

  return html + "</tr>";
};
