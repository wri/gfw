require 'model_specs_helper'

describe 'CartoDB model scopes', :vcr => true do
  it "should return all records paginated" do
    create_random_circuits(20)

    circuits = MotoGPCircuit.all

    circuits.should have(10).circuits
    circuits.first.should be_a_kind_of(MotoGPCircuit)
    circuits.first.cartodb_id.should be == 1
    circuits.first.name.should be == 'circuit #1'
    circuits.first.description.should be == 'awesome circuit #1'
    circuits.first.the_geom.y.should be == 25.488840
    circuits.first.the_geom.x.should be == 51.453352
    circuits.first.length.should be == '5380m'
    circuits.first.width.should be == '12m'
    circuits.first.left_corners.should be == 6
    circuits.first.right_corners.should be == 10
    circuits.first.longest_straight.should be == '1068m'
    circuits.first.constructed.should be == DateTime.parse("2004-01-01").to_date
    circuits.first.modified.should be == DateTime.parse("2004-01-01").to_date
  end

  it "should count all records" do
    create_random_circuits(20)

    MotoGPCircuit.count.should be == 20

    create_random_circuit

    MotoGPCircuit.count.should be == 21
  end

  it "should find a record by its id" do
    create_random_circuits(20)

    circuit = MotoGPCircuit.where(:cartodb_id => 1)

    circuit.cartodb_id.should be == 1
    circuit.name.should be == 'circuit #1'
    circuit.description.should be == 'awesome circuit #1'
    circuit.the_geom.y.should be == 25.488840
    circuit.the_geom.x.should be == 51.453352
    circuit.length.should be == '5380m'
    circuit.width.should be == '12m'
    circuit.left_corners.should be == 6
    circuit.right_corners.should be == 10
    circuit.longest_straight.should be == '1068m'
    circuit.constructed.should be == DateTime.parse("2004-01-01").to_date
    circuit.modified.should be == DateTime.parse("2004-01-01").to_date

    same_circuit = MotoGPCircuit.find(1)

    same_circuit.cartodb_id.should be == 1
    same_circuit.name.should be == 'circuit #1'
    same_circuit.description.should be == 'awesome circuit #1'
    same_circuit.the_geom.y.should be == 25.488840
    same_circuit.the_geom.x.should be == 51.453352
    same_circuit.length.should be == '5380m'
    same_circuit.width.should be == '12m'
    same_circuit.left_corners.should be == 6
    same_circuit.right_corners.should be == 10
    same_circuit.longest_straight.should be == '1068m'
    same_circuit.constructed.should be == DateTime.parse("2004-01-01").to_date
    same_circuit.modified.should be == DateTime.parse("2004-01-01").to_date
  end

  it "should search records by certain filters" do

    new_circuit(:name => 'Losail circuit',       :left_corners => 6, :right_corners => 10).save
    new_circuit(:name => 'Jerez',                :left_corners => 5, :right_corners => 8).save
    new_circuit(:name => 'Estoril',              :left_corners => 4, :right_corners => 9).save
    new_circuit(:name => 'Lemans',               :left_corners => 4, :right_corners => 9).save
    new_circuit(:name => 'Circuit de Catalunya', :left_corners => 5, :right_corners => 8).save

    circuits = MotoGPCircuit.where(:left_corners => 4).where(:right_corners => 9)

    circuits.should have(2).circuits
    circuits.first.name.should be == 'Estoril'
    circuits.last.name.should be == 'Lemans'
    circuits.all.should have(2).circuits
    circuits.all.first.name.should be == 'Estoril'
    circuits.all.last.name.should be == 'Lemans'

    circuits = MotoGPCircuit.where("left_corners = ?", 4).where("right_corners = ?", 9)

    circuits.should have(2).circuits
    circuits.first.name.should be == 'Estoril'
    circuits.last.name.should be == 'Lemans'
    circuits.all.should have(2).circuits
    circuits.all.first.name.should be == 'Estoril'
    circuits.all.last.name.should be == 'Lemans'
  end

  it "should paginate results" do
    create_random_circuits(20)

    circuits = MotoGPCircuit.page(1)

    circuits.should have(10).circuits
    circuits.first.cartodb_id.should be == 1
    circuits.last.cartodb_id.should be == 10

    circuits = MotoGPCircuit.page(2)

    circuits.should have(10).circuits
    circuits.first.cartodb_id.should be == 11
    circuits.last.cartodb_id.should be == 20

    circuits = MotoGPCircuit.page(1).per_page(20)

    circuits.should have(20).circuits
    circuits.first.cartodb_id.should be == 1
    circuits.last.cartodb_id.should be == 20

    circuits = MotoGPCircuit.where('CARTODB_ID > 0').page(1).per_page(20)

    circuits.should have(20).circuits
    circuits.first.cartodb_id.should be == 1
    circuits.last.cartodb_id.should be == 20
  end

  it "should order results" do
    create_random_circuits(20)

    circuits = MotoGPCircuit.order('CARTODB_ID DESC')

    circuits.should have(10).circuits
    circuits.first.cartodb_id.should be == 20
    circuits.last.cartodb_id.should be == 11
  end

  it "should allow to select the specified fiels" do
    create_random_circuits(20)

    circuits = MotoGPCircuit.select('cartodb_id, name').where('cartodb_id <= 10')

    circuits.should have(10).circuits
    circuits.first.cartodb_id.should be == 1
    circuits.first.name.should be == 'circuit #1'
    circuits.first.description.should be_nil
    circuits.first.the_geom.y.should be_nil
    circuits.first.the_geom.x.should be_nil
    circuits.first.length.should be_nil
    circuits.first.width.should be_nil
    circuits.first.left_corners.should be_nil
    circuits.first.right_corners.should be_nil
    circuits.first.longest_straight.should be_nil
    circuits.first.constructed.should be_nil
    circuits.first.modified.should be_nil

    circuits = MotoGPCircuit.select(:cartodb_id, :name).where('cartodb_id <= 10')

    circuits.should have(10).circuits
    circuits.first.cartodb_id.should be == 1
    circuits.first.name.should be == 'circuit #1'
    circuits.first.description.should be_nil
    circuits.first.the_geom.y.should be_nil
    circuits.first.the_geom.x.should be_nil
    circuits.first.length.should be_nil
    circuits.first.width.should be_nil
    circuits.first.left_corners.should be_nil
    circuits.first.right_corners.should be_nil
    circuits.first.longest_straight.should be_nil
    circuits.first.constructed.should be_nil
    circuits.first.modified.should be_nil

  end

end
