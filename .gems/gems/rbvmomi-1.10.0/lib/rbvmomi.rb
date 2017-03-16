# Copyright (c) 2010-2017 VMware, Inc.  All Rights Reserved.
# SPDX-License-Identifier: MIT

module RbVmomi

# @private
# @deprecated Use +RbVmomi::VIM.connect+.
def self.connect opts
  VIM.connect opts
end

end
require 'rbvmomi/connection'
require 'rbvmomi/vim'
