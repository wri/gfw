class HomeController < ApplicationController

  before_filter :load_stories, :load_alerts, :only => [:index]

  private

    def one_year_ago
      1.year.ago.to_date.strftime("%Y-%m-%d")
    end

    def load_stories
      @stories_count = Api::Story.since(one_year_ago).count

      @featured = Api::Story.featured.first(3)
    end

    def load_alerts
      @alerts_count = Api::Country.all['total_count']
    end

end
