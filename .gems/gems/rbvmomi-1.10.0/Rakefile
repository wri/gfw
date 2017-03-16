# Copyright (c) 2010-2017 VMware, Inc.  All Rights Reserved.
# SPDX-License-Identifier: MIT

require 'bundler/gem_tasks'
require 'rake/testtask'
require 'yard'

task(:default => :test)

Rake::TestTask.new do |t|
  t.libs << "test"
  t.test_files = FileList['test/test_*.rb']
  t.verbose = true
end

YARD::Rake::YardocTask.new
