require Rails.root.join('lib/http_auth')
ActionController::Base.send(:include, Gfw::HttpAuth)
