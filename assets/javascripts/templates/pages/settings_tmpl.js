const themeOption = ({ label, value }, settings) => `\
<label class="_settings-label _theme-label">
  <input type="radio" name="theme" value="${value}"${
    settings.theme === value ? " checked" : ""
  }>
  ${label}
</label>\
`;

app.templates.settingsPage = (settings) => `\
<h1 class="_lined-heading">偏好设置</h1>

<div class="_settings-fieldset">
  <h2 class="_settings-legend">主题：</h2>
  <div class="_settings-inputs">
    ${
      settings.autoSupported
        ? themeOption(
            {
              label: "自动 <small>跟随系统设置</small>",
              value: "auto",
            },
            settings,
          )
        : ""
    }
    ${themeOption({ label: "浅色", value: "default" }, settings)}
    ${themeOption({ label: "深色", value: "dark" }, settings)}
  </div>
</div>

<div class="_settings-fieldset">
  <h2 class="_settings-legend">通用：</h2>

  <div class="_settings-inputs">
    <label class="_settings-label _setting-max-width">
      <input type="checkbox" form="settings" name="layout" value="_max-width"${
        settings["_max-width"] ? " checked" : ""
      }>启用固定宽度布局
    </label>
    <label class="_settings-label _setting-text-justify-hyphenate">
      <input type="checkbox" form="settings" name="layout" value="_text-justify-hyphenate"${
        settings["_text-justify-hyphenate"] ? " checked" : ""
      }>启用两端对齐和自动断字
    </label>
    <label class="_settings-label _hide-on-mobile">
      <input type="checkbox" form="settings" name="layout" value="_sidebar-hidden"${
        settings["_sidebar-hidden"] ? " checked" : ""
      }>自动隐藏和显示侧边栏
      <small>提示：拖动侧边栏边缘可调整大小。</small>
    </label>
    <label class="_settings-label _hide-on-mobile">
      <input type="checkbox" form="settings" name="noAutofocus" value="_no-autofocus"${
        settings.noAutofocus ? " checked" : ""
      }>禁用搜索框自动聚焦
    </label>
    <label class="_settings-label">
      <input type="checkbox" form="settings" name="autoInstall" value="_auto-install"${
        settings.autoInstall ? " checked" : ""
      }>自动下载文档以供离线使用
      <small>仅在你不关心带宽时启用此项。</small>
    </label>
    <label class="_settings-label _hide-in-development">
      <input type="checkbox" form="settings" name="analyticsConsent"${
        settings.analyticsConsent ? " checked" : ""
      }>启用跟踪 Cookie
      <small>勾选后，我们会启用 Google Analytics 和 Gauges 收集匿名流量信息。</small>
    </label>
    <label class="_settings-label _hide-on-mobile">
      <input type="checkbox" form="settings" name="noDocSpecificIcon"${
        settings.noDocSpecificIcon ? " checked" : ""
      }>禁用文档专属图标
      <small>勾选后，所有页面都将显示默认 DevDocs 图标。</small>
    </label>
  </div>
</div>

<div class="_settings-fieldset _hide-on-mobile">
  <h2 class="_settings-legend">滚动：</h2>

  <div class="_settings-inputs">
    <label class="_settings-label">
      <input type="checkbox" form="settings" name="smoothScroll" value="1"${
        settings.smoothScroll ? " checked" : ""
      }>使用平滑滚动
    </label>
    <label class="_settings-label _setting-native-scrollbar">
      <input type="checkbox" form="settings" name="layout" value="_native-scrollbars"${
        settings["_native-scrollbars"] ? " checked" : ""
      }>使用系统滚动条
    </label>
    <label class="_settings-label">
      <input type="checkbox" form="settings" name="arrowScroll" value="1"${
        settings.arrowScroll ? " checked" : ""
      }>使用方向键滚动主内容区
      <small>勾选后，使用 <code class="_label">shift</code> + <code class="_label">&uarr;</code><code class="_label">&darr;</code><code class="_label">&larr;</code><code class="_label">&rarr;</code> 导航侧边栏。</small>
    </label>
    <label class="_settings-label">
      <input type="checkbox" form="settings" name="spaceScroll" value="1"${
        settings.spaceScroll ? " checked" : ""
      }>搜索时使用空格键滚动
    </label>
    <label class="_settings-label">
      <input type="number" step="0.1" form="settings" name="spaceTimeout" min="0" max="5" value="${
        settings.spaceTimeout
      }"> 按空格键滚动的延迟
      <small>单位：秒</small>
    </label>
  </div>
</div>

<p class="_hide-on-mobile">
  <button type="button" class="_btn" data-action="export">导出</button>
  <label class="_btn _file-btn"><input type="file" form="settings" name="import" accept=".json">导入</label>

<p>
  <button type="button" class="_btn-link _reset-btn" data-behavior="reset">重置所有偏好和数据</button>\
`;
