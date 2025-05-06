const notif = function (title, html) {
  html = html.replace(/<a /g, '<a class="_notif-link" ');
  return ` <h5 class="_notif-title">${title}</h5>
${html}
<button type="button" class="_notif-close" title="关闭"><svg><use xlink:href="#icon-close"/></svg>关闭</a>\
`;
};

const textNotif = (title, message) =>
  notif(title, `<p class="_notif-text">${message}`);

app.templates.notifUpdateReady = () =>
  textNotif(
    '<span data-behavior="reboot">DevDocs 已更新。</span>',
    '<span data-behavior="reboot"><a href="#" data-behavior="reboot">重新加载页面</a>以使用新版本。</span>',
  );

app.templates.notifError = () =>
  textNotif(
    " 哎呀，发生了一个错误。 ",
    ` 请尝试<a href="#" data-behavior="hard-reload">重新加载</a>，如果问题仍然存在，
<a href="#" data-behavior="reset">重置应用</a>。<br>
你也可以在<a href="https://github.com/freeCodeCamp/devdocs/issues/new" target="_blank" rel="noopener">GitHub</a>上报告此问题。 `,
  );

app.templates.notifQuotaExceeded = () =>
  textNotif(
    " 离线数据库已超出大小限制。 ",
    " 很遗憾，这个配额无法通过程序检测，且数据库在超出配额时无法打开，因此已被重置。 ",
  );

app.templates.notifCookieBlocked = () =>
  textNotif(
    " 请启用 Cookie。 ",
    " 如果禁用了 Cookie，DevDocs 将无法正常工作。 ",
  );

app.templates.notifInvalidLocation = () =>
  textNotif(
    ` DevDocs 必须从 ${app.config.production_host} 加载 `,
    " 否则可能会出现问题。 ",
  );

app.templates.notifImportInvalid = () =>
  textNotif(
    " 哎呀，发生了一个错误。 ",
    " 你选择的文件无效。 ",
  );

app.templates.notifNews = (news) =>
  notif(
    "更新日志",
    `<div class="_notif-content _notif-news">${app.templates.newsList(news, {
      years: false,
    })}</div>`,
  );

app.templates.notifUpdates = function (docs, disabledDocs) {
  let doc;
  let html = '<div class="_notif-content _notif-news">';

  if (docs.length > 0) {
    html += '<div class="_news-row">';
    html += '<ul class="_notif-list">';
    for (doc of docs) {
      html += `<li>${doc.name}`;
      if (doc.release) {
        html += ` <code>&rarr;</code> ${doc.release}`;
      }
    }
    html += "</ul></div>";
  }

  if (disabledDocs.length > 0) {
    html += '<div class="_news-row"><p class="_news-title">已禁用：';
    html += '<ul class="_notif-list">';
    for (doc of disabledDocs) {
      html += `<li>${doc.name}`;
      if (doc.release) {
        html += ` <code>&rarr;</code> ${doc.release}`;
      }
      html += '<span class="_notif-info"><a href="/settings">启用</a></span>';
    }
    html += "</ul></div>";
  }

  return notif("更新", `${html}</div>`);
};

app.templates.notifShare = () =>
  textNotif(
    " 你好！ ",
    ` 喜欢 DevDocs 吗？请通过分享链接到
<a href="https://out.devdocs.io/s/tw" target="_blank" rel="noopener">推特</a>、<a href="https://out.devdocs.io/s/fb" target="_blank" rel="noopener">脸书</a>、
<a href="https://out.devdocs.io/s/re" target="_blank" rel="noopener">Reddit</a>等平台，帮助我们让更多开发者了解。<br>谢谢 :) `,
  );

app.templates.notifUpdateDocs = () =>
  textNotif(
    " 有文档更新可用。 ",
    ' <a href="/offline">立即安装</a>以避免页面损坏。 ',
  );

app.templates.notifAnalyticsConsent = () =>
  textNotif(
    " 跟踪 Cookie ",
    ` 我们希望通过 Google Analytics 和 Gauges 收集 DevDocs 的匿名使用数据。
请确认是否接受我们的跟踪 Cookie。你可以随时在设置中更改决定。
<br><span class="_notif-right"><a href="#" data-behavior="accept-analytics">接受</a> 或 <a href="#" data-behavior="decline-analytics">拒绝</a></span> `,
  );
