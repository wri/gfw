require 'spec_helper'

feature 'About Page' do

  scenario 'Visit about page' do
    visit '/about'
    expect(page).to have_selector("h1", text: "About")
  end

  scenario 'after clicking how to link' do
    visit '/about'
    click_link 'How to'
    expect(page).to have_selector("h1", text: "How to")
  end

  scenario 'after clicking map link' do
    visit '/about'
    click_link 'Map'
    expect(page).to have_css("div#map")
  end

  scenario 'after clicking partners tab' do
    visit '/about'
    click_link 'Partners'
    expect(page).to have_css("article#partners.selected")
  end

end