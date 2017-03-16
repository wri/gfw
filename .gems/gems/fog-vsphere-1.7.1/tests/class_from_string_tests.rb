require_relative './helper'

class A; class B; class C; end; end; end

class TestClassFromString < Minitest::Test
  def test_empty_string
    assert_equal(nil, Fog::Vsphere.class_from_string(''))
  end

  def test_nil
    assert_equal(nil, Fog::Vsphere.class_from_string(nil))
  end

  def test_name_as_class
    assert_equal(A, Fog::Vsphere.class_from_string(A))
  end

  def test_name_as_string
    assert_equal(A, Fog::Vsphere.class_from_string('A'))
  end

  def test_unexpected_input
    assert_equal(nil, Fog::Vsphere.class_from_string(8))
  end

  def test_nested_class_without_default_path
    assert_equal(A::B::C, Fog::Vsphere.class_from_string(A::B::C))
  end

  def test_nested_class_with_default_path
    assert_equal(A::B::C, Fog::Vsphere.class_from_string('C', 'A::B'))
  end
end
