require 'spec_helper'

describe Fission::CommandHelpers do
  include_context 'command_setup'

  before do
    @object = Object.new
    @object.extend Fission::CommandHelpers
    @object.class.stub(:help).and_return('foo help')
  end

  describe 'incorrect_arguments' do
    before do
      @object.stub(:command_name)
      @object.stub(:output)
      @object.stub(:output_and_exit)
    end

    it "should output the command's help text" do
      @object.stub(:command_name)
      @object.should_receive(:output).with(/foo help/)
      @object.incorrect_arguments
    end

    it 'should output that the argumets are incorrect and exit' do
      @object.stub(:command_name).and_return('delete')
      @object.should_receive(:output_and_exit).
              with('Incorrect arguments for delete command', 1)
      @object.incorrect_arguments
    end
  end

  describe 'parse arguments' do
    before do
      @object.stub(:option_parser).and_return(@object)
    end

    it 'should parse the arguments' do
      @object.stub :parse!
      @object.parse_arguments
    end

    it 'should output the error with help' do
      error = OptionParser::InvalidOption.new 'bar is invalid'
      @object.should_receive(:output).with(error)
      @object.should_receive(:output_and_exit).with(/foo help/, 1)
      @object.stub(:parse!).and_raise(error)
      @object.parse_arguments
    end
  end

end
