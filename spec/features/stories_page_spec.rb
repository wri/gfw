require 'spec_helper'

feature 'Stories page' do

  background do
    visit '/accept_terms'
    Capybara.current_session.driver.browser.manage.add_cookie name: true, value: true
  end

  scenario 'Visit Stories page' do
    visit '/stories'
    expect(page).to have_selector("h1", text: "Featured stories")
    click_link 'Next stories'
    page.current_url.should eq('http://localhost:5000/stories?page=2')
    expect(page).to have_selector("h1", text: "Featured stories")
  end

  scenario 'after clicking Submit your story link' do
    visit '/stories'
    first('section.section .inner').click_link('Submit your story')
    expect(page).to have_selector("h1", text: "Submit a story")
  end

  scenario 'Submit a new story fail on map' do
    visit '/stories/new'
    fill_in 'story_title', with: 'Berlin forest'
    fill_in 'story_location', with: 'Near Berlin'
    fill_in 'story_date', with: '01/01/2012'
    fill_in 'story_name', with: 'Lukas'
    fill_in 'story_email', with: 'lukas@myemail.com'
    click_on 'Submit story'
    expect(page).to have_text("SORRY, THERE WAS AN ERROR WHILE SUBMITTING YOUR STORY.")
  end

  scenario 'Submit a new story', upload: true, js: true do
    visit '/stories/new'
    fill_in 'story_title', with: 'Berlin forest'
    scriptmap = "document.getElementById('story_the_geom').setAttribute('type', 'text');"
    page.driver.browser.execute_script(scriptmap)
    fill_in 'story_the_geom', with: '{"type":"Point","coordinates":[13.095703125,52.908902047770276]}'
    fill_in 'story_location', with: 'Near Berlin'
    fill_in 'story_date', with: '01/01/2012'
    fill_in 'story_details', with: 'Lorem ipsum...'
    fill_in 'story_video', with: 'http://www.youtube.com/watch?v=KgyKFx4bnQg'
    scriptimage = "$('input[type=file]').show();"
    page.driver.browser.execute_script(scriptimage)
    attach_file('fileupload', "#{Rails.root}/spec/support/images/berlin.jpg")
    fill_in 'story_name', with: 'Lukas'
    fill_in 'story_email', with: 'lukas@myemail.com'
    click_on 'Submit story'
    expect(page).to have_selector("h1", text: "Berlin Forest")
    expect(page).to have_css('.carrousel li:first iframe')
    expect(page).to have_css('.carrousel li:second ')
  end

end