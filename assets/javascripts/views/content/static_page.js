app.views.StaticPage = class StaticPage extends app.View {
  static className = "_static"; // 静态类名

  static titles = {
    about: "关于",
    news: "新闻",
    help: "用户指南",
    notFound: "404",
  };

  deactivate() {
    if (super.deactivate(...arguments)) {
      this.empty(); // 清空内容
      this.page = null; // 页面设为null
    }
  }

  render(page) {
    this.page = page;
    this.html(this.tmpl(`${this.page}Page`)); // 渲染页面模板
  }

  getTitle() {
    return this.constructor.titles[this.page]; // 获取标题
  }

  onRoute(context) {
    this.render(context.page || "notFound"); // 路由处理
  }
};
