module Fog
  module AWS
    class EFS
      class Real
        # Create a new, empty file system
        # http://docs.aws.amazon.com/efs/latest/ug/API_CreateFileSystem.html
        # ==== Parameters
        # * CreationToken <~String> - String of up to 64 ASCII characters. Amazon EFS uses this to ensure idempotent creation.
        # * PerformanceMode <~String> - (Optional) The PerformanceMode of the file system. We recommend generalPurpose performance mode for most file systems. File systems using the maxIO performance mode can scale to higher levels of aggregate throughput and operations per second with a tradeoff of slightly higher latencies for most file operations. This can't be changed after the file system has been created.
        # ==== Returns
        # * response<~Excon::Response>
        #   * body<~Hash>
        def create_file_system(creation_token, options={})
          request({
            :path             => "file-systems",
            :method           => 'POST',
            :expects          => 201,
            'CreationToken'   => creation_token,
            'PerformanceMode' => options[:peformance_mode] || 'generalPurpose'
          })
        end
      end

      class Mock
        def create_file_system(creation_token, options={})
          response = Excon::Response.new

          id = "fs-#{Fog::Mock.random_letters(8)}"
          file_system = {
            "OwnerId"              => Fog::AWS::Mock.owner_id,
            "CreationToken"        => creation_token,
            "PerformanceMode"      => options[:performance_mode] || "generalPurpose",
            "FileSystemId"         => id,
            "CreationTime"         => Time.now.to_i.to_f,
            "LifeCycleState"       => "creating",
            "NumberOfMountTargets" => 0,
            "SizeInBytes"          => {
              "Value"     => 1024,
              "Timestamp" => Time.now.to_i.to_f
            }
          }

          self.data[:file_systems][id] = file_system
          response.body = file_system
          response.status = 201
          response
        end
      end
    end
  end
end
