require 'bundler/gem_tasks'
require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs.push %w(spec)
  t.test_files = FileList['spec/**/*_spec.rb']
  t.verbose = true
end

desc 'Default Task'
task :default => [ :test, 'test:travis' ]

namespace :test do
  mock = ENV['FOG_MOCK'] || 'true'
  task :travis do
    sh("export FOG_MOCK=#{mock} && bundle exec shindont")
  end
end
