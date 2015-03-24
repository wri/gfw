require 'spec_helper'

describe CountriesController do
  before do
    ENV['TERMS_COOKIE'] = "terms_cookie"
  end

  describe "GET download" do
    let(:url_params) { {} }
    let(:iso) { "AWM" }
    let(:download_link) { "http://download.com/country" }

    subject {
      get :download, {id: iso}.merge(url_params)
    }

    before(:each) do
      @request.user_agent = "bot" # get past browser checks

      expect_any_instance_of(CountriesController).to(
        receive(:download_link).
        with(iso).
        and_return(download_link)
      )
    end

    context "given an email address" do
      let(:email) { "my@email.com" }
      let(:url_params) { {email: email} }

      let(:mailer_double) { double("mailer") }

      it "sends an email with the download link" do
        expect(MobileDownload).to(
          receive(:download_email).
          with(email, download_link).
          and_return(mailer_double)
        )

        expect(mailer_double).to receive(:deliver).and_return(true)

        subject
      end

      it "returns a success response code" do
        expect(response.code).to eq("200")
        subject
      end
    end

    context "given no email address" do
      it "redirects to the download link" do
        is_expected.to redirect_to(download_link)
      end
    end
  end
end
