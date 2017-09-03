require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'renders_index.rb'
)

describe StoriesController, type: :controller do
  describe 'GET index' do
    subject { get :index }
    it_behaves_like 'renders index'
  end
end
