require "helpers/integration_test_helper"
require "integration/factories/backend_services_factory"

class TestBackendServices < FogIntegrationTest
  include TestCollection

  def setup
    @subject = Fog::Compute[:google].backend_services
    @factory = BackendServicesFactory.new(namespaced_name)
  end
end
