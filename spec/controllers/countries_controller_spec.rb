require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'renders_index.rb'
)
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'assigns_title.rb'
)

describe CountriesController, type: :controller do
  describe 'GET index' do
    subject { get :index }
    it_behaves_like 'renders index'
    it_behaves_like 'assigns title', 'Country Profiles'

    # TODO mock response from API
  end
end
