#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Storage[:softlayer] | container_tests", ["softlayer"]) do

  @storage = Fog::Storage[:softlayer]
  @container = 'example-testing'


  tests('success') do
    # should be an empty array
    tests("#get_containers") do
      data_matches_schema(Array) { @storage.get_containers.body}
    end

    # should get an empty body w/ 201 status
    tests("#put_container(#{@container})") do
      response = @storage.put_container(@container)
      data_matches_schema(201) { response.status }
      data_matches_schema('') { response.body }
    end

    tests("#get_container(#{@container})") do
      response = @storage.get_container(@container)
      data_matches_schema(200) { response.status }
      data_matches_schema(Array) { response.body }
    end

    tests("#delete_container") do
      response = @storage.delete_container(@container)
      data_matches_schema(204) { response.status}
      data_matches_schema('') { response.body }
    end

  end

  tests('failure') do
    tests("#get_container('swing-and-a-miss')") do
      data_matches_schema(404) { @storage.get_container('foo-bar-baz-bang').status }
    end

    tests("#delete_container") do
      response = @storage.delete_container('sdfgsdgsdfgsdfg')
      data_matches_schema(404) { response.status }
      data_matches_schema('<html><h1>Not Found</h1><p>The resource could not be found.</p></html>') { response.body }
    end
  end
end
