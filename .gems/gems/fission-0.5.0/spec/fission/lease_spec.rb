require 'spec_helper'

describe Fission::Lease do
  before do
    @lease_info = [ { :ip_address   => '172.16.248.197',
                      :mac_address  => '00:0c:29:2b:af:50',
                      :start        => '2011/10/11 01:50:58',
                      :end          => '2011/10/11 02:20:58' },
                    { :ip_address   => '172.16.248.170',
                      :mac_address  => '00:0c:29:b3:63:d0',
                      :start        => '2010/03/01 00:54:52',
                      :end          => '2010/03/01 01:24:52' },
                    { :ip_address   => '172.16.248.132',
                      :mac_address  => '00:0c:29:10:23:57',
                      :start        => '2010/07/12 21:31:28',
                      :end          => '2010/07/12 22:01:28' },
                    { :ip_address   => '172.16.248.150',
                      :mac_address  => '00:0c:29:b3:63:d0',
                      :start        => '2010/05/27 00:54:52',
                      :end          => '2010/05/27 01:24:52' },
                    { :ip_address   => '172.16.248.130',
                      :mac_address  => '00:0c:29:b3:63:d0',
                      :start        => '2010/04/15 00:54:52',
                      :end          => '2010/04/15 01:24:52' },
                    { :ip_address   => '172.16.248.129',
                      :mac_address  => '00:0c:29:0a:e9:b3',
                      :start        => '2010/02/16 23:16:05',
                      :end          => '2010/02/16 23:46:05' } ]

    @lease_file_content = '# This is a comment
# And here is another
lease 172.16.248.197 {
    starts 2 2011/10/11 01:50:58;
    ends 2 2011/10/11 02:20:58;
    hardware ethernet 00:0c:29:2b:af:50;
}
lease 172.16.248.170 {
    starts 4 2010/03/01 00:54:52;
    ends 4 2010/03/01 01:24:52;
    hardware ethernet 00:0c:29:b3:63:d0;
}
lease 172.16.248.132 {
    starts 1 2010/07/12 21:31:28;
    ends 1 2010/07/12 22:01:28;
    hardware ethernet 00:0c:29:10:23:57;
}
lease 172.16.248.150 {
    starts 4 2010/05/27 00:54:52;
    ends 4 2010/05/27 01:24:52;
    hardware ethernet 00:0c:29:b3:63:d0;
}
lease 172.16.248.130 {
    starts 4 2010/04/15 00:54:52;
    ends 4 2010/04/15 01:24:52;
    hardware ethernet 00:0c:29:b3:63:d0;
}
lease 172.16.248.129 {
    starts 2 2010/02/16 23:16:05;
    ends 2 2010/02/16 23:46:05;
    hardware ethernet 00:0c:29:0a:e9:b3;
}'
  end

  describe 'new' do
    it 'should set the ip address' do
      lease = Fission::Lease.new :ip_address => '127.0.0.1'
      lease.ip_address.should == '127.0.0.1'
    end

    it 'should set the mac address' do
      lease = Fission::Lease.new :mac_address => '00:00:00:00:00:00'
      lease.mac_address.should == '00:00:00:00:00:00'
    end

    it 'should set the lease start date/time' do
      date_time = DateTime.parse('2000/01/01 17:00:00')
      lease = Fission::Lease.new :start => date_time
      lease.start.should == date_time
    end

    it 'should set the lease end date/time' do
      date_time = DateTime.parse('2000/01/01 17:00:00')
      lease = Fission::Lease.new :end => date_time
      lease.end.should == date_time
    end
  end

  describe 'expired?' do
    it 'should return true if the lease is expired' do
      lease = Fission::Lease.new :end => DateTime.now - 1
      lease.expired?.should == true
    end

    it 'should return false if the lease has not expired' do
      lease = Fission::Lease.new :end => DateTime.now + 1
      lease.expired?.should == false
    end
  end

  describe 'self.all' do

    context 'when the lease file exists' do
      before do
        File.should_receive(:file?).
             with(Fission.config['lease_file']).
             and_return(true)
      end

      it 'returns a response with the list of the found leases' do
        File.should_receive(:read).
             with(Fission.config['lease_file']).
             and_return(@lease_file_content)

        example_leases = @lease_info.collect do |lease|
          Fission::Lease.new :ip_address  => lease[:ip_address],
                             :mac_address => lease[:mac_address],
                             :start       => DateTime.parse(lease[:start]),
                             :end         => DateTime.parse(lease[:end])
        end

        response = Fission::Lease.all
        response.should be_a_successful_response

        response.data.each do |lease|
          example_lease = example_leases.select { |l| l.ip_address == lease.ip_address }

          [:ip_address, :mac_address, :start, :end].each do |attrib|
            lease.send(attrib).should == example_lease.first.send(attrib)
          end
        end

      end

      it 'a response with an empty list if there are no leases found' do
        File.should_receive(:read).
             with(Fission.config['lease_file']).
             and_return('')
        response = Fission::Lease.all
        response.should be_a_successful_response
        response.data.should == []
      end

    end

    context 'when the lease file does not exist' do
      before do
        File.should_receive(:file?).
             with(Fission.config['lease_file']).
             and_return(false)
      end

      it 'should return an unsuccessful response if the configured lease file does not exist' do
        response = Fission::Lease.all
        error_string = "Unable to find the lease file '#{Fission.config['lease_file']}'"
        response.should be_an_unsuccessful_response(error_string)
      end

    end

  end

  describe 'self.find_by_mac_address' do
    describe 'when able to get all of the leases' do
      before do
        File.stub(:file?).and_return(true)
        File.stub(:read).and_return(@lease_file_content)
      end

      context 'when there are multiple leases for the mac address' do
        it 'should return the lease with the latest expiration' do
          response = Fission::Lease.find_by_mac_address '00:0c:29:b3:63:d0'

          response.should be_a_successful_response

          response.data.ip_address.should == '172.16.248.150'
          response.data.mac_address.should == '00:0c:29:b3:63:d0'
          response.data.start.should == DateTime.parse('2010/05/27 00:54:52')
          response.data.end.should == DateTime.parse('2010/05/27 01:24:52')
        end
      end

      it 'should return a response with the lease associated with the provided mac address' do
        response = Fission::Lease.find_by_mac_address '00:0c:29:10:23:57'

        response.should be_a_successful_response
        response.data.ip_address.should == '172.16.248.132'
        response.data.mac_address.should == '00:0c:29:10:23:57'
        response.data.start.should == DateTime.parse('2010/07/12 21:31:28')
        response.data.end.should == DateTime.parse('2010/07/12 22:01:28')
      end

      it "should return a response with nil if the mac address can't be found" do
        response = Fission::Lease.find_by_mac_address('00:11:22:33:44:55')

        response.should be_a_successful_response
        response.data.should be_nil
      end
    end

    it 'should return an unsuccessful response if there was an error getting all of the leases' do
      @all_response_mock = double('all_response')
      @all_response_mock.stub_as_unsuccessful

      Fission::Lease.stub(:all).and_return(@all_response_mock)

      response = Fission::Lease.find_by_mac_address('00:11:22:33:44:55')

      response.should be_an_unsuccessful_response
    end
  end

end
