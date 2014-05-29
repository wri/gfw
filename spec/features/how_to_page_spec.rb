require 'spec_helper'

feature 'How to page' do

  scenario 'Visit how to page' do
    visit '/howto'
    expect(page).to have_selector("h1", text: "How to")
  end

  scenario 'after clicking about link' do
    visit '/howto'
    find('.navbar').click_link('About')
    expect(page).to have_selector("h1", text: "About")
  end

  scenario 'after clicking data link' do
    visit '/howto'
    Capybara.current_session.driver.browser.manage.add_cookie name: true, value: true
    find('.navbar').click_link('Data')
    expect(page).to have_selector("h1", text: "Data sources")
  end

  scenario 'after clicking partners tab' do
    visit '/howto'
    click_link 'Data FAQs'
    expect(page).to have_css("article#data.selected")
  end

end