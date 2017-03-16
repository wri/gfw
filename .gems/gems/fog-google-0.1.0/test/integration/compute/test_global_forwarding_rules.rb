require "helpers/integration_test_helper"
require "integration/factories/global_forwarding_rules_factory"

class TestGlobalForwardingRules < FogIntegrationTest
  include TestCollection

  def setup
    @subject = Fog::Compute[:google].global_forwarding_rules
    @factory = GlobalForwardingRulesFactory.new(namespaced_name)
  end
end
