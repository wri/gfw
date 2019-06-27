require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'assigns_title.rb'
)

describe BrowserSupportController, type: :controller do
  describe 'GET index' do
    subject { get :index }
    it_behaves_like 'assigns title', "Browser Not Supported"
  end
end
