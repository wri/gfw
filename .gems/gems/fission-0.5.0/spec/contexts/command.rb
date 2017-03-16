shared_context 'command_setup' do
  before do
    @string_io = StringIO.new
    ui_stub = Fission::UI.new(@string_io)
    Fission::UI.stub(:new).and_return(ui_stub)

    @all_running_response_mock = double('all_running_response')
    @state_response_mock = double('state_response')
    @vm_mock = double('vm_mock')
  end

end
