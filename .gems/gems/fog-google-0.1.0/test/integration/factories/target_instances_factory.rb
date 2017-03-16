require "integration/factories/collection_factory"
require "integration/factories/servers_factory"

class TargetInstancesFactory < CollectionFactory
  def initialize(example)
    @servers = ServersFactory.new(example)
    super(Fog::Compute[:google].target_instances, example)
  end

  def cleanup
    super
    @servers.cleanup
  end

  def params
    {:name => resource_name,
     :zone => TEST_ZONE,
     :instance => @servers.create}
  end
end
