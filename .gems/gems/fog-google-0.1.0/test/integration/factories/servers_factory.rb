require "integration/factories/collection_factory"
require "integration/factories/disks_factory"

class ServersFactory < CollectionFactory
  def initialize(example)
    @disks = DisksFactory.new(example)
    super(Fog::Compute[:google].servers, example)
  end

  def cleanup
    super
    @disks.cleanup
  end

  def params
    params = {:name => resource_name,
              :zone_name => TEST_ZONE,
              :machine_type => TEST_MACHINE_TYPE,
              :disks => [@disks.create]}
  end
end
