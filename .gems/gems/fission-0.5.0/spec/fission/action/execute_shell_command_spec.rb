require 'spec_helper'

describe Fission::Action::ShellExecutor do

  describe 'execute' do
    before do
      @cmd = 'ls /var/log'
      @executor = Fission::Action::ShellExecutor.new @cmd
    end

    it 'should execute the shell command' do
      @executor.should_receive(:`).with(@cmd)
      @executor.execute
    end

    it 'should return a hash of the output and Process::Status object' do
      result = @executor.execute
      result['output'].should be_a String
      result['output'].empty?.should be_false
      result['process_status'].should be_a Process::Status
    end

  end

end
