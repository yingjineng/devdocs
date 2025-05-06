module Docs
  class Html
    class EntriesFilter < Docs::EntriesFilter
      ADDITIONAL_ENTRIES = { 'Reference/Elements/Heading_Elements' => (1..6).map { |n| ["h#{n}"] } }

      def get_name
        name = super
        name.sub!('Element.', '').try(:downcase!)
        name.sub!('Global attributes.', '').try(:concat, ' (attribute)')
        name.sub!(/input\.([-\w]+)/, 'input type="\1"')
        name
      end

      def get_type
        # return '其他' if slug.include?('CORS') || slug.include?('Using')


        if at_css('.deprecated', '.non-standard', '.obsolete')
          'Obsolete'
        elsif slug.start_with?('Guides/')
          'Guides'
        elsif slug.start_with?('How_to/')
          'How to'
        elsif slug.start_with?('Reference/Elements/')
          'Elements'
        elsif slug.start_with?('Reference/Attributes/')
          'Attributes'
        elsif slug.start_with?('Reference/Global_attributes/')
          'Global attributes'
        elsif slug.start_with?('Reference/Elements/input/') || slug.start_with?('Reference/Elements/script/type/') || slug.start_with?('Reference/Elements/meta/name/') 
          'Attributes by element'
        elsif slug.start_with?('Reference/Attributes/rel/')
          'Attribute values'
        else
          'Other'
        end
      end

      def include_default_entry?
        return false if %w(Element/Heading_Elements).include?(slug)
        (node = doc.at_css '.overheadIndicator, .blockIndicator').nil? || node.content.exclude?('not on a standards track')
      end

      def additional_entries
        return ADDITIONAL_ENTRIES[slug] if ADDITIONAL_ENTRIES.key?(slug)

        if slug == 'Reference/Attributes'
          css('.standard-table td:first-child').each_with_object [] do |node, entries|
            next if node.next_element.content.include?('Global attribute')
            name = "#{node.content.strip} (attribute)"
            name = "#{node.at_css('code').content.strip} (attribute)" if node.at_css('code')
            id = node.parent['id'] = name.parameterize
            entries << [name, id, 'Attributes']
          end
        elsif slug == 'Link_types'
          css('.standard-table td:first-child > code').map do |node|
            name = node.content.strip
            name = "#{node.at_css('code').content.strip} (attribute)" if node.at_css('code')
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
