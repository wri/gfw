require 'spec_helper'

describe Inflecto do
  describe '.humanize' do
    it 'replaces _ with space: humanizes employee_salary as Employee salary' do
      Inflecto.humanize('employee_salary').should == 'Employee salary'
    end

    it 'strips _id endings: humanizes author_id as Author' do
      Inflecto.humanize('author_id').should == 'Author'
    end
  end
end

