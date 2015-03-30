require 'spec_helper'

describe ApplicationController do
  controller do
    before_action :check_terms

    def index
      render text: ''
    end
  end

  before do
    ENV['TERMS_COOKIE'] = "terms_cookie"
  end

  describe 'GET :index' do
    let(:user_agent) {
      "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
    }
    let(:ip) { "127.0.0.1" }

    subject { get :index }

    before :each do
      @request.user_agent = user_agent
      ActionDispatch::Request.any_instance.stub(:remote_ip).and_return(ip)
    end

    context "with a Google Snippet bot" do
      let(:user_agent) {
        "Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20110814 Firefox/6.0 Google (+https://developers.google.com/+/web/snippet/)"
      }

      it "does not redirect to /notsupportedbrowser" do
        is_expected.to_not redirect_to("/notsupportedbrowser")
      end

      it "does not redirect to accept_terms_path" do
        is_expected.to_not redirect_to(accept_terms_path)
      end
    end

    context "with a Facebook Snippet bot" do
      let(:user_agent) {
        "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
      }

      it "does not redirect to /notsupportedbrowser" do
        is_expected.to_not redirect_to("/notsupportedbrowser")
      end

      it "does not redirect to accept_terms_path" do
        is_expected.to_not redirect_to(accept_terms_path)
      end
    end

    context "with a whitelisted IP" do
      let(:ip) { "80.74.134.135" }

      it "does not redirect to accept_terms_path" do
        is_expected.to_not redirect_to(accept_terms_path)
      end
    end

    context "with a non whitelisted IP" do
      let(:ip) { "1.3.3.7" }

      it "redirects to accept_terms_path" do
        is_expected.to redirect_to(accept_terms_path)
      end
    end

    context "with a bot" do
      let(:user_agent) { "bot" }

      it "does not redirect to /notsupportedbrowser" do
        is_expected.to_not redirect_to("/notsupportedbrowser")
      end

      it "does not redirect to accept_terms_path" do
        is_expected.to_not redirect_to(accept_terms_path)
      end
    end

    context "with a supported browser" do
      let(:user_agent) {
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
      }

      it "does not redirect to /notsupportedbrowser" do
        is_expected.to_not redirect_to("/notsupportedbrowser")
      end

      it "redirects to accept_terms_path" do
        is_expected.to redirect_to(accept_terms_path)
      end
    end

    context "with a unsupported browser" do
      let(:user_agent) { "Mozilla/4.0 WebTV/2.6 (compatible; MSIE 4.0)" }

      it "redirects to /notsupportedbrowser" do
        is_expected.to redirect_to("/notsupportedbrowser")
      end
    end
  end
end
