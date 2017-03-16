# The next line was added to squelch a warning message in Ruby 1.9.
# It ensures we're using the gem, not the built-in Minitest
# See https://github.com/seattlerb/minitest/#install
gem 'minitest'

require 'minitest/autorun'

if ENV['COVERAGE']
  require 'coveralls'
  require 'simplecov'

  SimpleCov.start do
    add_filter '/test/'
  end
end

require File.join(File.dirname(__FILE__), '../../lib/fog/google.rb')

Coveralls.wear! if ENV['COVERAGE']
