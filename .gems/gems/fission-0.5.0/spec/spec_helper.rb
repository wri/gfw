require 'rspec'
require 'fission'
require 'fakefs/safe'

['contexts', 'helpers', 'matchers'].each do |dir|
  Dir[File.expand_path(File.join(File.dirname(__FILE__),dir,'*.rb'))].each {|f| require f}
end

include ResponseHelpers
include CommandHelpers
