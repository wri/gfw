module Fission
  class Metadata

    require 'cfpropertylist'

    # Public: Gets/Sets the content (Hash).
    attr_accessor :content

    # Public: Deletes the Fusion metadata related to a VM.  The VM should not be
    # running when this method is called.  It's highly recommended to call this
    # method without the Fusion GUI application running.  If the Fusion GUI is
    # running this method should succeed, but it's been observed that Fusion
    # will recreate the metadata which is deleted.  This leads to 'missing' VMs
    # in the Fusion GUI.
    #
    # vm_path - The absolute path to the directory of a VM.
    #
    # Examples
    #
    #   Fission::Metadata.delete_vm_info '/vms/foo.vmwarevm'
    #
    # Returns nothing.
    def self.delete_vm_info(vm_path)
      metadata = new
      metadata.load
      metadata.delete_vm_restart_document(vm_path)
      metadata.delete_vm_favorite_entry(vm_path)
      metadata.save
    end

    # Public: Reads the configured metadata file and populates the content
    # variable with native ruby types.
    #
    # Examples
    #
    #   metadata.load
    #
    # Returns nothing.
    def load
      raw_data = CFPropertyList::List.new :file => Fission.config['plist_file']
      @content = CFPropertyList.native_types raw_data.value
    end

    # Public: Saves a new version of the metadata file with the data in the
    # content variable.
    #
    # Examples
    #
    #   metadata.save
    #
    # Returns nothing.
    def save
      new_content = CFPropertyList::List.new
      new_content.value = CFPropertyList.guess @content
      new_content.save Fission.config['plist_file'],
                       CFPropertyList::List::FORMAT_BINARY
    end

    # Public: Deletes the VM information from the 'restart document path'
    # metadata. The 'restart document path' dictates which GUI consoles to
    # display when Fusion starts.
    #
    # vm_path - The absolute path to the directory of a VM.
    #
    # Examples
    #
    #   metadata.delete_vm_restart_document 'vms/foo.vmwarevm'
    #
    # Returns nothing.
    def delete_vm_restart_document(vm_path)
      if @content.has_key?('PLRestartDocumentPaths')
        @content['PLRestartDocumentPaths'].delete_if { |p| p == vm_path }
      end
    end

    # Public: Deletes the VM information from the 'favorites list' metadata.
    # The 'favorites list' dictates which VMs are displayed in the Fusion VM
    # libarary.
    #
    # vm_path - The absolute path to the directory of a VM.
    #
    # Examples
    #
    #   metadata.delete_favorite_entry '/vms/foo.vmwarevm'
    #
    # Returns nothing.
    def delete_vm_favorite_entry(vm_path)
      if @content.has_key?('VMFavoritesListDefaults2')
        @content['VMFavoritesListDefaults2'].delete_if { |vm| vm['path'] == vm_path }
      end
      if @content.has_key?('fusionInitialSessions')
        @content['fusionInitialSessions'].delete_if {|vm| vm['documentPath'] == vm_path}
      end
    end

  end
end
