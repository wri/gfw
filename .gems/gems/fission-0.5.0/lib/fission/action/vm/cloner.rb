module Fission
  module Action
    module VM

      class Cloner

        # Internal: Creates a new VMCloner object.  This accepts a source and
        # target VM object.
        #
        # source_vm - An instance of VM
        # target_vm - An instance of VM
        #
        # Examples:
        #
        #   Fission::Action::VMCloner.new @my_source_vm, @my_target_vm
        #
        # Returns a new VMCloner object.
        def initialize(source_vm, target_vm)
          @source_vm = source_vm
          @target_vm = target_vm
        end

        # Public: Creates a new VM which is a clone of an existing VM. As
        # Fusion doesn't provide a native cloning mechanism, this is a best
        # effort. This essentially is a directory copy with updates to relevant
        # files. It's recommended to clone VMs which are not running.
        #
        # Examples
        #
        #   @cloner.clone
        #
        # Returns a Response with the result.
        # If successful, the Response's data attribute will be nil.
        # If there is an error, an unsuccessful Response will be returned.
        def clone
          unless @source_vm.exists?
            return Response.new :code => 1, :message => 'VM does not exist'
          end

          if @target_vm.exists?
            return Response.new :code => 1, :message => 'VM already exists'
          end

          FileUtils.cp_r @source_vm.path, @target_vm.path

          rename_vm_files @source_vm.name, @target_vm.name
          update_config @source_vm.name, @target_vm.name

          Response.new :code => 0
        end

        private
        # Internal: Renames the files of a newly cloned VM.
        #
        # from - The VM name that was used as the source of the clone.
        # to   - The name of the newly cloned VM.
        #
        # Examples
        #
        #   @cloner.rename_vm_files 'foo', 'bar'
        #
        # Returns nothing.
        def rename_vm_files(from, to)
          files_to_rename(from, to).each do |file|
            text_to_replace = File.basename(file, File.extname(file))

            if File.extname(file) == '.vmdk'
              if file.match /\-s\d+\.vmdk/
                text_to_replace = file.partition(/\-s\d+.vmdk/).first
              end
            end

            unless File.exists?(File.join(@target_vm.path, file.gsub(text_to_replace, to)))
              FileUtils.mv File.join(@target_vm.path, file),
                File.join(@target_vm.path, file.gsub(text_to_replace, to))
            end
          end
        end

        # Internal: Provides the list of files which need to be renamed in a
        # newly cloned VM directory.
        #
        # from - The VM name that was used as the source of the clone.
        # to   - The name of the newly cloned VM.
        #
        # Examples
        #
        #   @cloner.files_to_rename 'foo', 'bar'
        #   # => ['/vms/vm1/foo.vmdk', '/vms/vm1/foo.vmx', 'vms/vm1/blah.other']
        #
        # Returns an Array containing the paths (String) to the files to rename.
        # The paths which match the from name will preceed any other files
        # found in the newly cloned VM directory.
        def files_to_rename(from, to)
          files_which_match_source_vm = []
          other_files = []

          Dir.entries(@target_vm.path).each do |f|
            unless f == '.' || f == '..'
              f.include?(from) ? files_which_match_source_vm << f : other_files << f
            end
          end

          files_which_match_source_vm + other_files
        end

        # Internal: Provides the list of file extensions for VM related files.
        #
        # Examples
        #
        #   @cloner.vm_file_extension
        #   # => ['.nvram', '.vmdk', '.vmem']
        #
        # Returns an Array containing the file extensions of VM realted files.
        # The file extensions returned are Strings and include a '.'.
        def vm_file_extensions
          ['.nvram', '.vmdk', '.vmem', '.vmsd', '.vmss', '.vmx', '.vmxf']
        end

        # Internal: Updates config files for a newly cloned VM.  This will
        # update any files with the extension of '.vmx', '.vmxf', and '.vmdk'.
        # Any binary '.vmdk' files will be skipped.
        #
        # from - The VM name that was used as the source of the clone.
        # to   - The name of the newly cloned VM.
        #
        # Examples
        #
        #   @cloner.update_config 'foo', 'bar'
        #
        # Returns nothing.
        def update_config(from, to)
          ['.vmx', '.vmxf', '.vmdk'].each do |ext|
            file = File.join @target_vm.path, "#{to}#{ext}"

            unless File.binary?(file)
              text = (File.read file).gsub from, to
              File.open(file, 'w'){ |f| f.print text }
            end

            clean_up_conf_file(file) if ext == '.vmx'
          end
        end

        # Internal: Cleans up the conf file (*.vmx) for a newly cloned VM. This
        # includes removing generated MAC addresses, setting up for a new UUID,
        # and disable VMware tools warning.
        #
        # conf_file_path - Aboslute path to the VM's conf file (.vmx).
        #
        # Examples
        #
        #   @cloner.clean_up_conf_file '/vms/foo/foo.vmx'
        #
        # Returns nothing.
        def clean_up_conf_file(conf_file_path)
          conf_items_patterns = { /^tools\.remindInstall.*\n/ => "tools.remindInstall = \"FALSE\"",
            /^uuid\.action.*\n/ => "uuid.action = \"create\"",
            /^ethernet\.+generatedAddress.*\n/ => '' }

          content = File.read conf_file_path
          content << "\n"

          conf_items_patterns.each_pair do |pattern, new_item|
            unless content.include? new_item
              content.gsub(pattern, '').strip
              content << "#{new_item}\n"
            end
          end

          File.open(conf_file_path, 'w') { |f| f.print content }
        end

        # Internal: Helper for getting the configured vmrun_cmd value.
        #
        # Examples
        #
        #   @cloner.vmrun_cmd
        #   # => "/foo/bar/vmrun -T fusion"
        #
        # Returns a String for the configured value of
        # Fission.config['vmrun_cmd'].
        def vmrun_cmd
          Fission.config['vmrun_cmd']
        end

      end

    end
  end
end
