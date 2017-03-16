require 'spec_helper'
require 'fog/cloudatcost/models/server'

describe Fog::Compute::CloudAtCost::Server do
  let(:server) { Fog::Compute::CloudAtCost::Server.new }

  server_attributes = %w(sid id CustID packageid label servername 
                         vmname ip netmask gateway hostname rootpass
                         vncport vncpass servertype template cpu cpuusage
                         ram ramusage storage hdusage sdate status panel_note
                         mode uid rdns rdnsdefault template_id)

  it 'tests attributes' do
    server_attributes.each do |attribute|
      expect(server).to respond_to(attribute)
    end
  end
end
