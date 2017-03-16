require 'spec_helper'

describe Fission::CLI do
  before do
    @string_io = StringIO.new
    Fission::CLI.any_instance.stub(:ui).and_return(Fission::UI.new(@string_io))
    @parser = double('parser')
    @parser.stub :parse
    @parser.stub :command
  end

  describe 'initialize' do
    it 'should create a parse object using ARGV' do
      Fission::CommandLineParser.should_receive(:new).with(ARGV).
                                                      and_return(@parser)

      Fission::CLI.new
    end

    it 'should create a parse object with the provided args' do
      Fission::CommandLineParser.should_receive(:new).with(['foo']).
                                                      and_return(@parser)

      Fission::CLI.new ['foo']

    end

    it 'should create a parse object using our parser' do
      @parser.should_receive(:new).with(ARGV).and_return(@parser)
      Fission::CLI.new nil, @parser
    end

    it 'should parse the arguments using the parser' do
      @parser.should_receive(:new).with(ARGV).and_return(@parser)
      @parser.should_receive :parse
      Fission::CLI.new nil, @parser
    end
  end

  describe 'execute' do
    it 'should execute the parsed command' do
      @cmd_mock = double('cmd')
      @cmd_mock.should_receive :execute
      @parser.stub(:new).and_return(@parser)
      @parser.stub(:command).and_return(@cmd_mock)
      Fission::CLI.new(nil, @parser).execute
    end
  end

end
