require 'bundler/setup'
require "bundler/gem_tasks"
require 'rake/testtask'
require 'date'
require 'rubygems'
require 'rubygems/package_task'
require 'yard'
require 'fog/core'
require 'fog/json'

#############################################################################
#
# Helper functions
#
#############################################################################

def name
  @name ||= Dir['*.gemspec'].first.split('.').first
end

def version
  Fog::Radosgw::VERSION
end

def date
  Date.today.to_s
end

def rubyforge_project
  name
end

def gemspec_file
  "#{name}.gemspec"
end

def gem_file
  "#{name}-#{version}.gem"
end

def replace_header(head, header_name)
  head.sub!(/(\.#{header_name}\s*= ').*'/) { "#{$1}#{send(header_name)}'"}
end

#############################################################################
#
# Standard tasks
#
#############################################################################

GEM_NAME = "#{name}"
task :default => :travis
task :travis  => ['test', 'test:travis']

Rake::TestTask.new do |t|
  t.pattern = File.join("spec", "**", "*_spec.rb")
end

namespace :test do
  mock = ENV['FOG_MOCK'] || 'true'
  task :travis do
      sh("export FOG_MOCK=#{mock} && bundle exec shindont")
  end
end

desc 'Run mocked tests for a specific provider'
task :mock, :provider do |t, args|
  if args.to_a.size != 1
    fail 'USAGE: rake mock[<provider>]'
  end
  provider = args[:provider]
  sh("export FOG_MOCK=true && bundle exec shindont tests/#{provider}")
end

desc 'Run live tests against a specific provider'
task :live, :provider do |t, args|
  if args.to_a.size != 1
    fail 'USAGE: rake live[<provider>]'
  end
  provider = args[:provider]
  sh("export FOG_MOCK=false PROVIDER=#{provider} && bundle exec shindont tests/#{provider}")
end
