require 'spec_helper'

describe MobileDownload do
  let(:email) { "mobileuser@internet.com" }
  let(:link) { "http://download.com/gfw" }

  before(:each) do
    MobileDownload.download_email(email, link).deliver
  end

  after(:each) do
    ActionMailer::Base.deliveries.clear
  end

  context "counting email" do
    subject { ActionMailer::Base.deliveries.count }

    it "should send an email" do
      is_expected.to eq(1)
    end
  end

  context "sent email" do
    subject { ActionMailer::Base.deliveries.first }

    it "sets the correct subject" do
      expect(subject.subject).to eq("Your Global Forest Watch download")
    end

    it "sets the correct receiver email" do
      expect(subject.to).to eq([email])
    end

    it "sets the correct from email" do
      expect(subject.from).to eq(["gfw@wri.org"])
    end

    it "includes the download link in the email body" do
      expect(subject.body.encoded).to match(Regexp.new(link))
    end
  end
end
