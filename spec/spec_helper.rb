# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'capybara/rails'
require 'capybara/rspec'
require 'capybara-screenshot/rspec'

class Capybara::Selenium::Driver < Capybara::Driver::Base
  def reset!
    if @browser
      begin
        #@browser.manage.delete_all_cookies <= cookie deletion is commented out!
      rescue Selenium::WebDriver::Error::UnhandledError => e
      end
      @browser.navigate.to('about:blank')
    end
  end
end

Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }
ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)

RSpec.configure do |config|
  config.infer_base_class_for_anonymous_controllers = false
  config.order = "random"
  config.include Capybara::DSL
  config.include ShowMeTheCookies, :type => :feature
  config.filter_run_excluding upload: true
  config.before :each do
    Typhoeus::Expectation.clear
  end
end

Capybara.run_server     = false
Capybara.app_host       = 'http://localhost:5000'
Capybara.default_driver = :selenium
