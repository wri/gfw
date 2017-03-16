module Fog
  module Compute
    class ProfitBricks
      class Real
        # Update an existing image
        #
        # ==== Parameters
        # * image_id<~String>               - UUID of the image resource
        # * options<~Hash>:
        #   * name<~String>                 - The name of the image
        #   * description<~String>          - The description of the image
        #   * licenceType<~String>          - The image's licence type: LINUX, WINDOWS, or UNKNOWN
        #   * cpuHotPlug<~String>           - This image is capable of CPU hot plug (no reboot required)
        #   * cpuHotUnplug<~String>         - This image is capable of CPU hot unplug (no reboot required)
        #   * ramHotPlug<~String>           - This image is capable of memory hot plug (no reboot required)
        #   * ramHotUnplug<~String>         - This image is capable of memory hot unplug (no reboot required)
        #   * nicHotPlug<~String>           - This image is capable of nic hot plug (no reboot required)
        #   * nicHotUnplug<~String>         - This image is capable of nic hot unplug (no reboot required)
        #   * discVirtioHotPlug<~String>    - This image is capable of Virt-IO drive hot plug (no reboot required)
        #   * discVirtioHotUnplug<~String>  - This image is capable of Virt-IO drive hot unplug (no reboot required)
        #   * discScsiHotPlug<~String>      - This image is capable of Scsi drive hot plug (no reboot required)
        #   * discScsiHotUnplug<~String>    - This image is capable of Scsi drive hot unplug (no reboot required)
        #
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * id<~String>                   - The resource's unique identifier
        #       * type<~String>                 - The type of the requested resource
        #       * href<~String>                 - URL to the object’s representation (absolute path)
        #       * metadata<~Hash>               - Hash containing the image metadata
        #         * createdDate<~String>        - The date the resource was created
        #         * createdBy<~String>          - The user who created the resource
        #         * etag<~String>               - The etag for the resource
        #         * lastModifiedDate<~String>   - The last time the resource has been modified
        #         * lastModifiedBy<~String>     - The user who last modified the resource
        #         * state<~String>              - Volume state
        #       * properties<~Hash>             - Hash containing the volume properties
        #         * name<~String>               - The name of the image
        #         * description<~String>        - The description of the image
        #         * location<~String>           - The image's location
        #         * size<~Integer>              - The size of the image in GB
        #         * cpuHotPlug<~Boolean>        - This image is capable of CPU hot plug (no reboot required)
        #         * cpuHotUnplug<~Boolean>      - This image is capable of CPU hot unplug (no reboot required)
        #         * ramHotPlug<~Boolean>        - This image is capable of memory hot plug (no reboot required)
        #         * ramHotUnplug<~Boolean>      - This image is capable of memory hot unplug (no reboot required)
        #         * nicHotPlug<~Boolean>        - This image is capable of nic hot plug (no reboot required)
        #         * nicHotUnplug<~Boolean>      - This image is capable of nic hot unplug (no reboot required)
        #         * discVirtioHotPlug<~Boolean> - This image is capable of Virt-IO drive hot plug (no reboot required)
        #         * discVirtioHotPlug<~Boolean> - This image is capable of Virt-IO drive hot unplug (no reboot required)
        #         * discScsiHotPlug<~Boolean>   - This image is capable of Scsi drive hot plug (no reboot required)
        #         * discScsiHotUnplug<~Boolean> - This image is capable of Scsi drive hot unplug (no reboot required)
        #         * licenceType<~String>        - The image's licence type: LINUX, WINDOWS, or UNKNOWN
        #         * imageType<~String>          - The type of image: HDD, CDROM
        #         * public<~String>             - Indicates if the image is part of the public repository or not
        #
        # {ProfitBricks API Documentation}[https://devops.profitbricks.com/api/cloud/v2/#update-image]
        def update_image(image_id, options = {})
          request(
            :expects => [202],
            :method  => 'PATCH',
            :path    => "/images/#{image_id}",
            :body    => Fog::JSON.encode(options)
          )
        end
      end

      class Mock
        def update_image(image_id, options = {})
          if img = data[:images]["items"].find do |image|
            image["id"] == image_id
          end
            img['licenceType'] = options[:licenceType]
            options.each do |key, value|
              img[key.to_s] = value
            end

          else
            raise Excon::Error::HTTPStatus, "The requested resource could not be found"
          end

          response        = Excon::Response.new
          response.status = 202
          response.body   = img

          response
        end
      end
    end
  end
end
