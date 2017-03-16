require 'bundler/gem_tasks'

mock = ENV['FOG_MOCK'] || 'true'
task :test do
  sh("export FOG_MOCK=#{mock} && bundle exec shindont")
end

task(:default => [:test])
