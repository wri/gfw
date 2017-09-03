RSpec.shared_examples 'assigns title' do |title|
  it 'assigns title' do
    subject
    expect(assigns(:title)).to eq(title)
  end
end