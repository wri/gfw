module ShowMeTheCookies
  require 'show_me_the_cookies/adapters/rack_test'
  require 'show_me_the_cookies/adapters/poltergeist'
  require 'show_me_the_cookies/adapters/selenium'
  require 'show_me_the_cookies/adapters/selenium_chrome'
  require 'show_me_the_cookies/adapters/webkit'

  @adapters = {}
  class << self
    attr_reader :adapters

    # Register your own capybara-driver cookie adapter.
    # Use the same name as the one Capybara does to identify that driver.
    # Implement the interface of spec/shared_examples_for_api, as seen in lib/show_me_the_cookies/drivers
    def register_adapter(driver, adapter)
      adapters[driver] = adapter
    end
  end

  # to register your own adapter/driver do this in your test setup code somewhere e.g. spec/support
  register_adapter(:selenium, ShowMeTheCookies::Selenium)
  register_adapter(:selenium_chrome, ShowMeTheCookies::SeleniumChrome)
  register_adapter(:rack_test, ShowMeTheCookies::RackTest)
  register_adapter(:poltergeist, ShowMeTheCookies::Poltergeist)
  register_adapter(:webkit, ShowMeTheCookies::Webkit)
  register_adapter(:webkit_debug, ShowMeTheCookies::Webkit)

  # puts a string summary of the cookie
  def show_me_the_cookie(cookie_name)
    puts "#{cookie_name}: #{get_me_the_cookie(cookie_name).inspect}"
  end

  # returns a hash of the cookie
  # form: {:name, :domain, :value, :expires, :path}
  def get_me_the_cookie(cookie_name)
    current_driver_adapter.get_me_the_cookie(cookie_name)
  end

  # puts a string summary of all cookies
  def show_me_the_cookies
    puts "Cookies: #{get_me_the_cookies.inspect}"
  end

  # returns an array of cookie hashes
  # form: [{:name, :domain, :value, :expires, :path}]
  def get_me_the_cookies
    current_driver_adapter.get_me_the_cookies
  end

  # deletes the named cookie
  def delete_cookie(cookie_name)
    current_driver_adapter.delete_cookie(cookie_name)
  end

  # removes session cookies and expired persistent cookies
  def expire_cookies
    current_driver_adapter.expire_cookies
  end

  # can take the following options:
  # :path
  # :domain
  def create_cookie(name, value, options = {})
    current_driver_adapter.create_cookie(name, value, options)
  end

private

  def current_driver_adapter
    adapter = ShowMeTheCookies.adapters[Capybara.current_driver]
    if adapter.nil?
      raise(ShowMeTheCookies::UnknownDriverError, "Unsupported driver #{Capybara.current_driver}, use one of #{ShowMeTheCookies.adapters.keys} or register your new driver with ShowMeTheCookies.register_adapter")
    end
    adapter.new(Capybara.current_session.driver)
  end

  class ShowMeTheCookies::UnknownDriverError < RuntimeError; end
end
