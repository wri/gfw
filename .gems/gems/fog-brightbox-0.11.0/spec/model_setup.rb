module ModelSetup
  def self.included(base)
    base.class_eval do
      let(:configuration) do
        {
          :brightbox_auth_url => "http://localhost",
          :brightbox_api_url => "http://localhost",
          :brightbox_client_id => "",
          :brightbox_secret => "",
          :brightbox_username => "",
          :brightbox_password => "",
          :brightbox_account => "",
          :brightbox_default_image => "img-test",
          :brightbox_access_token => "FAKECACHEDTOKEN"
        }
      end

      let(:config) { Fog::Brightbox::Config.new(configuration) }
      let(:service) { Fog::Compute::Brightbox.new(config) }
    end
  end
end
