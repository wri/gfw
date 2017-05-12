import pytest
import os
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import logging

logging.basicConfig(level=logging.DEBUG)


def extract_element_info(s, expression):
    """Extract information from the analysis object extracted from the site"""
    line_of_interest = [expression in line for line in s]
    if True in line_of_interest:
        key_index = line_of_interest.index(True) + 1
        return int(s[key_index].split('ha')[0].replace(',', ''))


def return_analysis_content(url):
    """Return the html Analysis box"""
    driver = webdriver.Firefox()
    driver.get(url)
    wait = WebDriverWait(driver, 10)
    site_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'analysis-stats')))
    stats = site_element.text.split('\n')
    driver.close()
    return stats


def url_target(d):
    """Use the TEST_TARGET environment variable (staging, production or local
    flag to set target) or default to testing on staging and construct an
    analysis url"""
    environment = os.getenv("TEST_TARGET", None)
    if not environment:
        environment='staging'
    if environment.lower() == 'production':
        u = d[environment.lower()]
        u = ''.join([u, d['url_analysis']])
        u = u.replace('{start_date}', d['start_date'])
        u = u.replace('{end_date}', d['end_date'])
        u = u.replace('{threshold}', d['threshold'])
        u = u.replace('{data_id}', d['production_data_id'])
        return u
    elif environment.lower() == 'local':
        u = d[environment.lower()]
        u = ''.join([u, d['url_analysis']])
        u = u.replace('{start_date}', d['start_date'])
        u = u.replace('{end_date}', d['end_date'])
        u = u.replace('{threshold}', d['threshold'])
        u = u.replace('{data_id}', d['production_data_id'])
        return u
    elif environment.lower() == 'staging':
        u = d['staging']
        u = ''.join([u, d['url_analysis']])
        u = u.replace('{start_date}', d['start_date'])
        u = u.replace('{end_date}', d['end_date'])
        u = u.replace('{threshold}', d['threshold'])
        u = u.replace('{data_id}', d['staging_local_data_id'])
        return u


def check_value(expected, actual, tolerance):
    #print(expected, actual, tolerance)
    error = f"Expected {expected}, but actually found {actual}. (Tolerance of {tolerance}))"
    assert expected == pytest.approx(actual, rel=tolerance), error


def test_analysis_conservation_area(tolerance=0.1):
    d={'staging':  "http://staging.globalforestwatch.org/map/",
       'production': "http://globalforestwatch.org/map/",
       'local': "localhost:5000/map/",
       'url_analysis': "11/42.94/-4.56/ALL/grayscale/loss,forestgain/{data_id}?tab=analysis-tab&wdpaid=555549019&begin={start_date}&end={end_date}&threshold={threshold}&dont_analyze=true&tour=default",
       'staging_local_data_id': '612',
       'production_data_id': '612',
       'start_date':'2001-01-01',
       'end_date':'2016-01-01',
       'threshold': '30',
       'total':  78212,
       'loss':  3078,
       'gain':  556,
      }
    url = url_target(d)
    #print(f"Extracting values from {url.split('/map')[0]} target.")
    stats = return_analysis_content(url)
    #print(stats)
    total = extract_element_info(stats, 'TOTAL SELECTED AREA')
    loss = extract_element_info(stats, "LOSS")
    gain = extract_element_info(stats, "GAIN")
    check_value(expected=d['total'], actual=total, tolerance=tolerance)
    check_value(expected=d['loss'], actual=loss, tolerance=tolerance)
    check_value(expected=d['gain'], actual=gain, tolerance=tolerance)
    return


def non_increasing(L):
    """Test that a given list does not increase at all as it progresses."""
    return all(x>=y for x, y in zip(L, L[1:]))


def test_analysis_loss_over_time():
    """By its nature, loss should be larger the more time you consider. This test
    checks that behaviour is correct for a dataset."""
    d={'staging':  "http://staging.globalforestwatch.org/map/",
       'production': "http://globalforestwatch.org/map/",
       'local': "localhost:5000/map/",
       'url_analysis': "11/42.94/-4.56/ALL/grayscale/loss,forestgain/{data_id}?tab=analysis-tab&wdpaid=555549019&begin={start_date}&end={end_date}&threshold={threshold}&dont_analyze=true&tour=default",
       'staging_local_data_id': '612',
       'production_data_id': '612',
       'start_date':'2001-01-01',
       'end_date':'2016-01-01',
       'threshold': '30',
       }
    losses={}
    first_year = int(d['start_date'].split('-')[0]) - 2000
    last_year = int(d['end_date'].split('-')[0]) - 2000
    start_dates = [f'{year + 2000}-01-01' for year in range(first_year, last_year + 1, 4)]
    for start in start_dates:
        d['start_date'] = start
        url = url_target(d)
        stats = return_analysis_content(url)
        losses[start] = extract_element_info(stats, "LOSS")
    loss_in_progressivley_shorter_time = list(losses.values())
    assert non_increasing(loss_in_progressivley_shorter_time), "The amount of loss changed in an impossible way; It cannot increase."
