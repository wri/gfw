#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

require 'fog/core'
require 'fog/json'
require 'time'
require File.expand_path('../softlayer/version', __FILE__)
require File.expand_path('../softlayer/ext/string', __FILE__)
require File.expand_path('../softlayer/ext/hash', __FILE__) unless {}.respond_to? :deep_merge

module Fog
  module Account
    autoload :Softlayer, File.expand_path('../softlayer/account', __FILE__)
  end

  module Compute
    autoload :Softlayer, File.expand_path('../softlayer/compute', __FILE__)
  end

  module DNS
    autoload :Softlayer, File.expand_path('../softlayer/dns', __FILE__)
  end

  module Network
    autoload :Softlayer, File.expand_path('../softlayer/network', __FILE__)
  end

  module Storage
    autoload :Softlayer, File.expand_path('../softlayer/storage', __FILE__)
  end

  module Softlayer
    extend Fog::Provider

    autoload :Product, File.expand_path('../softlayer/product', __FILE__)
    autoload :Slapi, File.expand_path('../softlayer/slapi', __FILE__)

    SL_API_URL = ENV['SL_API_URL'] ? ENV['SL_API_URL'] : 'api.softlayer.com/rest/v3' unless defined? SL_API_URL
    SL_STORAGE_AUTH_URL = ENV['SL_STORAGE_AUTH_URL'] ? ENV['SL_STORAGE_AUTH_URL'] : 'objectstorage.softlayer.net/auth/v1.0' unless defined? SL_STORAGE_AUTH_URL

    service(:account, 'Account')
    service(:compute, 'Compute')
    service(:dns, 'DNS')
    service(:network, 'Network')
    service(:product, 'Product')
    service(:storage, 'Storage')

    def self.mock_account_id
      Fog.mocking? and @sl_account_id ||= Fog::Mock.random_numbers(7)
    end

    def self.mock_vm_id
      Fog::Mock.random_numbers(7)
    end

    def self.mock_global_identifier
      Fog::UUID.uuid
    end

    def self.valid_request?(required, passed)
      required.all? {|k| k = k.to_sym; passed.key?(k) and !passed[k].nil?}
    end

    # CGI.escape, but without special treatment on spaces
    def self.escape(str,extra_exclude_chars = '')
      str.gsub(/([^a-zA-Z0-9_.-#{extra_exclude_chars}]+)/) do
        '%' + $1.unpack('H2' * $1.bytesize).join('%').upcase
      end
    end

    def self.stringify_keys(obj)
      return obj.inject({}){|memo,(k,v)| memo[k.to_s] =  stringify_keys(v); memo} if obj.is_a? Hash
      return obj.inject([]){|memo,v    | memo         << stringify_keys(v); memo} if obj.is_a? Array
      obj
    end
  end
end
