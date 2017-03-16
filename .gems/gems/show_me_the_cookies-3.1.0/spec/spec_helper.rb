require 'capybara/rspec'

require File.join(File.dirname(__FILE__), *%w(app set_cookie))
Capybara.app = Sinatra::Application

require 'show_me_the_cookies'
RSpec.configure do |config|
  config.include(ShowMeTheCookies, type: :feature)
end

Capybara.server_port = 36363
Capybara.app_host = "http://subdomain.lvh.me:#{Capybara.server_port}"

def cookies_should_contain(key, value)
  key_present = get_me_the_cookies.any? {|c| c[:name] == key}
  value_present = get_me_the_cookies.any? {|c| c[:value] == value}
  msg = "Cookie not found: #{key}=#{value} in #{get_me_the_cookies.inspect}"
  expect(key_present && value_present).to be_truthy, msg
end

def cookies_should_not_contain(key, value)
  key_present = get_me_the_cookies.any? { |c| c[:name] == key }
  value_present = get_me_the_cookies.any? { |c| c[:value] == value }
  msg = "Unwanted cookie found: #{key}=#{value} in #{get_me_the_cookies.inspect}"
  expect(key_present && value_present).to be_falsey, msg
end
