require 'spec_helper'
require 'fog/cloudatcost/models/task'

describe Fog::Compute::CloudAtCost::Task do
  let(:server) { Fog::Compute::CloudAtCost::Task.new }

  it 'respond to #id' do
    server.respond_to? :id
  end

  it 'respond to #cid' do
    server.respond_to? :cid
  end

  it 'respond to #idf' do
    server.respond_to? :idf
  end

  it 'respond to #serverid' do
    server.respond_to? :serverid
  end

  it 'respond to #action' do
    server.respond_to? :action
  end

  it 'respond to #status' do
    server.respond_to? :status
  end

  it 'respond to #starttime' do
    server.respond_to? :starttime
  end

  it 'respond to #finishtime' do
    server.respond_to? :finishtime
  end

  it 'respond to #servername' do
    server.respond_to? :servername
  end

  it 'respond to #ip' do
    server.respond_to? :ip
  end

  it 'respond to #label' do
    server.respond_to? :label
  end

  it 'respond to #rdns' do
    server.respond_to? :rdns
  end

  it 'respond to #rdnsdefault' do
    server.respond_to? :rdnsdefault
  end
end
