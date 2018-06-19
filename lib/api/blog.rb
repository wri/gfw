module Api
  class Blog
    include HTTParty

    def self.find_by_country(country)
      response = HTTParty.get("#{ENV['GFW_BLOG_HOST']}", query: { tag: country['name'].downcase.gsub(" ", "_"), feed: "rss2" })

      blog_stories = []

      if response['rss']['channel']['item'].present?
        response['rss']['channel']['item'].is_a?(Array) ? response['rss']['channel']['item'][0] : response['rss']['channel']['item']
      end rescue nil
    end
  end
end
