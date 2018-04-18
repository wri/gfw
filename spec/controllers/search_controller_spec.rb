require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'renders_index.rb'
)
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'assigns_title.rb'
)

describe SearchController, type: :controller do
  describe 'GET index' do
    subject {
      VCR.use_cassette('search') {
        get :index, params: {query: 'Białowieża'}
      }
    }
    it_behaves_like 'renders index'
    it_behaves_like 'assigns title', 'Search'
    it 'returns results' do
      subject
      expect(assigns(:total)).to eq(5)
    end
  end
end
