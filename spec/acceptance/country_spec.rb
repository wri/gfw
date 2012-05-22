#encoding: UTF-8
require_relative 'acceptance_helper'

feature 'GFW country detail page' do

  background do
    VCR.use_cassette('init_app') do
      visit country_path
    end
  end

  include_examples 'common header'
  include_examples 'title', 'Central African Republic'
  include_examples 'menu', 'Countries'

  scenario 'shows a graph' do
    within '#content #country .graph' do
      page.should have_css 'img'
    end
  end

  scenario 'shows forest clearing alerts counter' do
    within '#content #country .count' do
      page.should have_css 'h1', :text => '2,931'
      page.should have_content '2,931 Forest clearing alerts in the last 15 days'
    end
  end

  #scenario 'shows a map of the country' do
    #within '#content #country .map' do
      #page.should have_css 'img'
      #page.should have_link 'explore'
    #end
  #end

  scenario 'shows a list of last alerts' do
    within '#content #country .details .alerts' do
      page.should have_content 'Last forest clearing alerts'
      page.should have_css 'ul li', :length => 5
      page.should have_css 'ul li .date', :text => '5, May, 2012'
      page.should have_css 'ul li .time', :text => '16:32 UTC'
      page.should have_link 'Subscribe to this country'
    end
  end

  scenario 'shows a description of the country' do
    within '#content #country .details .description' do
      page.should have_content %q{The Central African Republic (CAR) (French: République centrafricaine, pronounced: [ʁepyblik sɑ̃tʁafʁikɛn], or Centrafrique [sɑ̃tʀafʀik]; Sango Ködörösêse tî Bêafrîka), is a landlocked country in Central Africa. It borders Chad in the north, Su...}
      page.should have_link 'Read more at Wikipedia'
    end
  end

  scenario 'shows a list of blog stories' do
    within '#content #country .blog-links' do
      page.should have_content 'Central African Republic Blog Stories'
      page.should have_css 'ul li', :length => 3
      page.should have_css 'ul li h2', :text => 'Kony Tracked by U.S. Forces in Central Africa', :length => 2
      page.should have_css 'ul li h2', :text => 'U.N. Says Congo Rebels Killed Scores...'
      page.should have_css 'ul li p', :text => 'The Central African Republic (CAR) (French: République centrafricaine) is a landlocked country in Central Africa. Sounding like this It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Demo... more', :length => 3

      page.should have_link 'more', :length => 3
    end
  end

  include_examples 'download section'
  include_examples 'common footer'

end
