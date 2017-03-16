#
# Author:: Matt Eldridge (<matt.eldridge@us.ibm.com>)
# © Copyright IBM Corporation 2014.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#

module Shindo
  class Tests

    def succeeds
      test('succeeds') do
        !!instance_eval(&Proc.new)
      end
    end

  end
end
