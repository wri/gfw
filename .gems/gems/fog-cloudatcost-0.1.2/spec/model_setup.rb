module ModelSetup
  def self.included(base)
    base.class_eval do
      let(:arguments) do
        {
          :api => ''
        }
      end

      # Initialize the service object to be used inside models tests
      let(:service) { Fog::Compute::CloudAtCost.new(arguments) }
    end
  end
end
