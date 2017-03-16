require 'spec_helper'

describe Inflecto do
  describe '.underscore' do
    it 'underscores DataMapper as data_mapper' do
      Inflecto.underscore('DataMapper').should == 'data_mapper'
    end

    it 'underscores Merb as merb' do
      Inflecto.underscore('Merb').should == 'merb'
    end

    it 'underscores DataMapper::Resource as data_mapper/resource' do
      Inflecto.underscore('DataMapper::Resource').should == 'data_mapper/resource'
    end

    it 'underscores Merb::BootLoader::Rackup as merb/boot_loader/rackup' do
      Inflecto.underscore('Merb::BootLoader::Rackup').should == 'merb/boot_loader/rackup'
    end
  end
end
