const { templates } = app;

// 箭头 SVG 图标
const arrow = '<svg class="_list-arrow"><use xlink:href="#icon-dir"/></svg>';

// 侧边栏文档模板
templates.sidebarDoc = function (doc, options) {
  if (options == null) {
    options = {};
  }
  let link = `<a href="${doc.fullPath()}" class="_list-item _icon-${doc.icon} `;
  link += options.disabled ? "_list-disabled" : "_list-dir";
  link += `" data-slug="${doc.slug}" title="${doc.fullName}" tabindex="-1">`;
  if (options.disabled) {
    link += `<span class="_list-enable" data-enable="${doc.slug}">启用</span>`;
  } else {
    link += arrow;
  }
  if (doc.release) {
    link += `<span class="_list-count">${doc.release}</span>`;
  }
  link += `<span class="_list-text">${doc.name}`;
  if (options.fullName || (options.disabled && doc.version)) {
    link += ` ${doc.version}`;
  }
  return link + "</span></a>";
};

// 侧边栏类型模板
templates.sidebarType = (type) =>
  `<a href="${type.fullPath()}" class="_list-item _list-dir" data-slug="${
    type.slug
  }" tabindex="-1">${arrow}<span class="_list-count">${
    type.count
  }</span><span class="_list-text">${$.escape(type.name)}</span></a>`;

// 侧边栏条目模板
templates.sidebarEntry = (entry) =>
  `<a href="${entry.fullPath()}" class="_list-item _list-hover" tabindex="-1">${$.escape(
    entry.name,
  )}</a>`;

// 侧边栏搜索结果模板
templates.sidebarResult = function (entry) {
  let addons =
    entry.isIndex() && app.disabledDocs.contains(entry.doc)
      ? `<span class="_list-enable" data-enable="${entry.doc.slug}">启用</span>`
      : '<span class="_list-reveal" data-reset-list title="在列表中显示"></span>';
  if (entry.doc.version && !entry.isIndex()) {
    addons += `<span class="_list-count">${entry.doc.short_version}</span>`;
  }
  return `<a href="${entry.fullPath()}" class="_list-item _list-hover _list-result _icon-${
    entry.doc.icon
  }" tabindex="-1">${addons}<span class="_list-text">${$.escape(
    entry.name,
  )}</span></a>`;
};

// 侧边栏无结果模板
templates.sidebarNoResults = function () {
  let html = ' <div class="_list-note">无结果。</div> ';
  if (!app.isSingleDoc() && !app.disabledDocs.isEmpty()) {
    html += `\
<div class="_list-note">注意：文档需要<a href="/settings" class="_list-note-link">启用</a>后才能出现在搜索结果中。</div>\
`;
  }
  return html;
};

// 侧边栏分页链接模板
templates.sidebarPageLink = (count) =>
  `<span role="link" class="_list-item _list-pagelink">显示更多… (${count})</span>`;

// 侧边栏标签模板
templates.sidebarLabel = function (doc, options) {
  if (options == null) {
    options = {};
  }
  let label = '<label class="_list-item';
  if (!doc.version) {
    label += ` _icon-${doc.icon}`;
  }
  label += `"><input type="checkbox" name="${doc.slug}" class="_list-checkbox" `;
  if (options.checked) {
    label += "checked";
  }
  return label + `><span class="_list-text">${doc.fullName}</span></label>`;
};

// 侧边栏多版本文档模板
templates.sidebarVersionedDoc = function (doc, versions, options) {
  if (options == null) {
    options = {};
  }
  let html = `<div class="_list-item _list-dir _list-rdir _icon-${doc.icon}`;
  if (options.open) {
    html += " open";
  }
  return (
    html +
    `" tabindex="0">${arrow}${doc.name}</div><div class="_list _list-sub">${versions}</div>`
  );
};

// 侧边栏已禁用文档标题模板
templates.sidebarDisabled = (options) =>
  `<h6 class="_list-title">${arrow}已禁用 (${options.count}) <a href="/settings" class="_list-title-link" tabindex="-1">自定义</a></h6>`;

// 侧边栏已禁用文档列表模板
templates.sidebarDisabledList = (html) =>
  `<div class="_disabled-list">${html}</div>`;

// 侧边栏多版本已禁用文档模板
templates.sidebarDisabledVersionedDoc = (doc, versions) =>
  `<a class="_list-item _list-dir _icon-${doc.icon} _list-disabled" data-slug="${doc.slug_without_version}" tabindex="-1">${arrow}${doc.name}</a><div class="_list _list-sub">${versions}</div>`;

// 文档选择器头部模板
templates.docPickerHeader =
  '<div class="_list-picker-head"><span>文档</span> <span>启用</span></div>';

// 文档选择器提示模板
templates.docPickerNote = `\
<div class="_list-note">提示：为获得更快更好的搜索结果，请只选择你需要的文档。</div>
<a href="https://trello.com/b/6BmTulfx/devdocs-documentation" class="_list-link" target="_blank" rel="noopener">为新文档投票</a>\
`;
