#encoding: UTF-8
require_relative 'acceptance_helper'

feature 'GFW explore map page' do

  background do
    visit map_path
  end

  include_examples 'common header'
  include_examples 'title'
  include_examples 'menu'

  scenario 'shows a menu with filters for the map' do
    within '#map_container .filters' do
      ['concessions', 'protected areas', 'intact forest', 'mining', 'forest cover', 'forest', 'fire', 'carbon', 'biodiversity'].each do |filter_name|
        page.should have_css 'li a', :text => filter_name
      end
    end
  end

  context 'has a big map', :js => true do

    scenario 'properly loaded' do
      within '#map_container #map' do
        page.evaluate_script('mapLoaded').should be_true
      end
    end

    scenario 'with zoom controls' do
      within '#map_container #map' do
        page.should have_css 'div', :title => 'Acerca la imagen'
        page.should have_css 'div', :title => 'Haz clic aquí para acercar o alejar la imagen'
        page.should have_css 'div', :title => 'Arrastra para acercar o alejar la imagen'
        page.should have_css 'div', :title => 'Aleja la imagen'
      end
    end

    scenario 'with a sharing link'

    scenario 'with a map type selector' do
      within '#map_container #map' do
        page.should have_content 'Mapa'
        page.should have_content 'Satélite'
        page.should have_content 'Relieve'
      end
    end

    scenario '' do
    end

  end

  include_examples 'download section'
  include_examples 'common footer'

end
