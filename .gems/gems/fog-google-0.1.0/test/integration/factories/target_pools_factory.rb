require "integration/factories/collection_factory"
require "integration/factories/servers_factory"
require "integration/factories/http_health_checks_factory"

class TargetPoolsFactory < CollectionFactory
  def initialize(example)
    @http_health_checks = HttpHealthChecksFactory.new(example)
    @servers = ServersFactory.new(example)
    super(Fog::Compute[:google].target_pools, example)
  end

  def cleanup
    super
    @servers.cleanup
    @http_health_checks.cleanup
  end

  def params
    params = {:name => resource_name,
              :region => TEST_REGION,
              :instances => [@servers.create.self_link],
              :healthChecks => [@http_health_checks.create.self_link]}
  end
end
