RSpec.shared_examples 'renders index' do
  it 'renders index' do
    subject
    expect(response).to render_template('index')
  end
end
