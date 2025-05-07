const error = function (title, text, links) {
  if (text == null) {
    text = "";
  }
  if (links == null) {
    links = "";
  }
  if (text) {
    text = `<p class="_error-text">${text}</p>`;
  }
  if (links) {
    links = `<p class="_error-links">${links}</p>`;
  }
  return `<div class="_error"><h1 class="_error-title">${title}</h1>${text}${links}</div>`;
};

const back = '<a href="#" data-behavior="back" class="_error-link">返回</a>';

app.templates.notFoundPage = () =>
  error(
    " 未找到页面。 ",
    " 该页面可能在源文档中缺失，或者这可能是一个错误。 ",
    back,
  );

app.templates.pageLoadError = () =>
  error(
    " 页面加载失败。 ",
    ` 该页面可能在服务器上缺失（请尝试重新加载应用），或者您可能处于离线状态（重新联网后可尝试<a href="/offline">安装文档以供离线使用</a>）。<br>
如果您已联网但仍然看到此信息，可能是由于代理或防火墙阻止了跨域请求。 `,
    ` ${back} &middot; <a href="/#${location.pathname}" target="_top" class="_error-link">重新加载</a>
&middot; <a href="#" class="_error-link" data-retry>重试</a> `,
  );

app.templates.bootError = () =>
  error(
    " 应用加载失败。 ",
    ` 请检查您的网络连接并尝试<a href="#" data-behavior="reload">重新加载</a>。<br>
如果您持续看到此信息，可能是由于代理或防火墙阻止了跨域请求。 `,
  );

app.templates.offlineError = function (reason, exception) {
  if (reason === "cookie_blocked") {
    return error(" 必须启用 Cookie 才能使用离线模式。 ");
  }

  reason = (() => {
    switch (reason) {
      case "not_supported":
        return ` DevDocs 需要 IndexedDB 来缓存文档以供离线访问。<br>
很遗憾，您的浏览器不支持 IndexedDB 或未启用该功能。 `;
      case "buggy":
        return ` DevDocs 需要 IndexedDB 来缓存文档以供离线访问。<br>
很遗憾，您的浏览器的 IndexedDB 实现存在缺陷，导致 DevDocs 无法使用。 `;
      case "private_mode":
        return ` 您的浏览器似乎正在使用隐私模式。<br>
这会阻止 DevDocs 缓存文档以供离线访问。`;
      case "exception":
        return ` 尝试打开 IndexedDB 数据库时发生错误：<br>
<code class="_label">${exception.name}: ${exception.message}</code> `;
      case "cant_open":
        return ` 尝试打开 IndexedDB 数据库时发生错误：<br>
<code class="_label">${exception.name}: ${exception.message}</code><br>
这可能是因为您正在使用隐私模式，或已禁止该域的离线存储。 `;
      case "version":
        return ` IndexedDB 数据库已被应用的较新版本修改。<br>
<a href="#" data-behavior="reload">重新加载页面</a>以使用离线模式。 `;
      case "empty":
        return ' IndexedDB 数据库似乎已损坏。请尝试<a href="#" data-behavior="reset">重置应用</a>。 ';
    }
  })();

  return error("离线模式不可用。", reason);
};

app.templates.unsupportedBrowser = `\
<div class="_fail">
  <h1 class="_fail-title">很抱歉，您的浏览器不受支持。</h1>
  <p class="_fail-text">DevDocs 是一个 API 文档浏览器，支持以下浏览器：
  <ul class="_fail-list">
    <li>最新版 Firefox、Chrome 或 Opera
    <li>Safari 11.1+
    <li>Edge 17+
    <li>iOS 11.3+
  </ul>
  <p class="_fail-text">
    如果您无法升级，我们深表歉意。
    我们决定优先考虑速度和新功能，而不是对旧版浏览器的支持。
  <p class="_fail-text">
    注意：如果您已经在使用上述浏览器之一，请检查您的设置和插件。
    本应用使用功能检测，而非 User Agent 检测。
  <p class="_fail-text">
    &mdash; <a href="https://twitter.com/DevDocs">@DevDocs</a>
</div>\
`;
