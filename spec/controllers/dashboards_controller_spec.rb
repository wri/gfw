require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'renders_index.rb'
)
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'assigns_title.rb'
)

describe DashboardsController, type: :controller do
  describe 'GET dashboards/global' do
    subject { get :index, params: { type: 'global' } }
    # it_behaves_like 'renders index'
    it_behaves_like 'assigns title', 'Global | Dashboards'
  end
end
