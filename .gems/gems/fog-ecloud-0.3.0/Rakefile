require 'bundler/gem_tasks'
require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs.push %w(spec)
  t.test_files = FileList['spec/**/*_spec.rb']
  t.verbose = true
end

namespace :test do
  task :mock do
    sh("export FOG_MOCK=true && bundle exec shindont -livespec")
  end
  task :livespec do
    sh("export FOG_MOCK=false && bundle exec shindont +livespec")
  end
end

desc 'Default Task'
task :default => [ :test, 'test:mock', 'test:livespec' ]
