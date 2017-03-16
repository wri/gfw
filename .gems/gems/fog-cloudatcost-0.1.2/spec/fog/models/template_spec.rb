require 'spec_helper'
require 'fog/cloudatcost/models/template'

describe Fog::Compute::CloudAtCost::Template do
  let(:server) { Fog::Compute::CloudAtCost::Template.new }

  it 'respond to #id' do
    server.respond_to? :id
  end

  it 'respond to #detail' do
    server.respond_to? :detail
  end
end
