require 'spec_helper'

describe CountriesController do
  before do
    ENV['TERMS_COOKIE'] = "terms_cookie"
  end

  describe "GET download" do
    let(:params) { {} }
    let(:iso) { "AWM" }
    let(:download_link) { "http://download.com/country" }

    subject {
      get :download, {id: iso}.merge(params)
    }

    before(:each) do
      @request.user_agent = "bot" # get past browser checks

      expect(CountriesConcern).to(
        receive(:download_link).
        with(iso).
        and_return(download_link)
      )
    end

    context "given an email address" do
      let(:email) { "my@email.com" }
      let(:params) { {email: email} }

      it "sends an email with the download link"
    end

    context "given no email address" do
      it "redirects to the download link" do
        is_expected.to redirect_to(download_link)
      end
    end
  end
end
