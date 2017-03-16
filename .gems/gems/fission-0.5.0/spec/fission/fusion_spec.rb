require 'spec_helper'

describe Fission::Fusion do
  describe 'self.running?' do
    before do
      @cmd = "ps -ef | grep -v grep | "
      @cmd << "grep -c '#{Fission.config['gui_bin']}' 2>&1"
      @executor = double('executor')
    end

    it 'should return a successful response and true if the fusion app is running' do
      @executor.should_receive(:execute).and_return({'output' => "1\n"})
      Fission::Action::ShellExecutor.should_receive(:new).
                                     with(@cmd).
                                     and_return(@executor)
      Fission::Fusion.running?.should == true
    end

    it 'should return a successful response and false if the fusion app is not running' do
      @executor.should_receive(:execute).and_return({'output' => "0\n"})
      Fission::Action::ShellExecutor.should_receive(:new).
                                     with(@cmd).
                                     and_return(@executor)
      Fission::Fusion.running?.should == false
    end
  end
end
