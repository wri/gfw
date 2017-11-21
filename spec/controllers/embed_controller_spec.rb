require 'rails_helper'
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'renders_index.rb'
)
require Rails.root.join(
  'spec', 'controllers', 'shared_examples', 'assigns_title.rb'
)

describe EmbedController, type: :controller do
  describe 'GET countries_show' do
    context 'by country iso code' do
      subject {
        VCR.use_cassette('country-by-iso-code') {
          get :countries_show, params: {id: 'POL'}
        }
      }
      it 'renders countries_show' do
        subject
        expect(response).to render_template('countries_show')
      end
    end
    context 'by country name' do
      subject {
        VCR.use_cassette('country-by-name') {
          get :countries_show, params: {id: 'POLAND'}
        }
      }
      it 'renders countries_show' do
        subject
        expect(response).to render_template('countries_show')
      end
    end
    context 'with area' do
      subject {
        VCR.use_cassette('country-by-iso-code') {
          get :countries_show, params: {id: 'POL', area_id: 5}
        }
      }
      it 'renders countries_show' do
        subject
        expect(response).to render_template('countries_show')
      end
    end
  end
end
