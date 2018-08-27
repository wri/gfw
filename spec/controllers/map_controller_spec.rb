require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'renders_index.rb'
)
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'assigns_title.rb'
)

describe MapController, type: :controller do
  describe 'GET index' do
    subject { get :index, params: {basemap: :grayscale, baselayer: :loss} }
    it_behaves_like 'renders index'
    it_behaves_like 'assigns title', 'Interactive Map'
    it 'redirects if invalid parameters' do
      get :index, params: {basemap: :gray, baselayer: :loss}
      expect(response).to redirect_to(map_path)
    end
  end

  describe 'GET embed' do
    subject { get :embed }
    it 'renders overview' do
      subject
      expect(response).to render_template('embed')
    end
    it_behaves_like 'assigns title', 'Interactive Map'
  end
end
