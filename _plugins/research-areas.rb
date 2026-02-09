require 'bibtex'
require 'json'

module Jekyll
  class ResearchAreasGenerator < Generator
    safe true
    priority :high

    def generate(site)
      bib_path = File.join(site.source, '_bibliography', 'papers.bib')
      return unless File.exist?(bib_path)

      # Read and strip YAML front matter (--- ... ---)
      raw = File.read(bib_path)
      raw = raw.sub(/\A---.*?---\s*/m, '')

      bib = BibTeX.parse(raw)
      area_mapping = {}
      author_mapping = {}

      bib.each do |entry|
        next unless entry.respond_to?(:fields)

        title = entry[:title].to_s.gsub(/[{}]/, '').gsub(/\$([^$]*)\$/) { $1.strip }
        venue = entry[:abbr].to_s.gsub(/[{}]/, '') if entry.fields.key?(:abbr)
        year  = entry[:year].to_s.to_i
        url   = entry[:url].to_s.gsub(/[{}]/, '')

        pub = { 'title' => title, 'venue' => venue || '', 'year' => year, 'url' => url }

        # Research area mapping
        if entry.fields.key?(:research_areas)
          areas = entry[:research_areas].to_s.split(',').map(&:strip)
          areas.each do |area|
            area_mapping[area] ||= []
            area_mapping[area] << pub
          end
        end

        # Author mapping (normalize: lowercase, remove dots/asterisks, sort words)
        if entry.respond_to?(:author)
          entry.author.each do |name|
            first = name.first.to_s.gsub(/[.*{}]/, '').strip
            last  = name.last.to_s.gsub(/[.*{}]/, '').strip
            key = "#{first} #{last}".downcase.split.sort.join(' ')
            next if key.empty?
            author_mapping[key] ||= []
            author_mapping[key] << pub
          end
        end
      end

      # Sort by year descending and deduplicate
      area_mapping.each_value { |pubs| pubs.sort_by! { |p| -p['year'] } }
      author_mapping.each_value do |pubs|
        pubs.uniq! { |p| p['title'] }
        pubs.sort_by! { |p| -p['year'] }
      end

      site.data['research_publications'] = area_mapping
      site.data['author_publications'] = author_mapping
    end
  end
end
