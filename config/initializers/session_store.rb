# Be sure to restart your server when you modify this file.

Gfw::Application.config.session_store :cookie_store, key: '_gfw_session', :domain => ENV['GFW_HOST']
