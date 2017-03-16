require "helpers/integration_test_helper"
require "integration/factories/images_factory"

class TestImages < FogIntegrationTest
  include TestCollection

  def setup
    @subject = Fog::Compute[:google].images
    @factory = ImagesFactory.new(namespaced_name)
  end
end
