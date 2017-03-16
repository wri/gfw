module CommandHelpers
  def it_should_not_accept_arguments_of(args, command_name)
    it "should output an error and the help when #{args.count} arguments are passed in" do
      subject.should_receive(:help)

      command = subject.new args
      lambda { command.execute }.should raise_error SystemExit

      @string_io.string.should match /[Incorrect arguments for #{command_name} command|invalid option]/
    end
  end
end
