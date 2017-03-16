module Fog
  module Compute
    class Ecloud
      class SshKey < Fog::Ecloud::Model
        identity :href

        attribute :name, :aliases => :Name
        attribute :type, :aliases => :Type
        attribute :other_links, :aliases => :Links
        attribute :default, :aliases => :Default, :type => :boolean
        attribute :finger_print, :aliases => :FingerPrint
        attribute :private_key, :aliases => :PrivateKey

        def delete
          service.ssh_key_delete(href).body
        end
        alias_method :destroy, :delete

        def edit(options = {})
          # Make sure we only pass what we should
          new_options = {}
          new_options[:uri] = href
          if options[:Name].nil?
            new_options[:Name] = name
          else
            new_options[:Name] = options[:Name]
          end
          if options[:Default].nil?
            new_options[:Default] = default
          else
            new_options[:Default] = options[:Default]
          end

          service.ssh_key_edit(new_options)
        end

        def id
          href.scan(/\d+/)[0]
        end
      end
    end
  end
end
