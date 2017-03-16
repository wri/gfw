require 'helpers/integration_test_helper'

# TODO this is a port over from legacy tests.  It shouldn't be scoped under Google, but under Google::Shared.
class TestAuthentication < FogIntegrationTest
  def setup
    @google_key_location = Fog.credentials[:google_key_location]
    @google_key_string = File.open(File.expand_path(@google_key_location), 'rb') { |io| io.read }
    @google_json_key_location = Fog.credentials[:google_json_key_location]
    @google_json_key_string = File.open(File.expand_path(@google_json_key_location), 'rb') { |io| io.read }
  end

  def test_authenticates_with_p12_key_location
    c = Fog::Compute::Google.new(:google_key_location => @google_key_location,
                                 :google_key_string => nil,
                                 :google_json_key_location => nil,
                                 :google_json_key_string => nil)
    assert_kind_of(Fog::Compute::Google::Real, c)
  end

  def test_authenticates_with_p12_key_string
    c = Fog::Compute::Google.new(:google_key_location => nil,
                                 :google_key_string => @google_key_string,
                                 :google_json_key_location => nil,
                                 :google_json_key_string => nil)
    assert_kind_of(Fog::Compute::Google::Real, c)
  end

  def test_authenticates_with_json_key_location
    c = Fog::Compute::Google.new(:google_key_location => nil,
                                 :google_key_string => nil,
                                 :google_json_key_location => @google_json_key_location,
                                 :google_json_key_string => nil)
    assert_kind_of(Fog::Compute::Google::Real, c)
  end

  def test_authenticates_with_json_key_string
    c = Fog::Compute::Google.new(:google_key_location => nil,
                                 :google_key_string => nil,
                                 :google_json_key_location => nil,
                                 :google_json_key_string => @google_json_key_string)
    assert_kind_of(Fog::Compute::Google::Real, c)
  end

  def test_raises_argument_error_when_google_project_is_missing
    assert_raises(ArgumentError) { Fog::Compute::Google.new(:google_project => nil) }
  end

  def test_raises_argument_error_when_google_client_email_is_missing
    assert_raises(ArgumentError) { Fog::Compute::Google.new(:google_client_email => nil,
                                                            :google_json_key_location => nil) } # JSON key overrides google_client_email
  end

  def test_raises_argument_error_when_google_keys_are_given
    assert_raises(ArgumentError) { Fog::Compute::Google.new(:google_key_location => nil,
                                                            :google_key_string => nil,
                                                            :google_json_key_location => nil,
                                                            :google_json_key_string => nil) }
  end
end
