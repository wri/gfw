class HomeController < ApplicationController

  skip_before_filter :check_terms, :only => [:accept_and_redirect]
  before_filter :load_stories, :load_alerts, :only => [:index]

  def accept_and_redirect
    cookies.permanent[ENV['TERMS_COOKIE'].to_sym] = true

    redirect_to cookies[:go_to].nil? ? root_path : cookies[:go_to]
  end

  private

    def load_stories
      @stories_count = Api::Story.since(1.year.ago.to_date.to_s).count

      @featured = Api::Story.featured.first(3)
    end

    def load_alerts
      @alerts_count = Api::Country.all['total_count']
    end

end
