#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Storage[:softlayer] | File model", ["softlayer"]) do
  pending unless Fog.mocking?

  tests("success") do

    @storage = Fog::Storage[:softlayer]
    @test_dir1 = @storage.directories.create(:key => 'test-container-1')
    @test_dir2 = @storage.directories.create(:key => 'test-container-2')
    @test_file1 = 'test-object-1'
    @test_file2 = 'test-object-2'
    @test_file3 = 'test-object-3'

    tests("#create") do
      data_matches_schema(Fog::Storage::Softlayer::File) { @test_dir1.files.create(:key => @test_file1) }
      data_matches_schema(Fog::Storage::Softlayer::File) { @test_dir1.files.create(:key => @test_file2) }
    end

    tests("#all") do
      schema = [
          Fog::Storage::Softlayer::File,
          Fog::Storage::Softlayer::File
      ]
      data_matches_schema(schema) { @test_dir1.files.all }
    end

    tests("#get") do
      data_matches_schema(Fog::Storage::Softlayer::File) { @test_dir1.files.get(@test_file1) }
    end

    tests("#copy") do
      data_matches_schema(Fog::Storage::Softlayer::File) { @test_dir1.files.get(@test_file1).copy(@test_dir2, @test_file1)}
      data_matches_schema(Fog::Storage::Softlayer::File) { @test_dir2.files.get(@test_file1) }
    end

    tests("#destroy") do
      data_matches_schema(true) { @test_dir1.files.get(@test_file1).destroy }
    end

  end


  tests ("failure") do

    tests("#create").raises(ArgumentError) do
      @test_dir1.files.create
    end

  end
end
