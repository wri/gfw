# Copyright (c) 2011-2017 VMware, Inc.  All Rights Reserved.
# SPDX-License-Identifier: MIT

module RbVmomi

class Fault < StandardError
  attr_reader :fault

  def initialize msg, fault
    super "#{fault.class.wsdl_name}: #{msg}"
    @fault = fault
  end

  def method_missing *a
    @fault.send(*a)
  end
end

end
