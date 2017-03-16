require 'spec_helper'

describe Fission::UI do
  before do
    @string_io = StringIO.new
  end

  describe 'output' do
    it 'should show the desired text' do
      Fission::UI.new(@string_io).output "foo bar\nbaz blah"
      @string_io.string.should == "foo bar\nbaz blah\n"
    end
  end

  describe 'output_printf' do
    it 'should pass the arguments to printf' do
      @output = double('output')
      @output.should_receive(:printf).with('foo', 'bar', 'baz')
      Fission::UI.new(@output).output_printf('foo', 'bar', 'baz')
    end
  end

  describe 'output_and_exit' do
    it 'should show the desired text and exit with the desired exit code' do
      Fission::UI.any_instance.should_receive(:exit).and_return(1)
      Fission::UI.new(@string_io).output_and_exit "foo bar\nbaz blah", 1
      @string_io.string.should == "foo bar\nbaz blah\n"
    end
  end
end
