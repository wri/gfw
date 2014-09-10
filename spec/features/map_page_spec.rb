require 'spec_helper'

feature 'Map page' do

  background do
    visit '/accept_terms'
    Capybara.current_session.driver.browser.manage.add_cookie name: true, value: true
  end

  scenario 'Visit map page' do
    visit '/map'
    expect(page).to have_css("div#map")
    expect(page).to have_css("div#filters li.filter.forest_change")
  end

  scenario 'Select date range', js: true do
    visit '/map'
    expect(page).to have_css(".filters", visible: true)
    find('.timeline.timeline_loss .trail .handle.left').click
    find('.timeline.timeline_loss .years').click_link('2003')
    scripttrailr = "$('.timeline.timeline_loss .trail .handle.right').show().click();"
    page.driver.browser.execute_script(scripttrailr)
    find('.timeline.timeline_loss .years').click_link('2009')
    page.current_url.should include('/loss/596?begin=2003&end=2009')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_change').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_596').native).perform
    click_link 'Gain'
    page.current_url.should include('/loss?begin=2003&end=2009')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_change').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_596').native).perform
    click_link 'Gain'
    page.current_url.should include('/loss/596?begin=2003&end=2009')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_change').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_595').native).perform
    click_link 'Loss'
    page.current_url.should include('/none/596')
  end

  scenario 'Clicking forest change filter links', js: true do
    visit '/map'
    expect(page).to have_css(".filters", visible: true)
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_change').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_569').native).perform
    click_link 'FORMA alerts'
    page.current_url.should include('/forma?begin=2006-01-01&end=2014-03-01')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_change').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_584').native).perform
    click_link 'Imazon SAD alerts'
    page.current_url.should include('/imazon?begin=2006-01-01&end=2014-03-01')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_change').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_588').native).perform
    click_link 'QUICC alerts'
    page.current_url.should include('/modis?date=2014-3')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_change').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_593').native).perform
    click_link 'NASA active fires'
    page.current_url.should include('/fires?date=2014-3')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_change').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_593').native).perform
    click_link 'NASA active fires'
    page.current_url.should include('/fires?date=2014-3')
  end

  scenario 'Clicking forest cover filter links', js: true do
    visit '/map'
    expect(page).to have_css(".filters", visible: true)
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_cover').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_591').native).perform
    click_link 'Tree cover extent'
    page.current_url.should include('/loss/596,591?begin=2000&end=2013')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_cover').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_558').native).perform
    click_link 'Intact forest landscapes'
    page.current_url.should include('/loss/596,591,558?begin=2000&end=2013')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_cover').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_590').native).perform
    click_link 'Tropical forest carbon stocks'
    page.current_url.should include('/loss/596,591,558,590?begin=2000&end=2013')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_cover').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_591').native).perform
    click_link 'Tree cover extent'
    page.current_url.should include('/loss/596,558,590?begin=2000&end=2013')
  end

  scenario 'Clicking forest use filter links', js: true do
    visit '/map'
    expect(page).to have_css(".filters", visible: true)
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_use').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_581').native).perform
    click_link 'Logging'
    page.current_url.should include('/loss/596,581?begin=2000&end=2013')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_use').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_573').native).perform
    find('#filter_573').click_link('Mining')
    page.current_url.should include('/loss/596,581,573?begin=2000&end=2013')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_use').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_556').native).perform
    click_link 'Oil palm'
    page.current_url.should include('/loss/596,581,573,556?begin=2000&end=2013')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.forest_use').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_582').native).perform
    click_link 'Wood fiber plantations'
    page.current_url.should include('/loss/596,581,573,556,582?begin=2000&end=2013')
  end

  scenario 'Clicking conservation filter links', js: true do
    visit '/map'
    expect(page).to have_css(".filters", visible: true)
    page.driver.browser.action.move_to(page.find('ul.filters-list li.conservation').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_574').native).perform
    find('#filter_574').click_link('Protected areas')
    page.current_url.should include('/loss/596,574?begin=2000&end=2013')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.conservation').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_592').native).perform
    find('#filter_592').click_link('Biodiversity hotspots')
    page.current_url.should include('/loss/596,574,592?begin=2000&end=2013')
  end

  scenario 'Clicking people filter links', js: true do
    visit '/map'
    expect(page).to have_css(".filters", visible: true)
    page.driver.browser.action.move_to(page.find('ul.filters-list li.people').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_599').native).perform
    click_link 'Resource Rights'
    page.current_url.should include('/loss/596,599?begin=2000&end=2013')
  end

  scenario 'Clicking stories filter links', js: true do
    visit '/map'
    expect(page).to have_css(".filters", visible: true)
    page.driver.browser.action.move_to(page.find('ul.filters-list li.stories').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_580').native).perform
    click_link 'User stories'
    page.current_url.should include('/loss/596,580?begin=2000&end=2013')
    page.driver.browser.action.move_to(page.find('ul.filters-list li.stories').native).perform
    page.driver.browser.action.move_to(page.find('li#filter_586').native).perform
    click_link 'Mongabay stories'
    page.current_url.should include('/loss/596,580,586?begin=2000&end=2013')
  end

end