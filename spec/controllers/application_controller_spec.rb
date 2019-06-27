require 'rails_helper'

describe ApplicationController, type: :controller do
  controller do
    def index
      render plain: ''
    end
  end

  describe 'GET :index' do
    let(:user_agent) {
      "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
    }
    let(:ip) { "127.0.0.1" }

    subject { get :index }

    before :each do
      @request.user_agent = user_agent
      allow_any_instance_of(ActionDispatch::Request).to receive(:remote_ip).and_return(ip)
    end

    context "with a supported browser" do
      let(:user_agent) {
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
      }

      before :each do
        allow(request).to receive(:user_agent).and_return(user_agent)
        allow(controller.request).to receive(:host).and_return("www.globalforestwatch.org")
      end

      it "does not redirect to /browser-support" do
        is_expected.to_not redirect_to("/browser-support")
      end
    end
  end
end
