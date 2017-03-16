require 'bundler/gem_tasks'


require 'rubygems'
require 'bundler/setup'
require 'rake/testtask'

task :test do
  sh("bundle exec rspec")
end

require_relative 'lib/fog/cloudatcost'

task :default => :test
mock = ENV['FOG_MOCK'] || 'true'

namespace :test do
  task :travis do
    sh("export FOG_MOCK=#{mock} && bundle exec rspec")
  end
end
