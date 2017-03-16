### Taken from https://github.com/fog/fog/blob/master/tests/helpers/succeeds_helper.rb
module Shindo
  class Tests
    def succeeds
      test('succeeds') do
        !!instance_eval(&Proc.new)
      end
    end
  end
end
