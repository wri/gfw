require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'renders_index.rb'
)
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'assigns_title.rb'
)

describe CountriesController, type: :controller do
  describe 'GET index' do
    subject {
      VCR.use_cassette('countries') { get :index }
    }
    it_behaves_like 'renders index'
    it_behaves_like 'assigns title', 'Country Profiles'
  end

  describe 'GET overview' do
    subject { get :overview }
    it 'renders overview' do
      subject
      expect(response).to render_template('overview')
    end
    it_behaves_like 'assigns title', 'Country Rankings'
  end

  #describe 'GET show' do
  #  subject { get :show, params: {id: 'POL'} }
  #  it 'renders show' do
  #    subject
  #    expect(response).to render_template('show')
  #  end
  #end
end
