module Api
  class Blog
    include HTTParty

    def self.find_post_by_country(name)
      options = { :query => {
                              :tag => name,
                              :feed => "rss2"
                            }
                }

      response = get("#{ENV['BLOG_HOST']}/", options)

      response['rss']['channel']['item']
    end
  end
end
