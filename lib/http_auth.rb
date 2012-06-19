module Gfw

  module HttpAuth
    DEMO_USER = {'gfw' => 'gfw'}

    def self.included(base)
      base.before_filter :authentication_check
    end

    def authentication_check
      return unless Rails.env.production?

      authenticate_or_request_with_http_basic do |user, password|
        DEMO_USER[user] == password
      end
    end

  end

end
