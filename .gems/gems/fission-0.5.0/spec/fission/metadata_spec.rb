require 'spec_helper'

describe Fission::Metadata do
  before do
    @plist_mock = double('plist_mock')
    @plist_file_path = Fission.config['plist_file']
    @metadata = Fission::Metadata.new
  end

  describe 'load' do
    it 'should load the existing data' do
      plist = {'vm_list' => ['1', '2', '3']}
      CFPropertyList::List.should_receive(:new).
                           with(:file => @plist_file_path).
                           and_return(@plist_mock)
      @plist_mock.stub(:value).and_return(plist)
      CFPropertyList.should_receive(:native_types).with(plist).
                                                   and_return([1, 2, 3])
      @metadata.load
      @metadata.content.should == [1, 2, 3]
    end
  end

  describe 'delete_vm_restart_document' do
    before do
      vm_dir = Fission.config['vm_dir']
      @foo_vm_dir = File.join vm_dir, 'foo.vmwarevm'
      @bar_vm_dir = File.join vm_dir, 'bar.vmwarevm'
      @data = { 'PLRestartDocumentPaths' => [@foo_vm_dir, @bar_vm_dir]}
      @metadata.content = @data
    end

    it 'should remove the vm item from the list if the vm path is in the list' do
      @metadata.delete_vm_restart_document(Fission::VM.new('foo').path)
      @metadata.content.should == { 'PLRestartDocumentPaths' => [@bar_vm_dir]}
    end

    it 'should not doing anything if the vm is not in the list' do
      @metadata.delete_vm_restart_document(Fission::VM.new('baz').path)
      @metadata.content.should == @data
    end

    it 'should not do anything if the restart document list does not exist' do
      other_data = { 'OtherConfigItem' => ['foo', 'bar']}
      @metadata.content = other_data
      @metadata.delete_vm_restart_document(Fission::VM.new('foo').path)
      @metadata.content.should == other_data
    end
  end

  describe 'delete_vm_favorite_entry' do
    before do
      foo_vm_dir = File.join Fission.config['vm_dir'], 'foo.vmwarevm'

      @data = { 'VMFavoritesListDefaults2' => [{'path' => foo_vm_dir}] }
      @metadata.content = @data
    end

    it 'should remove the vm item from the list' do
      @metadata.delete_vm_favorite_entry(Fission::VM.new('foo').path)
      @metadata.content.should == { 'VMFavoritesListDefaults2' => [] }
    end

    it 'should not do anything if the vm is not in the list' do
      @metadata.delete_vm_favorite_entry(Fission::VM.new('bar').path)
      @metadata.content.should == @data
    end

    it 'should ignore VMFavoritesListDefaults2 in Fussion 5' do
      data = {}
      @metadata.content = data
      @metadata.delete_vm_favorite_entry(Fission::VM.new('bar').path)
      @metadata.content.should == data
    end

    it 'should remove the vm item from the list in Fussion 5' do
      foo_vm_dir = File.join Fission.config['vm_dir'], 'foo.vmwarevm'
      data = {"fusionInitialSessions" => [{"documentPath" => foo_vm_dir}]}

      @metadata.content = data
      @metadata.delete_vm_favorite_entry(Fission::VM.new('foo').path)
      @metadata.content.should == { 'fusionInitialSessions' => []}
    end
  end

  describe 'self.delete_vm_info' do
    before do
      @md_mock = double('metadata_mock')
      @md_mock.should_receive(:load)
      @md_mock.should_receive(:save)
      Fission::Metadata.stub(:new).and_return(@md_mock)

      @foo_vm_dir = File.join Fission.config['vm_dir'], 'foo.vmwarevm'
    end

    it 'should remove the vm from the restart document list' do
      @md_mock.should_receive(:delete_vm_restart_document).with(@foo_vm_dir)
      @md_mock.stub(:delete_vm_favorite_entry)
      Fission::Metadata.delete_vm_info(Fission::VM.new('foo').path)
    end

    it 'should remove the vm from the favorite list' do
      @md_mock.should_receive(:delete_vm_favorite_entry).with(@foo_vm_dir)
      @md_mock.stub(:delete_vm_restart_document)
      Fission::Metadata.delete_vm_info(Fission::VM.new('foo').path)
    end
  end

  describe 'save' do
    it 'should save the data' do
      CFPropertyList::List.should_receive(:new).and_return(@plist_mock)
      CFPropertyList.should_receive(:guess).with([1, 2, 3]).
                                           and_return(['1', '2', '3'])

      @plist_mock.should_receive(:value=).with(['1', '2', '3'])
      @plist_mock.should_receive(:save).
                  with(@plist_file_path, CFPropertyList::List::FORMAT_BINARY)

      @metadata.content = [1, 2, 3]
      @metadata.save
    end
  end
end
