module Factories
  def new_circuit(values = {})
    defaults = new_losail_circuit_attributes
    defaults = defaults.merge(values)
    MotoGPCircuit.new defaults
  end

  def create_random_circuits(ammount = 1)
    ammount.times do |i|
      new_circuit(:name => "circuit ##{i + 1}", :description => "awesome circuit ##{i + 1}").save
    end
  end

  alias create_random_circuit create_random_circuits

  def new_losail_circuit_attributes
    {
      :name             => 'Losail Circuit',
      :description      => 'The fabulous Losail International Circuit lies on the outskirts of Doha, the capital city of Qatar. Built in little over a year, the track cost $58 million USD and required round-the-clock dedication from almost 1,000 workers in order to get it ready for the inaugural event - the Marlboro Grand Prix of Qatar on the 2nd October 2004.',
      :the_geom         => RgeoFactory.point(51.453352, 25.488840),
      :length           => '5380m',
      :width            => '12m',
      :left_corners     => 6,
      :right_corners    => 10,
      :longest_straight => '1068m',
      :constructed      => DateTime.new(2004, 1, 1),
      :modified         => DateTime.new(2004, 1, 1)
    }
  end
end

RSpec.configure{ include Factories }
