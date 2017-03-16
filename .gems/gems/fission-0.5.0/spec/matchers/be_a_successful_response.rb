RSpec::Matchers.define :be_a_successful_response do
  match do |actual|
    actual.successful? == true &&
    actual.code == 0 &&
    actual.message == ''
  end
end
