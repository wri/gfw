require "helpers/integration_test_helper"

class TestDiskTypes < FogIntegrationTest
  NAMES = %w(local-ssd pd-ssd pd-standard)
  ZONES = %w(https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/us-central1-a
             https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/us-central1-b
             https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/us-central1-c
             https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/us-central1-f
             https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/europe-west1-b
             https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/europe-west1-c
             https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/europe-west1-d
             https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/asia-east1-a
             https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/asia-east1-b
             https://www.googleapis.com/compute/v1/projects/graphite-fog/zones/asia-east1-c)

  def setup
    @subject = Fog::Compute[:google].disk_types
  end

  def test_all
    assert_equal (NAMES.size * ZONES.size), @subject.all.size
  end

  def test_get
    NAMES.each do |name|
      ZONES.each do |zone|
        refute_nil @subject.get(name, zone)
      end
    end
  end

  def test_bad_get
    assert_nil @subject.get("bad-name")
  end

  def test_enumerable
    assert_respond_to @subject, :each
  end
end
