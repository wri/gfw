require "helpers/integration_test_helper"
require "integration/factories/http_health_checks_factory"

class TestHttpHealthChecks < FogIntegrationTest
  include TestCollection

  def setup
    @subject = Fog::Compute[:google].http_health_checks
    @factory = HttpHealthChecksFactory.new(namespaced_name)
  end
end
