#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

# Use so you can run in mock mode from the command line
#
# FOG_MOCK=true fog

if ENV["FOG_MOCK"] == "true"
  Fog.mock!
end

# if in mocked mode, fill in some fake credentials for us
if Fog.mock?
  Fog.credentials = {
    :softlayer_username => 'sl-username',
    :softlayer_api_key => 'abcdefghijklmnopqrstuvwxyz',
    :softlayer_default_domain => 'example.com',
    :softlayer_cluster => 'dal05'
  }.merge(Fog.credentials)
end
