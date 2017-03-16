require 'bundler/gem_tasks'
require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs << "test"
  t.pattern = File.join("test", "**", "test_*.rb")
end

desc 'Default Task'
task :default => [ 'test:travis' ]

namespace :test do
  mock = ENV['FOG_MOCK'] || 'true'
  task :travis do
    sh("export FOG_MOCK=#{mock} && bundle exec shindont")
  end
end

namespace :google do
  namespace :smoke do
    desc "Smoke tests for Google Compute Engine."
    task :compute do
      puts "These smoke tests assume you have a file at ~/.fog which has your credentials for connecting to GCE."

      Dir.glob("./examples/*.rb").each do |file|
        puts "Running #{file}:"
        require file
        test
      end
    end
  end
end

# From http://erniemiller.org/2014/02/05/7-lines-every-gems-rakefile-should-have/
# with some modification.
task :console do
  require 'irb'
  require 'irb/completion'
  require 'fog/google'
  Fog.credential = :test
  ARGV.clear
  IRB.start
end
