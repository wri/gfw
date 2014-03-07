module Api
  class Blog
    include HTTParty

    base_uri ENV['BLOG_HOST']

    def self.find_post_by_country(name)
      options = { :query => {
                              :tag => name,
                              :feed => "rss2"
                            }
                }

      response = get('/', options)

      response['rss']['channel']['item']
    end
  end
end
