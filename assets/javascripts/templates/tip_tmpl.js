app.templates.tipKeyNav = () => `\
<p class="_notif-text">
  <strong>小贴士</strong>
  <span class="_notif-info">(点击关闭)</span>
<p class="_notif-text">
  按下${
    app.settings.get("arrowScroll") ? '<code class="_label">shift</code> +' : ""
  } <code class="_label">&darr;</code> <code class="_label">&uarr;</code> <code class="_label">&larr;</code> <code class="_label">&rarr;</code> 可导航侧边栏。<br>
  按 <code class="_label">空格 / shift 空格</code>${
    app.settings.get("arrowScroll")
      ? ' 或 <code class="_label">&darr;/&uarr;</code>'
      : '，<code class="_label">alt &darr;/&uarr;</code> 或 <code class="_label">shift &darr;/&uarr;</code>'
  } 可滚动页面。
<p class="_notif-text">
  <a href="/help#shortcuts" class="_notif-link">查看所有键盘快捷键</a>\
`;
