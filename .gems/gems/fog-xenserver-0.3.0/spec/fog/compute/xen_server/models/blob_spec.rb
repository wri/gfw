require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Blob do
  let(:blob_class) do
    class Fog::Compute::XenServer::Models::Blob
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Blob
  end

  it 'should associate to a provider class' do
    blob_class.provider_class.must_equal('blob')
  end

  it 'should have a collection name' do
    blob_class.collection_name.must_equal(:blobs)
  end

  it 'should have an unique id' do
    blob_class.read_identity.must_equal(:reference)
  end

  it 'should have 8 attributes' do
    blob_class.attributes.must_equal([ :reference,
                                       :description,
                                       :last_updated,
                                       :mime_type,
                                       :name,
                                       :public,
                                       :size,
                                       :uuid ])
  end

  it "shouldn't have associations" do
    blob_class.associations.must_equal({})
  end

  it 'should have 8 masks' do
    blob_class.masks.must_equal(:reference => :reference,
                                :description => :description, 
                                :last_updated => :last_updated, 
                                :mime_type => :mime_type, 
                                :name => :name, 
                                :public => :public, 
                                :size => :size, 
                                :uuid => :uuid)
  end

  it 'should have 2 aliases' do
    blob_class.aliases.must_equal(:name_description => :description,
                                  :name_label => :name)
  end

  it "shouldn't have default values" do
    blob_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    blob_class.require_before_save.must_equal([])
  end
end