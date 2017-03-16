require_relative '../../helper'

require 'fog/vsphere/models/compute/server'

class TestServer < Minitest::Test
  def test_tools_installed
    server = Fog::Compute::Vsphere::Server.new
    server.tools_state = 'toolsNotRunning'
    server.tools_version = 'guestToolsNotInstalled'

    assert_equal(false, server.tools_installed?)
  end
end
