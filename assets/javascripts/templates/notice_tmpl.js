const notice = (text) => `<p class="_notice-text">${text}</p>`;

app.templates.singleDocNotice = (doc) =>
  notice(` 您正在浏览 ${doc.fullName} 文档。要浏览所有文档，请访问
<a href="//${app.config.production_host}" target="_top">${app.config.production_host}</a>（或按 <code>esc</code>）。`);

app.templates.disabledDocNotice = () =>
  notice(` <strong>此文档已被禁用。</strong>
要启用它，请前往 <a href="/settings" class="_notice-link">偏好设置</a>。`);
