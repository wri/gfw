module Fog
  module Compute
    class XenServer
      class Real
        def introduce_vdi(uuid, name_label, name_description, sr, type, sharable, read_only, other_config, location, xenstore_data, sm_config, managed, virtual_size, physical_utilisation, metadata_of_pool, is_a_snapshot, snapshot_time, snapshot_of)
          @connection.request({ :parser => Fog::Parsers::XenServer::Base.new, :method => "VDI.introduce" }, uuid, name_label, name_description, sr, type, sharable, read_only, other_config, location, xenstore_data, sm_config, managed, virtual_size, physical_utilisation, metadata_of_pool, is_a_snapshot, snapshot_time, snapshot_of)
        end
      end
    end
  end
end
