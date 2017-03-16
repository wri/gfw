#
# Author:: Paulo Henrique Lopes Ribeiro (<plribeiro3000@gmail.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests('Fog::Storage[:softlayer]', ['softlayer']) do
  tests('#_build_params') do
    tests('sending image/png files') do
      mocking = Fog.mocking?
      Fog.unmock!
      # Stubs Real Connection
      class Fog::Storage::Softlayer::Real
        def initialize(_options = {});end
      end
      @service = Fog::Storage::Softlayer.new(softlayer_username: 'name',
                                             softlayer_api_key: 'key',
                                             softlayer_cluster: 'cluster',
                                             softlayer_storage_account: 'account')
      # Testing header setup
      header = @service.send(:_build_params, { :headers => { 'Content-Type' => 'image/png' }})
      returns('image/png', 'properly sets the header') { header[:headers]['Content-Type'] }
      Fog.mock! if mocking
    end
  end
end