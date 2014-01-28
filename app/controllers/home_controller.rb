class HomeController < ApplicationController

  before_filter :load_stories, :load_alerts, :only => [:index]

  private

    def load_stories
      @stories_count = Api::Story.since(1.year.ago.to_date.to_s).count

      @featured = Api::Story.featured.first(3)
    end

    def load_alerts
      @alerts_count = Api::Country.all['total_count']
    end

end
