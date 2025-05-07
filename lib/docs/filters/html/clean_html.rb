require 'cgi'

module Docs
  class Html
    class CleanHtmlFilter < Filter
      def call
        css('section', 'div.section', 'div.row').each do |node|
          node.before(node.children).remove
        end

        if respond_to?(:slug) && (
          slug.start_with?('Reference/Elements/') ||
          slug.start_with?('Reference/Global_attributes/') ||
          slug.start_with?('Reference/Attributes/')
        )
          css('.section-content').each do |section|
            interactive = section.at_css('interactive-example')
            if interactive
              name = interactive['name'] || 'example'
              decoded_name = CGI.unescapeHTML(name)
              clean_name = decoded_name.gsub(/.*:\s*/, '').gsub(/[<>&\s]/, '').downcase

              if slug.start_with?('Reference/Elements/')
                src = "https://interactive-examples.mdn.mozilla.net/pages/tabbed/#{clean_name}.html"
              elsif slug.start_with?('Reference/Global_attributes/') || slug.start_with?('Reference/Attributes/')
                src = "https://interactive-examples.mdn.mozilla.net/pages/tabbed/attribute-#{clean_name}.html"
              end

              iframe = Nokogiri::HTML::DocumentFragment.parse(
                %Q{<iframe class="interactive is-tabbed-shorter-height" height="200" src="#{src}" title="MDN Web Docs Interactive Example" allow="clipboard-write" loading="lazy"></iframe>}
              )
              section.children.remove
              section.add_child(iframe)
            end
          end
        end

        doc
      end
    end
  end
end