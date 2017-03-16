require "helpers/integration_test_helper"
require "integration/factories/forwarding_rules_factory"

class TestForwardingRules < FogIntegrationTest
  include TestCollection

  def setup
    @subject = Fog::Compute[:google].forwarding_rules
    @factory = ForwardingRulesFactory.new(namespaced_name)
  end
end
