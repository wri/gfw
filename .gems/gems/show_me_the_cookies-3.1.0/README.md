# Show me the cookies

[![Build Status](https://semaphoreapp.com/api/v1/projects/9a0dc444-fd04-4187-95a7-7a07abecbad7/201807/shields_badge.png)](https://semaphoreapp.com/nruth/show_me_the_cookies) [![Gem Version](https://badge.fury.io/rb/show_me_the_cookies.svg)](http://badge.fury.io/rb/show_me_the_cookies) [![Inline docs](http://inch-ci.org/github/nruth/show_me_the_cookies.svg?branch=master)](http://inch-ci.org/github/nruth/show_me_the_cookies) [![endorse](https://api.coderwall.com/nruth/endorsecount.png)](https://coderwall.com/nruth)

Some helpers for poking around at your Capybara driven browser's cookies in integration tests. Should have been called capybara-cookies if you go by the [rubygems naming guide](http://guides.rubygems.org/name-your-gem/).

Provides drivers for rack-test, [selenium-webdriver](https://rubygems.org/gems/selenium-webdriver),  [Poltergeist](https://github.com/teampoltergeist/poltergeist) (PhantomJS) and [capybara-webkit](https://github.com/thoughtbot/capybara-webkit).
You may add new drivers for your application by implementing an adapter class and calling ShowMeTheCookies.register_adapter in your test code (e.g. a spec/support file).

## API

      # puts a string summary of the cookie
      show_me_the_cookie(cookie_name)

      # returns a hash of the cookie
      # form: {:name, :domain, :value, :expires, :path}
      get_me_the_cookie(cookie_name)

      # puts a string summary of all cookies
      show_me_the_cookies

      # returns an array of cookie hashes
      # form: [{:name, :domain, :value, :expires, :path, :secure}]
      get_me_the_cookies

      # deletes the named cookie
      delete_cookie(cookie_name)

      # removes session cookies and expired persistent cookies
      expire_cookies
      
      # creates a cookie
      create_cookie(cookie_name, cookie_value)
      
      # creates a cookie for the path or domain
      create_cookie(cookie_name, cookie_value, :path => "...", :domain => "...")


## Installation

Add to your gemfile's test group:

    gem "show_me_the_cookies"


## RSpec

in spec_helper/rails_helper or your required support directory:

    RSpec.configure do |config|
      config.include ShowMeTheCookies, :type => :feature
    end

### Example usage

In a request spec, using [Capybara](https://github.com/jnicklas/capybara)

    specify "user login is remembered across browser restarts" do
      log_in_as_user
      should_be_logged_in
      #browser restart = session cookie is lost
      expire_cookies
      should_be_logged_in
    end


## Cucumber


Install by loading the gem and adding the following to your stepdefs or support files

    World(ShowMeTheCookies)

### Features

    @javascript
    Scenario: remembering users so they don't have to log in again for a while
      Given I am a site member
      When I go to the dashboard
      And I log in with the Remember Me option checked
      Then I should see "Welcome back"

      When I close my browser (clearing the session)
      And I return to the dashboard url
      Then I should see "Welcome back"

    @rack_test
    Scenario: don't remember users across browser restarts if they don't want it
      Given I am a site member
      When I go to the dashboard
      And I log in without the Remember Me option checked
      Then I should see "Welcome back"

      When I close my browser (clearing the session)
      And I return to the dashboard url
      Then I should see the log-in screen


### Stepdefs

    Then /^show me the cookies!$/ do
      show_me_the_cookies
    end

    Then /^show me the "([^"]*)" cookie$/ do |cookie_name|
      show_me_the_cookie(cookie_name)
    end

    Given /^I close my browser \(clearing the session\)$/ do
      expire_cookies
    end


### Installing your own drivers

Register your adapter class in your test setup after loading the library.

    ShowMeTheCookies.register_adapter(driver, adapter)

for example

    ShowMeTheCookies.register_adapter(:custom_selenium_a, ShowMeTheCookies::Selenium)

which indicates how to use the selenium adapter with a custom selenium testing profile.

## Usage / License / Support

This software is provided free of charge for use at your own risk, see [MIT License](http://opensource.org/licenses/MIT). If you have trouble making the software work try posting on stackoverflow. If you find a bug or don't understand the documentation open a [github issue](https://github.com/nruth/show_me_the_cookies/issues).

## Contributing

Bugs should be raised in the [issue tracker](https://github.com/nruth/show_me_the_cookies/issues).

Code contributions should be sent as Github pull requests, or by messaging [me](https://github.com/nruth) with a link
to your repository branch. Please run the tests, and add new ones.

New drivers will be selectively accepted. Be sure that the api spec passes. If you prefer to keep the driver in your own repository send me the address and I'll add a link in the docs.

### Development and running the tests

    bundle install
    bundle exec rspec

If you get DNS lookup failures try this in the terminal

    host lvh.me

You should get a quick response of 

    lvh.me has address 127.0.0.1

If you don't see this your router or similar is interfering with the DNS for security reasons, blocking a loopback lookup result.
You can get around this by changing your DNS server to [Google's public DNS service](https://developers.google.com/speed/public-dns/) 8.8.8.8 to run the tests. You can turn this off again afterwards.
Alternatively you can add an /etc/hosts entry looping back lvh.me to 127.0.0.1.

## History, Credits, and Acknowledgements

[Contributors](https://github.com/nruth/show_me_the_cookies/contributors)

Original development took place when testing Devise 0.1's "Remember me" functionality under rails 2.3.x with capybara rack-test and/or selenium.
Initial release as a gist [here](https://gist.github.com/484787). Development sponsored by [Medify](http://www.medify.co.uk).

Contributions outside of github have been made by:

  * [Leandro Pedroni](https://github.com/ilpoldo)
  * [Matthew Nielsen](https://github.com/xunker)
