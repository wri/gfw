require 'spec_helper'

describe ApplicationController do
  controller do
    def index
      render text: ''
    end
  end

  describe 'GET :index' do
    let(:user_agent) { nil }

    subject { get :index }

    before :each do
      @request.user_agent = user_agent
    end

    context "with a Google Snippet bot" do
      let(:user_agent) {
        "Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20110814 Firefox/6.0 Google (+https://developers.google.com/+/web/snippet/)"
      }

      it "does not redirect to /notsupportedbrowser" do
        is_expected.to_not redirect_to("/notsupportedbrowser")
      end
    end

    context "with a Facebook Snippet bot" do
      let(:user_agent) {
        "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
      }

      it "does not redirect to /notsupportedbrowser" do
        is_expected.to_not redirect_to("/notsupportedbrowser")
      end
    end

    context "with a bot" do
      let(:user_agent) { "bot" }

      it "does not redirect to /notsupportedbrowser" do
        is_expected.to_not redirect_to("/notsupportedbrowser")
      end
    end

    context "with a supported browser" do
      let(:user_agent) {
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
      }

      it "does not redirect to /notsupportedbrowser" do
        is_expected.to_not redirect_to("/notsupportedbrowser")
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
