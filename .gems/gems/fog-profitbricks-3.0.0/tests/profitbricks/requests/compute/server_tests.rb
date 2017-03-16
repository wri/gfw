Shindo.tests('Fog::Compute[:profitbricks] | server request', %w(profitbricks compute)) do
  @resource_schema = {
    'id' => String,
    'type'                => String,
    'href'                => String,
    'metadata'            => Hash,
    'properties'          => Hash
  }

  @minimal_schema_with_items = {
    'id' => String,
    'type'  => String,
    'href'  => String,
    'items' => Array
  }

  @volume_schema = {
    "id"                  => String,
    "type"                => String,
    "href"                => String,
    "name"                => String,
    "description"         => String,
    "location"            => String,
    "size"                => Float,
    "cpuHotPlug"          => String,
    "cpuHotUnplug"        => String,
    "ramHotPlug"          => String,
    "ramHotUnplug"        => String,
    "nicHotPlug"          => String,
    "nicHotUnplug"        => String,
    "discVirtioHotUnplug" => String,
    "discScsiHotPlug"     => String,
    "discScsiHotUnplug"   => String,
    "licenceType"         => String,
    "imageType"           => String,
    "public"              => String,
    "createdDate"         => String,
    "createdBy"           => String,
    "etag"                => String,
    "lastModifiedDate"    => String,
    "lastModifiedBy"      => String,
    "state"               => String
  }

  @image_schema = {
    "id"                  => String,
    "type"                => String,
    "href"                => String,
    "name"                => String,
    "description"         => String,
    "location"            => String,
    "size"                => Float,
    "cpuHotPlug"          => String,
    "cpuHotUnplug"        => String,
    "ramHotPlug"          => String,
    "ramHotUnplug"        => String,
    "nicHotPlug"          => String,
    "nicHotUnplug"        => String,
    "discVirtioHotUnplug" => String,
    "discScsiHotPlug"     => String,
    "discScsiHotUnplug"   => String,
    "imageType"           => String,
    "public"              => String,
    "createdDate"         => String,
    "createdBy"           => String,
    "etag"                => String,
    "lastModifiedDate"    => String,
    "lastModifiedBy"      => String,
    "state"               => String
  }

  service = Fog::Compute[:profitbricks]

  tests('success') do
    Excon.defaults[:connection_timeout] = 500

    tests('#create_datacenter').data_matches_schema(@resource_schema) do
      options = {}
      options[:name]        = 'FogDataCenter'
      options[:location]    = 'us/las'
      options[:description] = 'Part of server tests suite'

      createDatacenterResponse = service.create_datacenter(options)
      @datacenter_id = createDatacenterResponse.body['id']

      createDatacenterResponse.body
    end

    tests('#get_datacenter').data_matches_schema(@resource_schema) do
      getDatacenterResponse = service.get_datacenter(@datacenter_id)
      getDatacenterResponse.body
    end

    tests('#get_all_datacenters').data_matches_schema(@minimal_schema_with_items) do
      getAllDatacentersResponse = service.get_all_datacenters
      getAllDatacentersResponse.body
    end

    tests('#update_datacenter').data_matches_schema(@resource_schema) do
      options = {}
      options[:name] = 'FogDataCenterRename'
      options[:description] = 'FogDataCenterDescriptionUpdated'

      updateDatacenterResponse = service.update_datacenter(
        @datacenter_id, options
      )

      updateDatacenterResponse.body
    end

    tests('#get_all_images').data_matches_schema(@minimal_schema_with_items) do
      getAllImagesResponse = service.get_all_images

      data = getAllImagesResponse.body['items'].find do |image|
        if ENV["FOG_MOCK"] != "true"
          if image['properties']
            image['properties']['location'] == 'us/las' &&
              image['properties']['imageType'] == 'CDROM' &&
              image['properties']['licenceType'] == 'LINUX'
          else
            image['location'] == 'us/las' &&
              image['imageType'] == 'CDROM' &&
              image['licenceType'] == 'LINUX'
          end
        else
          if image['properties']
            image['properties']['location'] == 'us/las' &&
              image['properties']['imageType'] == 'CDROM' &&
              image['properties']['licenceType'] == 'UNKNOWN'
          else
            image['location'] == 'us/las' &&
              image['imageType'] == 'CDROM' &&
              image['licenceType'] == 'UNKNOWN'
          end
        end
      end

      @image_id = data['id']
      getAllImagesResponse.body
    end

    if Fog.mock?
      tests('#get_image').data_matches_schema(@volume_schema) do
        getImageResponse = service.get_image(@image_id)
        getImageResponse.body
      end
    end

    unless Fog.mock?
      tests('#get_image').data_matches_schema(@resource_schema) do
        getImageResponse = service.get_image(@image_id)
        getImageResponse.body
      end
    end

    if Fog.mock?
      tests('#update_image').data_matches_schema(@image_schema) do
        options = {}
        options[:name]                = 'FogImageRename'
        options[:description]         = 'FogImageDescriptionUpdated'

        updateImageResponse = service.update_image(
          @image_id, options
        )

        updateImageResponse.body
      end
    end

    tests('#get_all_volumes').data_matches_schema(@minimal_schema_with_items) do
      if dc = service.get_all_datacenters.body["items"].find do |datacenter|
        datacenter["id"] == @datacenter_id
      end
      else
        raise Fog::Errors::NotFound, "The requested resource could not be found"
      end

      getAllVolumesResponse = service.get_all_volumes(dc['id'])
      getAllVolumesResponse.body
    end

    tests('#create_volume').data_matches_schema(@resource_schema) do
      options = {}
      options[:name]             = 'FogRestTestVolume'
      options[:size]             = 5
      options[:licenceType]      = 'LINUX'
      options[:type]             = 'HDD'
      options[:availabilityZone] = 'AUTO'

      createVolumeResponse = service.create_volume(@datacenter_id, options)
      @volume_id = createVolumeResponse.body['id']

      sleep(5) if ENV["FOG_MOCK"] != "true"

      createVolumeResponse.body
    end

    tests('#get_volume').data_matches_schema(@resource_schema) do
      getVolumeResponse = service.get_volume(@datacenter_id, @volume_id)
      getVolumeResponse.body
    end

    tests('#create_volume_snapshot').data_matches_schema(@resource_schema) do
      options = {}
      options[:name]        = 'FogRestTestSnapshot'
      options[:description] = 'Testing fog create snapshot'

      sleep(15) if ENV["FOG_MOCK"] != "true"

      createVolumeSnapshotResponse = service.create_volume_snapshot(@datacenter_id, @volume_id, options)
      @snapshot_id = createVolumeSnapshotResponse.body['id']

      createVolumeSnapshotResponse.body
    end

    tests('#update_volume').data_matches_schema(@resource_schema) do
      options = {}
      options[:name] = 'FogRestTestVolumeRenamed'
      options[:size] = 6

      updateVolumeResponse = service.update_volume(@datacenter_id, @volume_id, options)

      updateVolumeResponse.body
    end

    tests('#update_snapshot').data_matches_schema(@resource_schema) do
      options = {}
      options[:name]        = 'FogRestTestSnapshotRename'
      options[:description] = 'Testing fog create snapshot - updated description'
      options[:ramHotPlug]  = true

      updateSnapshotResponse = service.update_snapshot(@snapshot_id, options)

      updateSnapshotResponse.body
    end

    tests('#get_snapshot').data_matches_schema(@resource_schema) do
      getSnapshotResponse = service.get_snapshot(@snapshot_id)
      getSnapshotResponse.body
    end

    tests('#restore_volume_snapshot').succeeds do
      options = {}
      options[:snapshot_id] = @snapshot_id

      restoreVolumeSnapshotResponse = service.restore_volume_snapshot(@datacenter_id, @volume_id, options)
      restoreVolumeSnapshotResponse.status == 202
    end

    tests('#get_all_snapshots').data_matches_schema(@minimal_schema_with_items) do
      getAllSnapshotsResponse = service.get_all_snapshots
      getAllSnapshotsResponse.body
    end

    tests('#create_server').data_matches_schema(@resource_schema) do
      properties = {}
      properties[:name]             = 'FogTestServer_2'
      properties[:cores]            = 1
      properties[:ram]              = 1024
      properties[:availabilityZone] = 'ZONE_1'
      properties[:cpuFamily]        = 'INTEL_XEON'

      entities = {}
      entities[:volumes] = {}
      entities[:volumes]['items'] = [
        {
          'id' => @volume_id
        }
      ]

      createServerResponse = service.create_server(@datacenter_id, properties, entities)
      @server_id = createServerResponse.body['id']

      sleep(60) if ENV["FOG_MOCK"] != "true"

      createServerResponse.body
    end

    tests('#get_server').data_matches_schema(@resource_schema) do
      sleep(10) if ENV["FOG_MOCK"] != "true"
      getServerResponse = service.get_server(@datacenter_id, @server_id)
      getServerResponse.body
    end

    tests('#list_attached_volumes').data_matches_schema(@minimal_schema_with_items) do
      listAttachedVolumesResponse = service.list_attached_volumes(@datacenter_id, @server_id)
      listAttachedVolumesResponse.body
    end

    tests('#attach_volume').data_matches_schema(@resource_schema) do
      attachVolumeResponse = service.attach_volume(@datacenter_id, @server_id, @volume_id)

      attachVolumeResponse.body
    end

    tests('#get_attached_volume').data_matches_schema(@resource_schema) do
      getAttachedVolumeResponse = service.get_attached_volume(@datacenter_id, @server_id, @volume_id)
      getAttachedVolumeResponse.body
    end

    tests('#detach_volume').succeeds do
      detachVolumeResponse = service.detach_volume(@datacenter_id, @server_id, @volume_id)
      detachVolumeResponse.status == 202
    end

    unless Fog.mock?
      tests('#attach_cdrom').data_matches_schema(@resource_schema) do
        attachCdromResponse = service.attach_cdrom(@datacenter_id, @server_id, @image_id)

        @cdrom_id = attachCdromResponse.body['id']

        attachCdromResponse.body
      end
    end

    if Fog.mock?
      tests('#attach_cdrom').succeeds do
        attachCdromResponse = service.attach_cdrom(@datacenter_id, @server_id, @image_id)

        @cdrom_id = attachCdromResponse.body['id']

        attachCdromResponse.body
      end
    end

    unless Fog.mock?
      tests('#get_attached_cdrom').data_matches_schema(@resource_schema) do
        sleep(60)
        getAttachedVolumeResponse = service.get_attached_cdrom(@datacenter_id, @server_id, @cdrom_id)
        getAttachedVolumeResponse.body
      end
    end

    if Fog.mock?
      tests('#get_attached_cdrom').succeeds do
        getAttachedVolumeResponse = service.get_attached_cdrom(@datacenter_id, @server_id, @cdrom_id)
        getAttachedVolumeResponse.body
      end
    end

    tests('#list_attached_cdroms').data_matches_schema(@minimal_schema_with_items) do
      sleep(10) if ENV["FOG_MOCK"] != "true"

      listAttachedCdromsResponse = service.list_attached_cdroms(@datacenter_id, @server_id)

      listAttachedCdromsResponse.body
    end

    tests('#detach_cdrom').succeeds do
      detachVolumeResponse = service.detach_cdrom(@datacenter_id, @server_id, @cdrom_id)
      detachVolumeResponse.status == 202
    end

    tests('#update_server').data_matches_schema(@resource_schema) do
      updateServerResponse = service.update_server(@datacenter_id, @server_id, 'name' => 'FogServerRename')

      updateServerResponse.body
    end

    tests('#get_all_servers').data_matches_schema(@minimal_schema_with_items) do
      getAllServersResponse = service.get_all_servers(@datacenter_id)

      getAllServersResponse.body
    end

    tests('#stop_server').succeeds do
      stopServerResponse = service.stop_server(@datacenter_id, @server_id)

      stopServerResponse.status == 202
    end

    tests('#start_server').succeeds do
      startServerResponse = service.start_server(@datacenter_id, @server_id)

      startServerResponse.status == 202
    end

    tests('#reboot_server').succeeds do
      rebootServerResponse = service.reboot_server(@datacenter_id, @server_id)

      rebootServerResponse.status == 202
    end

    tests('#delete_server').succeeds do
      deleteServerResponse = service.delete_server(@datacenter_id, @server_id)
      deleteServerResponse.status == 202
    end

    tests('#delete_snapshot').succeeds do
      deleteSnapshotResponse = service.delete_snapshot(@snapshot_id)
      deleteSnapshotResponse.status == 202
    end

    tests('#delete_volume').succeeds do
      deleteVolumeResponse = service.delete_volume(@datacenter_id, @volume_id)
      deleteVolumeResponse.status == 202
    end

    if Fog.mock?
      tests('#delete_image').succeeds do
        deleteImageResponse = service.delete_image(@image_id)
        deleteImageResponse.status == 202
      end
    end

    tests('#delete_datacenter').succeeds do
      deleteDatacenterResponse = service.delete_datacenter(@datacenter_id)
      deleteDatacenterResponse.status == 202
    end
  end

  tests('failure') do
    tests('#get_datacenter').raises(Excon::Error::HTTPStatus) do
      service.get_datacenter('00000000-0000-0000-0000-000000000000')
    end

    tests('#update_datacenter').raises(Excon::Error::HTTPStatus) do
      service.update_datacenter('00000000-0000-0000-0000-000000000000',
                                'name' => 'FogTestDCRename')
    end

    tests('#delete_datacenter').raises(Excon::Error::HTTPStatus) do
      service.delete_datacenter('00000000-0000-0000-0000-000000000000')
    end

    tests('#get_image').raises(Excon::Error::HTTPStatus) do
      service.get_image('00000000-0000-0000-0000-000000000000')
    end

    tests('#update_image').raises(Excon::Error::HTTPStatus) do
      service.update_image('00000000-0000-0000-0000-000000000000', {})
    end

    tests('#create_volume').raises(ArgumentError) do
      service.create_volume
    end

    tests('#create_volume_snapshot').raises(ArgumentError) do
      service.create_volume_snapshot
    end

    tests('#create_volume_snapshot').raises(Excon::Error::HTTPStatus) do
      service.create_volume_snapshot('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', :name => 'test')
    end

    tests('#get_snapshot').raises(Excon::Error::HTTPStatus) do
      service.get_snapshot('00000000-0000-0000-0000-000000000000')
    end

    tests('#get_snapshot').raises(ArgumentError) do
      service.get_snapshot
    end

    tests('#restore_volume_snapshot').raises(ArgumentError) do
      service.restore_volume_snapshot
    end

    tests('#restore_volume_snapshot').raises(Excon::Error::HTTPStatus) do
      service.restore_volume_snapshot('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', :name => 'test')
    end

    tests('#get_volume').raises(Excon::Error::HTTPStatus) do
      service.get_volume('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000')
    end

    tests('#update_volume').raises(Excon::Error::HTTPStatus) do
      service.update_volume('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000')
    end

    tests('#delete_volume').raises(Excon::Error::HTTPStatus) do
      service.delete_volume('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000')
    end
  end
end
