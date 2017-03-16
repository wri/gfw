require 'minitest_helper'

describe Fog::Compute::XenServer::Models::VifMetrics do
  let(:vif_metrics_class) do
    class Fog::Compute::XenServer::Models::VifMetrics
      def self.read_identity
        instance_variable_get('@identity')
      end
    end
    Fog::Compute::XenServer::Models::VifMetrics
  end

  it 'should associate to a provider class' do
    vif_metrics_class.provider_class.must_equal('VIF_metrics')
  end

  it 'should have a collection name' do
    vif_metrics_class.collection_name.must_equal(:vifs_metrics)
  end

  it 'should have an unique id' do
    vif_metrics_class.read_identity.must_equal(:reference)
  end

  it 'should have 6 attributes' do
    vif_metrics_class.attributes.must_equal([ :reference,
                                              :io_read_kbs,
                                              :io_write_kbs,
                                              :last_updated,
                                              :other_config,
                                              :uuid ])
  end

  it "shouldn't have associations" do
    vif_metrics_class.associations.must_equal({})
  end

  it 'should have 6 masks' do
    vif_metrics_class.masks.must_equal(:reference => :reference, 
                                       :io_read_kbs => :io_read_kbs, 
                                       :io_write_kbs => :io_write_kbs, 
                                       :last_updated => :last_updated, 
                                       :other_config => :other_config, 
                                       :uuid => :uuid)
  end

  it "should't have aliases" do
    vif_metrics_class.aliases.must_equal({})
  end

  it "shouldn't have default values" do
    vif_metrics_class.default_values.must_equal({})
  end

  it "shouldn't require attributes before save" do
    vif_metrics_class.require_before_save.must_equal([])
  end
end