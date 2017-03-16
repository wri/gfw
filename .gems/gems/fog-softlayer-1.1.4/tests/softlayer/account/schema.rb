#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

class Softlayer
  module Account
    module Formats
      module Brand
        BRAND = {
          :id => Integer,
          :catalogId => Integer,
          :keyName => String,
          :longName => String,
          :name => String,
          :account => Hash
        }
      end

      module Collected
        BRAND = {
          :id => Fog::Nullable::Integer,
          :catalog_id => Fog::Nullable::Integer,
          :name => Fog::Nullable::String,
          :long_name => Fog::Nullable::String,
          :key_name => Fog::Nullable::String,
          :account => Hash
        }
      end

      module Collection
        BRANDS = [Softlayer::Account::Formats::Collected::BRAND]
      end
    end
  end
end
