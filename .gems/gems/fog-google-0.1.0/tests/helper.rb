ENV['FOG_RC']         = ENV['FOG_RC'] || File.expand_path('../.fog', __FILE__)
ENV['FOG_CREDENTIAL'] = ENV['FOG_CREDENTIAL'] || 'default'

require 'fog/google'
require 'securerandom'

Excon.defaults.merge!(:debug_request => true, :debug_response => true)

require File.expand_path(File.join(File.dirname(__FILE__), 'helpers', 'mock_helper'))

# This overrides the default 600 seconds timeout during live test runs
if Fog.mocking?
  FOG_TESTING_TIMEOUT = ENV['FOG_TEST_TIMEOUT'] || 2000
  Fog.timeout = 2000
  Fog::Logger.warning "Setting default fog timeout to #{Fog.timeout} seconds"
else
  FOG_TESTING_TIMEOUT = Fog.timeout
end

def lorem_file
  File.open(File.dirname(__FILE__) + '/lorem.txt', 'r')
end

def array_differences(array_a, array_b)
  (array_a - array_b) | (array_b - array_a)
end

# create a disk to be used in tests
def create_test_disk(connection, zone)
  zone = 'us-central1-a'
  random_string = SecureRandom.hex

  disk = connection.disks.create({
                                     :name => "fog-test-disk-#{random_string}",
                                     :size_gb => "10",
                                     :zone => zone,
                                     :source_image => "debian-7-wheezy-v20140408",
                                 })
  disk.wait_for { ready? }
  disk
end

def create_test_http_health_check(connection)
  random_string = SecureRandom.hex
  health_check = connection.http_health_checks.create({
                                                          :name => "fog-test-check-#{random_string}"
                                                      })
  health_check
end

def create_test_backend_service(connection)
  random_string = SecureRandom.hex
  health_check = create_test_http_health_check(connection)
  backend_service = connection.backend_services.create({
                                                           :name => "fog-test-backend-service-#{random_string}",
                                                           :health_checks => [health_check]
                                                       })
end

def create_test_url_map(connection)
  random_string = SecureRandom.hex
  backend_service = create_test_backend_service(connection)
  url_map = connection.url_maps.create({
                                           :name => "fog-test-url-map-#{random_string}",
                                           :defaultService => backend_service.self_link
                                       })
end

def create_test_server(connection, zone)
  random_string = SecureRandom.hex
  disk = create_test_disk(connection,zone)
  server = connection.servers.create({
                                         :name => "fog-test-server-#{random_string}",
                                         :disks => [disk],
                                         :zone => zone,
                                         :machine_type => 'n1-standard-1'
                                     })
end

def create_test_target_http_proxy(connection)
  random_string = SecureRandom.hex
  url_map = create_test_url_map(connection)
  proxy = connection.target_http_proxies.create({
                                                    :name => "fog-test-target-http-proxy-#{random_string}",
                                                    :urlMap => url_map.self_link
                                                })
end

def create_test_zone_view(connection, zone)
  random_string = SecureRandom.hex
  zone_view = connection.zone_views.create({
                                               :name => "fog-test-zone-view-#{random_string}",
                                               :zone => zone
                                           })
  zone_view.wait_for {ready?}
  zone_view
end

def create_test_target_pool(connection, region)
  random_string = SecureRandom.hex
  http_health_check = create_test_http_health_check(connection)
  instance = create_test_server(connection, 'us-central1-a')
  target_pool = connection.target_pools.create({
                                                   :name => "fog-test-target-pool-#{random_string}",
                                                   :region => region,
                                                   :healthChecks => [http_health_check.self_link],
                                                   :instances => [instance.self_link]\
      })
end

def wait_operation(connection, response)
  operation = connection.operations.get(response['name'], response['zone'], response['region'])
  operation.wait_for { ready? }
end

def generate_unique_domain( with_trailing_dot = false)
  #get time (with 1/100th of sec accuracy)
  #want unique domain name and if provider is fast, this can be called more than once per second
  time= (Time.now.to_f * 100).to_i
  domain = 'test-' + time.to_s + '.com'
  if with_trailing_dot
    domain+= '.'
  end

  domain
end
