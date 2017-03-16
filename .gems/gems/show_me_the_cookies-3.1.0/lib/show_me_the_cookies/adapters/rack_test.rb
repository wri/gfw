module ShowMeTheCookies
  class RackTest
    def initialize(rack_test_driver)
      @rack_test_driver = rack_test_driver
    end

    def get_me_the_cookie(cookie_name)
      found = cookies.select {|c| c.name == cookie_name}
      found.empty? ? nil : _translate_cookie(found.first)
    end

    def get_me_the_cookies
      cookies.map {|c| _translate_cookie(c) }
    end

    def expire_cookies
      cookies.reject! do |existing_cookie|
        # See http://j-ferguson.com/testing/bdd/hacking-capybara-cookies/
        # catch session cookies/no expiry (nil) and past expiry (true)
        existing_cookie.expired? != false
      end
    end

    def delete_cookie(cookie_name)
      cookies.reject! do |existing_cookie|
        existing_cookie.name.downcase == cookie_name.to_s
      end
    end

    def create_cookie(name, value, options)
      cookie_raw = "#{name}=#{Rack::Utils.escape(value)}"
      (cookie_raw = "#{cookie_raw}; domain=#{options[:domain]}") if options.has_key?(:domain)
      (cookie_raw = "#{cookie_raw}; path=#{options[:path]}")     if options.has_key?(:path)
      cookie_jar.merge(cookie_raw)
    end

  private
    def cookie_jar
      @rack_test_driver.browser.current_session.instance_variable_get(:@rack_mock_session).cookie_jar
    end

    def cookies
      cookie_jar.instance_variable_get(:@cookies)
    end

    def httponly?(cookie)
      (cookie.instance_variable_get(:@options) || {}).has_key?("HttpOnly")
    end

    def _translate_cookie(cookie)
      {:name => cookie.name,
      :domain => cookie.domain,
      :value => cookie.value,
      :expires => cookie.expires,
      :path => cookie.path,
      :secure => cookie.secure?,
      :httponly => httponly?(cookie)}
    end
  end
end
