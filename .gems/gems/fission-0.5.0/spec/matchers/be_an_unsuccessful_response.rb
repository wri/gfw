RSpec::Matchers.define :be_an_unsuccessful_response do |message|
  message ||= 'it blew up'

  match do |actual|
    actual.successful? == false &&
    actual.code == 1 &&
    actual.message == message &&
    actual.data == nil
  end
end
