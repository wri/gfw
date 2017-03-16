require "bundler/gem_tasks"
require "rake/testtask"

task :default => :test

Rake::TestTask.new do |t|
  t.libs << "spec"
  t.pattern = File.join("spec", "**", "*_spec.rb")
end
