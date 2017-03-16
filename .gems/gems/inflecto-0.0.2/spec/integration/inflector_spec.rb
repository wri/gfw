require 'spec_helper'

describe Inflecto, 'underscore' do
  specify 'allows to create snake_case from CamelCase' do
    Inflecto.underscore('CamelCase').should eql('camel_case')
  end
end
