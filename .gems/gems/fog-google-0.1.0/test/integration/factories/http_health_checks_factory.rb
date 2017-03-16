require "integration/factories/collection_factory"

class HttpHealthChecksFactory < CollectionFactory
  def initialize(example)
    super(Fog::Compute[:google].http_health_checks, example)
  end

  def params
    {:name => resource_name}
  end
end
