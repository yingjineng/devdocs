module Docs
  class Html < Mdn
    prepend FixInternalUrlsBehavior

    # release = '2024-08-20'
    self.name = 'HTML'
    # 修改为中文文档地址
    self.base_url = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML'
    self.links = {
      home: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML',
      code: 'https://github.com/mdn/content/tree/main/files/en-us/web/html'
    }

    html_filters.push 'html/clean_html', 'html/entries'

    options[:root_title] = 'HTML'

    # 路径替换规则同步为中文路径
    options[:replace_paths] = {
      '/Reference/Elements/h1' => '/Reference/Elements/Heading_Elements',
      '/Reference/Elements/h2' => '/Reference/Elements/Heading_Elements',
      '/Reference/Elements/h3' => '/Reference/Elements/Heading_Elements',
      '/Reference/Elements/h4' => '/Reference/Elements/Heading_Elements',
      '/Reference/Elements/h5' => '/Reference/Elements/Heading_Elements',
      '/Reference/Elements/h6' => '/Reference/Elements/Heading_Elements',
      '/Reference/Global_attributes/data-%2A' => '/Reference/Global_attributes/data-*'
    }

    options[:fix_urls] = ->(url) do
      url.sub! 'https://developer.mozilla.org/zh-CN/docs/HTML/', "#{Html.base_url}/" unless url.include?('Content_categories')
      url
    end

  end
end