module Docs
  class Html
    class EntriesFilter < Docs::EntriesFilter
      ADDITIONAL_ENTRIES = { 'Reference/Elements/Heading_Elements' => (1..6).map { |n| ["h#{n}"] } }

      def get_name
        name = super
        name.sub!('Guides.', '')
        name.sub!('How to.', '')
        name.sub!('Reference.Elements.', '').try(:downcase!)
        name.sub!('Reference.Attributes.', '').try(:concat, ' (attribute)')
        name.sub!('Reference.Global attributes.', '').try(:concat, ' (global attribute)')
        name.sub!(/input\.([-\w]+)/, 'input type="\1"')
        name.sub!(/script\.type\.([-\w]+)/, 'script type="\1"')
        name.sub!(/meta\.name\.([-\w]+)/, 'meta name="\1"')
        name
      end

      def get_type
        # return 'Miscellaneous' if slug.include?('CORS') || slug.include?('Using')

        if at_css('.deprecated', '.non-standard', '.obsolete')
          'Obsolete'
        elsif slug.start_with?('Guides/')
          'Guides'
        elsif slug.start_with?('How_to/')
          'How to'
        elsif slug.start_with?('Reference/Global_attributes/')
          'Attributes(Global)'
        elsif slug.start_with?('Reference/Attributes/')
          'Attributes'
        elsif slug.start_with?('Reference/Elements/')
          'Elements'
        else
          'Miscellaneous'
        end
      end

      def include_default_entry?
        return false if %w(Reference/Elements/Heading_Elements).include?(slug)
        (node = doc.at_css '.overheadIndicator, .blockIndicator').nil? || node.content.exclude?('not on a standards track')
      end

      def additional_entries
        return ADDITIONAL_ENTRIES[slug] if ADDITIONAL_ENTRIES.key?(slug)

        if slug == 'Reference/Attributes'
          css('.table-container table').flat_map do |table|
            table.css('td:first-child').each_with_object([]) do |node, entries|
              name = node.at_css('code') ? node.at_css('code').content.strip.gsub(/[<>]/, '') : node.content.strip.gsub(/[<>]/, '')
              suffixes = []

              # 判断全局属性
              is_global = node.next_element && node.next_element.content.include?('全局属性')

              # 判断属性状态
              icon_map = {
                'icon-deprecated'   => 'deprecated',
                'icon-experimental' => 'experimental',
                'icon-nonstandard'  => 'nonstandard'
              }
              states = []
              icon_map.each do |icon_class, label|
                states << label if node.parent.at_css(".#{icon_class}")
              end

              # 拼接后缀
              if states.any?
                suffix = "#{states.uniq.join(' & ')} attribute"
              else
                suffix = is_global ? 'global attribute via table' : 'attribute via table'
              end

              full_name = "#{name} (#{suffix})"
              id = node.parent['id'] = full_name.parameterize
              entries << [full_name, id, 'Attributes(Table)']
            end
          end
        elsif slug == 'Reference/Elements'
          css('.table-container table').flat_map do |table|
            table.css('td:first-child').each_with_object([]) do |node, entries|
              name = node.at_css('code') ? node.at_css('code').content.strip.gsub(/[<>]/, '') : node.content.strip.gsub(/[<>]/, '')
              full_name = "#{name} (element via table)"
              id = node.parent['id'] = full_name.parameterize
              entries << [full_name, id, 'Elements(Table)']
            end
          end
        elsif slug == 'Link_types'
          css('.standard-table td:first-child > code').map do |node|
            name = node.content.strip
            id = node.parent.parent['id'] = name.parameterize
            name.prepend 'rel: '
            [name, id, 'Attributes']
          end
        else
          []
        end
      end
    end
  end
end