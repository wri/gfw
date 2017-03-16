require 'spec_helper'

describe Inflecto, '.tableize' do
  it 'pluralizes last word in snake_case strings: fancy_category => fancy_categories' do
    Inflecto.tableize('fancy_category').should == 'fancy_categories'
  end

  it 'underscores CamelCase strings before pluralization: enlarged_testis => enlarged_testes' do
    Inflecto.tableize('enlarged_testis').should == 'enlarged_testes'
  end

  it 'underscores CamelCase strings before pluralization: FancyCategory => fancy_categories' do
    Inflecto.tableize('FancyCategory').should == 'fancy_categories'
  end

  it 'underscores CamelCase strings before pluralization: EnlargedTestis => enlarged_testes' do
    Inflecto.tableize('EnlargedTestis').should == 'enlarged_testes'
  end

  it 'replaces :: with underscores: Fancy::Category => fancy_categories' do
    Inflecto.tableize('Fancy::Category').should == 'fancy_categories'
  end

  it 'underscores CamelCase strings before pluralization: Enlarged::Testis => enlarged_testes' do
    Inflecto.tableize('Enlarged::Testis').should == 'enlarged_testes'
  end
end
