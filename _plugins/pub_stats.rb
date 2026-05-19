require 'bibtex'

module Jekyll
  class PubStatsGenerator < Generator
    safe true
    priority :high

    def generate(site)
      bib_path = File.join(site.source, '_bibliography', 'papers.bib')
      unless File.exist?(bib_path)
        Jekyll.logger.warn "PubStatsGenerator:", "Bibliography file not found at #{bib_path}"
        return
      end

      raw = File.read(bib_path)
      # Strip YAML front matter if present
      raw = raw.sub(/\A---.*?---\s*/m, '')

      begin
        bib = BibTeX.parse(raw)
      rescue => e
        Jekyll.logger.warn "PubStatsGenerator:", "Failed to parse bibliography: #{e.message}"
        return
      end

      journal_count = 0
      conference_count = 0
      workshop_count = 0
      other_count = 0

      bib.each do |entry|
        next unless entry.respond_to?(:type)

        type = entry.type.to_s.downcase
        if type == 'article'
          journal_count += 1
        elsif type == 'inproceedings'
          booktitle = entry[:booktitle].to_s.downcase
          abbr = entry[:abbr].to_s.downcase
          if booktitle.include?('workshop') || abbr.include?('workshop')
            workshop_count += 1
          else
            conference_count += 1
          end
        else
          other_count += 1
        end
      end

      total_count = journal_count + conference_count + workshop_count + other_count

      site.data['pub_counts'] = {
        'journal' => journal_count,
        'conference' => conference_count,
        'workshop' => workshop_count,
        'other' => other_count,
        'total' => total_count
      }
    end
  end
end
