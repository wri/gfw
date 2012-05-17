require_relative 'acceptance_helper'

feature 'GFW explore map page' do

  background do
    visit map_path
  end

  include_examples 'common header'
  include_examples 'title'
  include_examples 'menu'
  scenario 'shows a menu with filters for the map'
  context 'has a big map' do
    scenario 'with zoom controls'
    scenario 'with a sharing link'
    scenario 'with a map type selector'
  end
  include_examples 'download section'
  include_examples 'common footer'

end
