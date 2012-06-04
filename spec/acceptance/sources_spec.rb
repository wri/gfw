require_relative 'acceptance_helper'

feature 'GFW Sources' do

  background do
    VCR.use_cassette('init_app') do
      visit sources_path
    end
  end

  include_examples 'common header'
  #include_examples 'title', 'Data sources | All countries'
  include_examples 'menu', 'Data Sources'

  #scenario 'has some posts' do
    #within '#content' do

      #within 'article' do
        #page.should have_css 'h1 a', :text => 'U.N. Says Congo Rebels Killed in ambush were planning to burn the Kapisk jungle'
        #page.should have_css '.meta li', :length => 3
        #page.should have_link 'more', :text => "Read more"
      #end
    #end
  #end

  include_examples 'download section', "Browse Forest Clearing data by country."
  include_examples 'common footer'

end
