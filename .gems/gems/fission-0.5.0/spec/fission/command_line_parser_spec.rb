require 'spec_helper'

describe Fission::CommandLineParser do
  before do
    @string_io = StringIO.new
    Fission::CommandLineParser.any_instance.
                               stub(:ui).
                               and_return(Fission::UI.new(@string_io))
  end

  describe 'initialize' do
    it 'should set command to nil' do
      Fission::CommandLineParser.new.command.should be_nil
    end
  end

  describe 'parse' do
    context 'with no initial arguments' do
      it 'should output the usage info' do
        lambda {
          Fission::CommandLineParser.new([]).parse
        }.should raise_error SystemExit
        @string_io.string.should match /Usage/
      end
    end

    context 'with -v or --version initial arguments' do
      ['-v', '--version'].each do |arg|
        it "should output the version with #{arg}" do
          lambda {
            Fission::CommandLineParser.new([arg]).parse
          }.should raise_error SystemExit

          @string_io.string.should match /#{Fission::VERSION}/
        end
      end
    end

    context 'with -h or --help initial arguments' do
      ['-h', '--help'].each do |arg|
        it "should output the usage info with #{arg}" do
          lambda {
            Fission::CommandLineParser.new([arg]).parse
          }.should raise_error SystemExit

          @string_io.string.should match /Usage/
        end
      end
    end

    context 'with an invalid sub command' do
      it 'should display the help' do
        lambda {
          Fission::CommandLineParser.new(['foo', 'bar']).parse
        }.should raise_error SystemExit

        @string_io.string.should match /Usage/
      end
    end

    context 'with a valid sub command' do
      before do
        @cmd_mock = double('command', :summary => '')
      end

      [ ['clone'],
        ['delete'],
        ['snapshot', 'create'],
        ['snapshot', 'delete'],
        ['snapshot', 'list'],
        ['snapshot', 'revert'],
        ['start'],
        ['status'],
        ['stop'],
        ['suspend']
      ].each do |command|
        it "should accept #{command}" do
          Fission::CommandLineParser.new(command).parse
        end

        it "should populate @command with an instance of the '#{command.join(' ')}' class" do
          klass = command.map { |c| c.capitalize }.join('')
          parser = Fission::CommandLineParser.new(command).parse
          parser.command.should be_an_instance_of Fission::Command.const_get klass
        end
      end

      context 'clone' do
        before do
          @cmd_mock.stub(:command_name).and_return('clone')
          Fission::Command::Clone.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::Clone.should_receive(:new).
                                  with(['foo', 'bar'])
          Fission::CommandLineParser.new(['clone', 'foo', 'bar']).parse
        end

        context 'with --start' do
          it 'should create the command with the start option' do
            Fission::Command::Clone.should_receive(:new).
                                    with(['foo', 'bar', '--start'])
            Fission::CommandLineParser.new(['clone', 'foo', 'bar', '--start']).parse
          end
        end

      end

      context 'delete' do
        before do
          @cmd_mock.stub(:command_name).and_return('delete')
          Fission::Command::Delete.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::Delete.should_receive(:new).
                                   with(['foo'])
          Fission::CommandLineParser.new(['delete', 'foo']).parse
        end

        context 'with --force' do
          it 'should create the command with the force option' do
            Fission::Command::Delete.should_receive(:new).
                                     with(['foo', '--force'])
            Fission::CommandLineParser.new(['delete', 'foo', '--force']).parse
          end
        end

      end

      context 'snapshot create' do
        before do
          @cmd_mock.stub(:command_name).and_return('snapshot create')
          Fission::Command::SnapshotCreate.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::SnapshotCreate.should_receive(:new).
                                           with(['foo', 'bar'])
          Fission::CommandLineParser.new(['snapshot', 'create', 'foo', 'bar']).parse
        end
      end

      context 'snapshot delete' do
        before do
          @cmd_mock.stub(:command_name).and_return('snapshot delete')
          Fission::Command::SnapshotDelete.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::SnapshotDelete.should_receive(:new).
                                           with(['foo', 'bar'])
          Fission::CommandLineParser.new(['snapshot', 'delete', 'foo', 'bar']).parse
        end
      end

      context 'snapshot list' do
        before do
          @cmd_mock.stub(:command_name).and_return('snapshot list')
          Fission::Command::SnapshotList.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::SnapshotList.should_receive(:new).
                                           with(['foo'])
          Fission::CommandLineParser.new(['snapshot', 'list', 'foo']).parse
        end
      end

      context 'snapshot revert' do
        before do
          @cmd_mock.stub(:command_name).and_return('snapshot revert')
          Fission::Command::SnapshotRevert.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::SnapshotRevert.should_receive(:new).
                                           with(['foo', 'bar'])
          Fission::CommandLineParser.new(['snapshot', 'revert', 'foo', 'bar']).parse
        end
      end

      context 'start' do
        before do
          @cmd_mock.stub(:command_name).and_return('start')
          Fission::Command::Start.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::Start.should_receive(:new).
                                  with(['foo'])
          Fission::CommandLineParser.new(['start', 'foo']).parse
        end

        context 'with --headless' do
          it 'should create the command with the force option' do
            Fission::Command::Start.should_receive(:new).
                                     with(['foo', '--headless'])
            Fission::CommandLineParser.new(['start', 'foo', '--headless']).parse
          end
        end

      end

      context 'status' do
        before do
          @cmd_mock.stub(:command_name).and_return('status')
          Fission::Command::Status.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::Status.should_receive(:new).
                                   with([])
          Fission::CommandLineParser.new(['status']).parse
        end
      end

      context 'stop' do
        before do
          @cmd_mock.stub(:command_name).and_return('stop')
          Fission::Command::Stop.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::Stop.should_receive(:new).
                                 with(['foo'])
          Fission::CommandLineParser.new(['stop', 'foo']).parse
        end

        context 'with --force' do
          it 'should create the command with the force option' do
            Fission::Command::Stop.should_receive(:new).
                                    with(['foo', '--force'])
            Fission::CommandLineParser.new(['stop', 'foo', '--force']).parse
          end
        end

      end

      context 'suspend' do
        before do
          @cmd_mock.stub(:command_name).and_return('suspend')
          Fission::Command::Suspend.should_receive(:new).and_return(@cmd_mock)
        end

        it 'should create the command' do
          Fission::Command::Suspend.should_receive(:new).
                                    with(['foo'])
          Fission::CommandLineParser.new(['suspend', 'foo']).parse
        end

        context 'with --all' do
          it 'should create the command with the all option' do
            Fission::Command::Suspend.should_receive(:new).
                                      with(['--all'])
            Fission::CommandLineParser.new(['suspend', '--all']).parse
          end
        end

      end

    end

  end

end
