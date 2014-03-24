module Api
  class Blog
    include HTTParty

    def self.find_by_country(country)
      response = HTTParty.get("#{ENV['BLOG_HOST']}/", query: { tag: country['name'].downcase.gsub(" ", "_"), feed: "rss2" })

      blog_stories = []

      if response['rss']['channel']['item'].present?
        response['rss']['channel']['item'].each do |s|
          blog_stories.push(s)
        end

        blog_stories[0]
      else
        nil
      end
    end
  end
end
