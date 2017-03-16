module ShowMeTheCookies
  class Selenium
    def initialize(driver)
      @browser = driver.browser
    end

    def get_me_the_cookie(cookie_name)
      @browser.manage.cookie_named(cookie_name)
    end

    def get_me_the_cookies
      @browser.manage.all_cookies
    end

    def expire_cookies
      @browser.manage.all_cookies.each do |c|
        # we don't need to catch the expired cookies here
        # the browser will do it for us (duh!)
        @browser.manage.delete_cookie(c[:name]) if c[:expires].nil?
      end
    end

    def delete_cookie(cookie_name)
      @browser.manage.delete_cookie(cookie_name)
    end

    def create_cookie(cookie_name, cookie_value, options)
      unless on_the_page?
        fail(
          SeleniumSiteNotVisitedError,
          "Can't set a cookie on about:blank. Visit a url in your app first."
        )
      end
      @browser.manage.add_cookie(
        { name: cookie_name, value: cookie_value }.merge(options)
      )
    end

    protected

    def on_the_page?
      current_url = @browser.current_url
      current_url && current_url != '' && current_url != 'about:blank'
    end
  end

  class SeleniumSiteNotVisitedError < StandardError
  end
end
