require 'spec_helper'

feature 'Countries page' do

  background do
    visit '/accept_terms'
    Capybara.current_session.driver.browser.manage.add_cookie name: true, value: true
  end

  scenario 'Visit Countries page' do
    visit '/countries'
    expect(page).to have_selector("h1", text: "Select a country")
  end

  scenario 'after clicking Bhutan link' do
    visit '/countries'
    find('li#BTN').click_link('Bhutan')
    expect(page).to have_selector("h1", text: "Bhutan")
  end

  scenario 'after clicking forma info link' do
    visit '/country/BTN'
    expect(page).to have_selector("h1", text: "Bhutan")
    find('ul.columns .column.three.graph.forma').click_link('i')
    expect(page).to have_css("#window", visible: true)
    expect(page).to have_css("#forest_change", visible: true)
    find('#window .close').click
    expect(page).to have_css("#window", visible: false)
  end

end
