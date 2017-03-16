require 'minitest_helper'

describe Fog::Compute::XenServer::Models::DrTask do
  let(:dr_task_class) do
    class Fog::Compute::XenServer::Models::DrTask
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::DrTask
  end

  it 'should associate to a provider class' do
    dr_task_class.provider_class.must_equal('DR_task')
  end

  it 'should have a collection name' do
    dr_task_class.collection_name.must_equal(:dr_tasks)
  end

  it 'should have an unique id' do
    dr_task_class.read_identity.must_equal(:reference)
  end

  it 'should have 2 attributes' do
    dr_task_class.attributes.must_equal([ :reference,
                                          :uuid ])
  end

  it 'should have 1 association' do
    dr_task_class.associations.must_equal(:introduced_srs => :storage_repositories)
  end

  it 'should have 3 masks' do
    dr_task_class.masks.must_equal(:reference => :reference,
                                   :uuid => :uuid,
                                   :introduced_srs => :introduced_SRs)
  end

  it 'should have 1 alias' do
    dr_task_class.aliases.must_equal(:introduced_SRs => :introduced_srs)
  end

  it "shouldn't have default values" do
    dr_task_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    dr_task_class.require_before_save.must_equal([])
  end
end