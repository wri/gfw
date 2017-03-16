require "integration/factories/collection_factory"
require "integration/factories/http_health_checks_factory"

class BackendServicesFactory < CollectionFactory
  def initialize(example)
    @http_health_checks = HttpHealthChecksFactory.new(example)
    super(Fog::Compute[:google].backend_services, example)
  end

  def cleanup
    super
    @http_health_checks.cleanup
  end

  def params
    params = {:name => resource_name,
              :health_checks => [@http_health_checks.create.self_link]}
  end
end
