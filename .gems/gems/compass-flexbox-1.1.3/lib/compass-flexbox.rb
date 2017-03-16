require 'compass'

# This tells Compass what your Compass extension is called, and where to find
#  its files
extension_path = File.expand_path(File.join(File.dirname(__FILE__), ".."))
Compass::Frameworks.register('compass-flexbox', :path => extension_path)