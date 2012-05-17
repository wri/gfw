require_relative 'acceptance_helper'

feature 'GFW Home' do

  background do
    visit root_path
  end

  include_examples 'common header'
  include_examples 'title', 'Find where forest cleaning is happening right now'
  include_examples 'menu'
  scenario 'has a big map'
  scenario 'has a section with some big icons' do
    within '#content #icons' do

      within '.crowdsourcing' do
        page.should have_css 'h2', :text => 'Crowdsourcing'
        page.should have_content 'Do you have any comment or photo to be shared with the community? Just do it.'
        page.should have_link 'Contribute Now'
      end

      within '.analysis' do
        page.should have_css 'h2', :text => 'Analysis tool'
        page.should have_content 'Perform forest clearing analysis on the fly and get your answers in real time using our latest data'
        page.should have_link 'Contribute Now', :class => 'disabled'
      end

      within '.keep_updated' do
        page.should have_css 'h2', :text => 'Keep updated'
        page.should have_content 'Subscribe to forest clearing alerts and receive weekly updates on your selected countries'
        page.should have_link 'Subscribe to a new alert'
      end

    end
  end
  include_examples 'download section'
  include_examples 'common footer'

end
