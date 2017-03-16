require "bundler/gem_tasks"
require "rake/testtask"

task :default => :test

mock = ENV['FOG_MOCK'] || 'true'
task :test do
  sh("export FOG_MOCK=#{mock} && bundle exec shindont")
end
