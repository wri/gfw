#!/usr/bin/env ruby

# Copyright (c) 2013-2017 VMware, Inc.  All Rights Reserved.
# SPDX-License-Identifier: MIT

# Manually merge two versions of vmodl.db

public_vmodl_filename = ARGV[0] or abort "public vmodl filename required"
internal_vmodl_filename = ARGV[1] or abort "internal vmodl filename required"
output_vmodl_filename = ARGV[2] or abort "output vmodl filename required"

public_vmodl = File.open(public_vmodl_filename, 'r') { |io| Marshal.load io }
internal_vmodl = File.open(internal_vmodl_filename, 'r') { |io| Marshal.load io }

db = {}
tn = {}
public_vmodl.each do |k,v|
  unless k == '_typenames'
    db[k] = v
  else
    tn['_typenames'] = v
  end
end

internal_vmodl.each do |k, v|
  unless k == '_typenames'
    db[k] = v unless db[k]
  else
    tn['_typenames'] = tn['_typenames'] + v
  end
end

db['_typenames'] = tn


File.open(output_vmodl_filename, 'w') { |io| Marshal.dump db, io }
