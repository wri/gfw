#encoding: UTF-8
require_relative 'acceptance_helper'

feature 'GFW explore map page' do

  background do
    visit map_path
  end

  include_examples 'common header'
  include_examples 'title'
  include_examples 'menu', 'Map'
  include_examples 'filters'

  context 'has a big map', :js => true do

    scenario 'properly loaded' do
      within '#map-container #map' do
        sleep 2
        page.evaluate_script('config.mapLoaded').should be_true
      end
    end

    scenario 'with zoom controls' do
      within '#map-container #map' do
        page.should have_css 'div', :title => 'Zoom in'
        page.should have_css 'div', :title => 'Click to zoom'
        page.should have_css 'div', :title => 'Drag to zoom'
        page.should have_css 'div', :title => 'Zoom out'
      end
    end

    scenario 'with a sharing link'

    scenario 'with a map type selector' do
      within '#map-container #map' do
        page.should have_content 'Map'
        page.should have_content 'Satellite'
        page.should have_content 'Terrain'
      end
    end

  end

  scenario 'allows to define an area and to upload it to cartodb', :js => true do

    within '#map-container' do

      click_link 'Draw Area'

      page.should have_link 'Draw Area', :visible => false

      5.times { map_click }

      within 'form' do
        fill_in 'area_email', :with => 'ferdev@vizzuality.com'

        expect do
          click_button 'Save Area'
          sleep 2
        end.to change{ Area.all.length }.by(1)
      end

    end

  end

  include_examples 'download section'
  include_examples 'common footer'

end
