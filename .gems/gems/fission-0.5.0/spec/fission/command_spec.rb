require 'spec_helper'

describe Fission::Command do
  describe 'new' do
    it 'should set options variable as an open struct' do
      @command = Fission::Command.new
      @command.options.should be_kind_of OpenStruct
    end

    it 'should set the args variable' do
      @command = Fission::Command.new ['foo', 'bar']
      @command.args.should == ['foo', 'bar']
    end
  end

  describe 'command_name' do
    it 'should return the pretty command name' do
      cmd = Fission::Command.new
      cmd.command_name(Fission::Command::SnapshotList.new).should == 'snapshot list'
    end
  end

  describe 'help' do
    it 'should call option_parser on a new instance' do
      @new_instance_mock = double('new_instance')
      @new_instance_mock.should_receive(:option_parser).and_return('foo')
      Fission::Command.should_receive(:new).and_return(@new_instance_mock)
      Fission::Command.help.should == 'foo'
    end
  end

  describe 'summary' do
    it "should raise an exception that it's not implemented" do
      lambda {
        Fission::Command.new.summary
      }.should raise_error NotImplementedError
    end
  end

  describe 'ui' do
    it 'should load a ui object' do
      Fission::Command.new.ui.should be_a Fission::UI
    end

    [:output, :output_and_exit, :output_printf].each do |item|
      it "should delegate '#{item.to_s}' to the ui instance" do
        @ui_mock = double('ui')
        @ui_mock.should_receive(item)

        Fission::UI.stub(:new).and_return(@ui_mock)

        @cmd_instance = Fission::Command.new
        @cmd_instance.send item, 'foo'
      end
    end

  end

end
