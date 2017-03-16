require 'minitest_helper'

describe Fog::Compute::XenServer::Models::Role do
  let(:role_class) do
    class Fog::Compute::XenServer::Models::Role
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::Role
  end

  it 'should associate to a provider class' do
    role_class.provider_class.must_equal('role')
  end

  it 'should have a collection name' do
    role_class.collection_name.must_equal(:roles)
  end

  it 'should have an unique id' do
    role_class.read_identity.must_equal(:reference)
  end

  it 'should have 4 attributes' do
    role_class.attributes.must_equal([ :reference,
                                       :description,
                                       :name,
                                       :uuid ])
  end

  it 'should have 1 association' do
    role_class.associations.must_equal(:subroles => :roles)
  end

  it 'should have 5 masks' do
    role_class.masks.must_equal(:reference => :reference, 
                                :description => :description, 
                                :name => :name, 
                                :uuid => :uuid, 
                                :subroles => :subroles)
  end

  it 'should have 2 aliases' do
    role_class.aliases.must_equal({ :name_description => :description,
                                    :name_label => :name })
  end

  it "shouldn't have default values" do
    role_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    role_class.require_before_save.must_equal([])
  end
end