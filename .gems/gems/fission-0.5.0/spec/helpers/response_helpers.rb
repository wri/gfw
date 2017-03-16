module ResponseHelpers
  def stub_response_mock_with(args={})
    args.each_pair do |method, data|
      stub(method).and_return(data)
    end
  end

  def stub_as_successful(data=nil)
    stub_response_mock_with :code => 0,
                            :message => '',
                            :successful? => true,
                            :data => data
  end

  def stub_as_unsuccessful
    stub_response_mock_with :code => 1,
                            :message => 'it blew up',
                            :successful? => false,
                            :data => nil
  end
end
