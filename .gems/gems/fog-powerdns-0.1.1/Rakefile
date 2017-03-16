require "bundler/gem_tasks"

def name
  @name ||= Dir['*.gemspec'].first.split('.').first
end

desc "Open an irb session preloaded with this library"
task :console do
  puts "#{name}"
  sh "irb -rubygems -r ./lib/fog/powerdns.rb"
end