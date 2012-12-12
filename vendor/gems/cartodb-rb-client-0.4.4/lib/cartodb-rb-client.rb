require 'rubygems'
require 'bundler/setup'

require 'ostruct'
require 'oauth'
require 'typhoeus'
require 'mime/types'
require 'active_support/core_ext/hash/slice'
require 'active_support/time_with_zone'
require 'rgeo'
require 'rgeo/geo_json'
require 'json/ext'

require 'cartodb-rb-client/cartodb'

OpenSSL::SSL.send :remove_const, :VERIFY_PEER
OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
