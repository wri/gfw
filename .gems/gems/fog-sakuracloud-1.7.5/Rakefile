require 'bundler/setup'
require "bundler/gem_tasks"
require 'rake/testtask'
require 'date'
require 'rubygems'
require 'rubygems/package_task'
require 'yard'
require File.dirname(__FILE__) + '/lib/fog/sakuracloud'

#############################################################################
#
# Helper functions
#
#############################################################################

def name
  @name ||= Dir['*.gemspec'].first.split('.').first
end

def version
  Fog::VERSION
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
task :default => :test
task :travis  => ['test', 'test:travis']

Rake::TestTask.new do |t|
  t.pattern = File.join("spec", "**", "*_spec.rb")
end

namespace :test do
  mock = ENV['FOG_MOCK'] || 'true'
  task :travis do
      sh("export FOG_MOCK=#{mock} && bundle exec shindont")
  end
  task :vsphere do
      sh("export FOG_MOCK=#{mock} && bundle exec shindont tests/vsphere")
  end
  task :openvz do
      sh("export FOG_MOCK=#{mock} && bundle exec shindont tests/openvz")
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

task :nuke do
  Fog.providers.each do |provider|
    next if ['Vmfusion'].include?(provider)
    begin
      compute = Fog::Compute.new(:provider => provider)
      for server in compute.servers
        Fog::Formatador.display_line("[#{provider}] destroying server #{server.identity}")
        server.destroy rescue nil
      end
    rescue
    end
    begin
      dns = Fog::DNS.new(:provider => provider)
      for zone in dns.zones
        for record in zone.records
          record.destroy rescue nil
        end
        Fog::Formatador.display_line("[#{provider}] destroying zone #{zone.identity}")
        zone.destroy rescue nil
      end
    rescue
    end
  end
end
