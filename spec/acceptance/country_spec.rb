require_relative 'acceptance_helper'

feature 'GFW country detail page' do

  background do
    visit country_path
  end

  include_examples 'common header'
  include_examples 'title'
  include_examples 'menu'
  scenario 'shows a graph'
  scenario 'shows forest clearing alerts counter'
  scenario 'shows a map of the country'
  scenario 'shows forest clearing alerts stats'
  scenario 'shows a description of the country'
  scenario 'shows a list of blog stories'
  include_examples 'download section'
  include_examples 'common footer'

end
