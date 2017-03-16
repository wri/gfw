require "helpers/integration_test_helper"
require "integration/factories/servers_factory"

class TestServers < FogIntegrationTest
  include TestCollection

  def setup
    @subject = Fog::Compute[:google].servers
    @factory = ServersFactory.new(namespaced_name)
  end

  def test_bootstrap_ssh_destroy
    resource_name = @factory.resource_name
    instance = @subject.bootstrap({:name => resource_name})
    assert instance.ready?
    instance.wait_for { sshable? }
    assert_match /Linux/, instance.ssh("uname").first.stdout
    assert_equal instance.destroy.operation_type, "delete"
    Fog.wait_for { !@subject.all.map(&:identity).include? instance.identity }
    # XXX clean up after bootstrap's automatic creation of disks
    # This should be removed when
    #     https://github.com/fog/fog-google/issues/17
    # is solved
    disk = Fog::Compute[:google].disks.get(resource_name)
    disk.destroy
    Fog.wait_for { !Fog::Compute[:google].disks.all.map(&:identity).include? disk.identity }
  end
end
