require_relative 'acceptance_helper'

feature 'GFW Blog' do

  background do
    VCR.use_cassette('init_app') do
      visit blog_path
    end
  end

  include_examples 'common header'
  #include_examples 'title', 'Blog Stories | All posts'
  include_examples 'menu', 'Blog'

  #scenario 'has some posts' do
    #within '#content' do

      #within 'article' do
        #page.should have_css 'h1 a', :text => 'U.N. Says Congo Rebels Killed in ambush were planning to burn the Kapisk jungle'
        #page.should have_css '.meta li', :length => 3
        #page.should have_link 'more', :text => "Read more"
      #end
    #end
  #end

  include_examples 'download section'
  include_examples 'common footer'

end
