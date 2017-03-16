shared_examples "the API" do

  describe "for getting cookie hashes" do
    describe "get_me_the_cookie" do
      it "returns the cookie hash" do
        visit '/set/foo/bar'
        expect(get_me_the_cookie('foo')).to include(:name => "foo", :value => "bar", :expires => nil, :secure => false)
      end
    end

    it "returns nil for cookies that do not exist" do
      expect(get_me_the_cookie('some_unset_cookie')).to be_nil
    end

    describe "get_me_the_cookies" do
      it "returns an array of standardised cookie hashes" do
        visit '/set/foo/bar'
        expect(page).to have_content("Setting foo=bar")
        expect(get_me_the_cookies.first).to include(:name => "foo", :value => "bar", :expires => nil, :secure => false)
        visit '/set/myopic/mice'
        expect(get_me_the_cookies.length).to be(2)
      end
    end
  end

  describe "for viewing cookies" do
    describe "show_me_the_cookie" do
      it "inspects the cookie hash" do
        visit '/set/foo/bar'
        expect($stdout).to receive(:puts).with("foo: "+get_me_the_cookie('foo').inspect)
        show_me_the_cookie('foo')
      end
    end

    describe "show_me_the_cookies" do
      it "returns a string representation of the get_me_the_cookies hash" do
        visit '/set/foo/bar'
        visit '/set/myopic/mice'
        expect($stdout).to receive(:puts).with("Cookies: "+get_me_the_cookies.inspect)
        show_me_the_cookies
      end
    end
  end

  describe "for manipulating cookies" do
    describe "delete_cookie(cookie_name)" do
      it "deletes a k/v pair from the session cookie" do
        visit '/set/choc/milk'
        visit '/set/extras/hazlenut'
        cookies_should_contain('extras', 'hazlenut')
        cookies_should_contain('choc', 'milk')

        delete_cookie('choc')
        cookies_should_contain('extras', 'hazlenut')
        cookies_should_not_contain('choc', 'milk')
      end

      it "accepts symbols" do
        visit '/set/choc/milk'
        cookies_should_contain('choc', 'milk')
        delete_cookie(:choc)
        cookies_should_not_contain('choc', 'milk')
      end
    end

    describe "create_cookie(cookie_name, cookie_value)" do
      it "creates a cookie" do
        # need to first hit a page to set a cookie (selenium)
        visit("/")
        create_cookie("choc", "milk")
        visit "/get/choc"
        cookies_should_contain("choc", "milk")
        expect(page).to have_content("Got cookie choc=milk")
      end

      it "accepts symbols" do
        # need to first hit a page to set a cookie (selenium)
        visit("/")
        create_cookie(:choc, :milk)
        visit "/get/choc"
        cookies_should_contain("choc", "milk")
        expect(page).to have_content("Got cookie choc=milk")
      end

      it "creates a cookie with path and domain" do
        # need to first hit a page to set a cookie (selenium)
        visit("/")
        create_cookie("choc", "milk", path: "/", domain: ".lvh.me")
        cookies_should_contain("choc", "milk")

        visit("/get/choc")
        expect(page).to have_content("Got cookie choc=milk")

        visit '/set_with_domain/choc/doublemilk'
        cookies_should_contain("choc", "doublemilk")
        cookies_should_not_contain('choc', 'milk')

        visit("/get/choc")
        expect(page).to have_content("Got cookie choc=doublemilk")
      end
    end

    describe "expire_cookies" do
      it "removes cookies without expiry times set" do
        visit '/set/choc/milk'
        visit '/set/extras/hazlenut'
        visit '/set/myopic/mice'
        cookies_should_contain('choc', 'milk')
        cookies_should_contain('extras', 'hazlenut')
        cookies_should_contain('myopic','mice')

        expire_cookies
        cookies_should_not_contain('choc', 'milk')
        cookies_should_not_contain('extras', 'hazlenut')
        cookies_should_not_contain('myopic','mice')
      end

      it "removes cookies which are past their expiry time, or the browser does" do
        visit '/set_stale/rotting/fruit'
        visit '/set_persistent/fresh/vegetables'

        expire_cookies
        cookies_should_not_contain('rotting','fruit')
        cookies_should_contain('fresh','vegetables')
      end
    end
  end
end
