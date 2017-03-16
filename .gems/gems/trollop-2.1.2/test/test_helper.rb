$LOAD_PATH.unshift File.expand_path('../../lib', __FILE__)

unless ENV['MUTANT']
  begin
  require "coveralls"
  Coveralls.wear!
  rescue LoadError
  end
end

begin
  require "pry"
rescue LoadError
end

require 'minitest/autorun'

require 'trollop'
