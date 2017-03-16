require "helpers/integration_test_helper"
require "integration/factories/target_instances_factory"

class TestTargetInstances < FogIntegrationTest
  include TestCollection

  def setup
    @subject = Fog::Compute[:google].target_instances
    @factory = TargetInstancesFactory.new(namespaced_name)
  end
end
