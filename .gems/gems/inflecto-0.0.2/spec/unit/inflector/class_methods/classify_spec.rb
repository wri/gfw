require 'spec_helper'

describe Inflecto, '.classify' do
  it 'classifies data_mapper as DataMapper' do
    Inflecto.classify('data_mapper').should == 'DataMapper'
  end

  it 'classifies enlarged_testes as EnlargedTestis' do
    Inflecto.classify('enlarged_testes').should == 'EnlargedTestis'
  end

  it 'singularizes string first: classifies data_mappers as egg_and_hams as EggAndHam' do
    Inflecto.classify('egg_and_hams').should == 'EggAndHam'
  end
end
