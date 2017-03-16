require "integration/factories/collection_factory"

class ImagesFactory < CollectionFactory
  def initialize(example)
    super(Fog::Compute[:google].images, example)
  end

  def params
    params = {:name => resource_name,
              :raw_disk => {:source => TEST_RAW_DISK_SOURCE}}
  end
end
