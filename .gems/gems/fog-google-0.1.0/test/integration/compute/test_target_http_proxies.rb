require "helpers/integration_test_helper"
require "integration/factories/target_http_proxies_factory"

class TestTargetHttpProxies < FogIntegrationTest
  include TestCollection

  def setup
    @subject = Fog::Compute[:google].target_http_proxies
    @factory = TargetHttpProxiesFactory.new(namespaced_name)
  end
end
