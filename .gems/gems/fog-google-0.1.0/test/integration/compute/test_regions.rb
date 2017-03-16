require "helpers/integration_test_helper"

class TestRegions < FogIntegrationTest
  NAMES = %w(asia-east1 europe-west1 us-central1 us-central2)

  def setup
    @subject = Fog::Compute[:google].regions
  end

  def test_all
    assert_equal NAMES.size, @subject.all.size
  end

  def test_get
    NAMES.each do |name|
      refute_nil @subject.get(name)
    end
  end

  def test_up
    NAMES.each do |name|
      assert @subject.get(name).up?
    end
  end

  def test_bad_get
    assert_nil @subject.get("bad-name")
  end

  def test_enumerable
    assert_respond_to @subject, :each
  end
end
