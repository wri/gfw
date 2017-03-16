#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

Shindo.tests("Fog::Storage[:softlayer] | auth_tests", ["softlayer"]) do

  tests('success') do
    pending if Fog.mocking?
  end

  tests('failure') do
    pending if Fog.mocking?
  end
end
