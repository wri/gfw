module Fog
  module Compute
    class Vsphere
      class Real
        def upload_iso_check_options(options)
          default_options = {
            'upload_directory' => 'isos',
          }
          options = default_options.merge(options)
          required_options = %w{ datacenter datastore local_path }
          required_options.each do |param|
            raise ArgumentError, "#{required_options.join(', ')} are required" unless options.key? param
          end
          raise Fog::Compute::Vsphere::NotFound, "Datacenter #{options["datacenter"]} Doesn't Exist!" unless get_datacenter(options["datacenter"])
          raise Fog::Compute::Vsphere::NotFound, "Datastore #{options["datastore"]} Doesn't Exist!" unless get_raw_datastore(options['datastore'], options['datacenter'])
          options
        end

        def upload_iso(options = {})
          options = upload_iso_check_options(options)
          datastore = get_raw_datastore(options['datastore'], options['datacenter'])
          datacenter = get_raw_datacenter(options['datacenter'])
          filename = options['filename'] || File.basename(options['local_path'])
          unless datastore.exists? options['upload_directory']+'/'
            @connection.serviceContent.fileManager.MakeDirectory :name => "[#{options['datastore']}] #{options['upload_directory']}",
                                                                 :datacenter => datacenter,
                                                                 :createParentDirectories => false
          end
          datastore.upload options['upload_directory']+'/'+filename, options['local_path']
          datastore.exists? options['upload_directory']+'/'+filename
        end
      end
    end
  end
end
