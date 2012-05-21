#encoding: UTF-8
require_relative 'acceptance_helper'

feature 'GFW explore map page' do

  background do
    visit map_path
  end

  include_examples 'common header'
  include_examples 'title'
  include_examples 'menu'
  include_examples 'filters'

  context 'has a big map', :js => true do

    scenario 'properly loaded' do
      within '#map_container #map' do
        sleep 2
        page.evaluate_script('mapLoaded').should be_true
      end
    end

    scenario 'with zoom controls' do
      within '#map_container #map' do
        peich
        page.should have_css 'div', :title => 'Zoom in'
        page.should have_css 'div', :title => 'Click to zoom'
        page.should have_css 'div', :title => 'Drag to zoom'
        page.should have_css 'div', :title => 'Zoom out'
      end
    end

    scenario 'with a sharing link'

    scenario 'with a map type selector' do
      within '#map_container #map' do
        page.should have_content 'Map'
        page.should have_content 'Satellite'
        page.should have_content 'Terrain'
      end
    end

  end

  include_examples 'download section'
  include_examples 'common footer'

end
