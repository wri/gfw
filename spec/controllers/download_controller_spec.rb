require 'spec_helper'

describe DownloadController, type: :controller do
  before do
    ENV['TERMS_COOKIE'] = "terms_cookie"
  end

  let(:url_params) { {} }
  let(:iso) { "AWM" }
  let(:download_link) { "http://download.com/country" }
  let(:type) { "default" }

  before(:each) do
    controller.request.user_agent = "bot" # get past browser checks
  end

  describe "POST download" do
    context "given an email address" do
      let(:email) { "my@email.com" }
      let(:mailer_double) { double("mailer") }

      subject {
        post :create_download,
          {id: iso, email: email, link: download_link, type: type}
      }

      it "sends an email with the download link" do
        expect(MobileDownload).to(
          receive(:download_email).
          with(email, download_link, type).
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
  end
end
