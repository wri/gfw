require 'bundler'
require 'rspec/core/rake_task'

Bundler::GemHelper.install_tasks

if defined? RSpec
  RSpec::Core::RakeTask.new(:spec)

  task :default => :spec
end
