#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Storage[:softlayer] | container_tests", ["softlayer"]) do

  @storage = Fog::Storage[:softlayer]
  @container = 'example-testing'
  @object1 = 'test-object'
  @object2 = 'test-object-2'
  @object3 = 'test-object-3'
  @storage.put_container(@container)

  tests('success') do

    tests("#put_object") do
      response = @storage.put_object(@container, @object1, 'The quick brown fox jumps over the lazy dog.')
      data_matches_schema(201) { response.status }
      data_matches_schema('') { response.body }
      @storage.put_object(@container, @object2, 'The quick brown fox jumps over the lazy dog, again.')
      data_matches_schema(201) { response.status }
      data_matches_schema('') { response.body }
    end

    tests("#get_object") do
      response = @storage.get_object(@container, @object2)
      data_matches_schema(200) { response.status }
      data_matches_schema('The quick brown fox jumps over the lazy dog, again.') { response.body }
    end

    tests("#copy_object") do
      @storage.copy_object(@container, @object2, @container, @object3)
      response = @storage.get_object(@container, @object3)
      data_matches_schema(200) { response.status }
    end

    tests("#get_object_https_url") do
      url = @storage.get_object_https_url(@container, @object1, Time.now + 300)
      data_matches_schema(String) { url }
    end

    tests("#delete_object") do
      response = @storage.delete_object(@container, @object2)
      data_matches_schema(204) { response.status}
      data_matches_schema('') { response.body }
    end

  end

  tests('failure') do
    tests("#get_object('non-existent-container', 'non-existent-object')") do
      data_matches_schema(404) { @storage.get_container('non-existent-container', 'non-existent-object').status }
    end

    tests("#get_object(#{@container}, 'non-existent-object')") do
      data_matches_schema(404) { @storage.get_container('non-existent-container', 'non-existent-object').status }
    end

    tests('#delete_object') do
      response = @storage.delete_object(@container, 'foobarbangbaz')
      data_matches_schema(404) { response.status }
      data_matches_schema('<html><h1>Not Found</h1><p>The resource could not be found.</p></html>') { response.body }
    end
  end
end
