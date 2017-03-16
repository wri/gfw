require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Event do
  let(:event_class) do
    class Fog::Compute::XenServer::Models::Event
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Event
  end

  it 'should associate to a provider class' do
    event_class.provider_class.must_equal('event')
  end

  it 'should have a collection name' do
    event_class.collection_name.must_equal(:events)
  end

  it 'should have an unique id' do
    event_class.read_identity.must_equal(:reference)
  end

  it 'should have 7 attributes' do
    event_class.attributes.must_equal([ :reference,
                                       :klass,
                                       :id,
                                       :obj_uuid,
                                       :operation,
                                       :ref,
                                       :timestamp ])
  end

  it 'should have 7 masks' do
    event_class.masks.must_equal(:reference => :reference,
                                :klass => :class, 
                                :id => :id, 
                                :obj_uuid => :obj_uuid, 
                                :operation => :operation, 
                                :ref => :ref,
                                :timestamp => :timestamp)
  end

  it "shouldn't have aliases" do
    event_class.aliases.must_equal({ :class=>:klass })
  end

  it "shouldn't have default values" do
    event_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    event_class.require_before_save.must_equal([])
  end
end