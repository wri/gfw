require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'assigns_title.rb'
)

describe StaticController, type: :controller do
  describe 'GET terms' do
    subject { get :terms}
    it_behaves_like 'assigns title', 'Terms of Service'
  end

  describe 'GET browser_support' do
    subject { get :browser_support }
    it_behaves_like 'assigns title', "Browser Not Supported"
  end
end
