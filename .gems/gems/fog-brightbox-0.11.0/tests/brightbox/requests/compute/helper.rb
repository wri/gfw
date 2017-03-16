class Brightbox
  module Compute
    module TestSupport
      # Find a suitable image for testing with
      # For speed of server building we're using an empty image
      #
      # Unless the tester has credentials this will fail so we rescue
      # any errors and return nil.
      #
      # This is used in the shared file +tests/compute/helper.rb+ so unfortunately
      # makes all tests reliant on hardcoded values and each other
      #
      # @return [String,NilClass] the most suitable test image's identifier or nil
      def self.image_id
        return @image_id unless @image_id.nil?
        images = Fog::Compute[:brightbox].list_images
        @image_id = Fog::Brightbox::Compute::ImageSelector.new(images).official_minimal
      end

      # Prepare a test server, wait for it to be usable but raise if it fails
      def self.get_test_server
        test_server_options = { :image_id => image_id }
        server = Fog::Compute[:brightbox].servers.create(test_server_options)
        server.wait_for do
          raise "Test server failed to build" if state == "failed"
          ready?
        end
        server
      end
    end
  end
end
