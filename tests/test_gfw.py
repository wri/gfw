import pytest
import os
import yaml
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import logging

logging.basicConfig(level=logging.DEBUG)

#
# Note, that an environemnt variable TEST_TARGET controlls whether the tests
# run on localhost, staging, or production (set to 'local', 'staging',
# or 'production'). If not set, it will run on staging.
#

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
    """Use the TEST_TARGET environment variable (staging, production or local flag to set target)
       or default to testing on staging and construct an analysis url"""
    log = logging.getLogger('gfw_analysis')
    environment = os.getenv("TEST_TARGET", None)
    #environment='production'
    if not environment:
       environment='staging'
    if environment.lower() == 'production':
       u = d[environment.lower()]
       u = ''.join([u, d['url_analysis']])
       u = u.replace('{start_date}', str(d['start_date']))
       u = u.replace('{end_date}', str(d['end_date']))
       if 'threshold' in d: u = u.replace('{threshold}', str(d['threshold']))
       u = u.replace('{data_id}', str(d['production_data_id']))
       return u
    elif environment.lower() == 'local':
       u = d[environment.lower()]
       u = ''.join([u, d['url_analysis']])
       u = u.replace('{start_date}', str(d['start_date']))
       u = u.replace('{end_date}', str(d['end_date']))
       if 'threshold' in d: u = u.replace('{threshold}', str(d['threshold']))
       u = u.replace('{data_id}', str(d['production_data_id']))
       return u
    elif environment.lower() == 'staging':
       u = d['staging']
       u = ''.join([u, d['url_analysis']])
       u = u.replace('{start_date}', str(d['start_date']))
       u = u.replace('{end_date}', str(d['end_date']))
       if 'threshold' in d: u = u.replace('{threshold}', str(d['threshold']))
       u = u.replace('{data_id}', str(d['staging_local_data_id']))
       return u


def check_value(expected, actual, tolerance):
    #print(expected, actual, tolerance)
    error = f"Expected {expected}, but actually found {actual}. (Tolerance of {tolerance}))"
    assert expected == pytest.approx(actual, rel=tolerance), error


def analyze_areas_data():
    """Read the dictionary data held in the YAML file into a list of
    dictionary objects, so that each can be evaluated seperatley."""
    with open("./tests/analyze_areas.yaml", 'r') as stream:
        try:
            d = yaml.load(stream)
        except yaml.YAMLError as exc:
            raise IOError("Unable to read YAML file")
    dictionary_list = []
    for key in d.keys():
        dictionary_list.append(d[key])
    return dictionary_list


def non_increasing(L):
    """Test that a given list does not increase at all as it progresses."""
    return all(x>=y for x, y in zip(L, L[1:]))


@pytest.fixture(params=analyze_areas_data())
def analyse_area(request, tolerance=0.1):
    """Test GFW front-end. Tolerance = amount by which the values can be wrong (from 0 to 1)
    """
    d = request.param
    #print(d)
    url = url_target(d)
    #print(f"Extracting values from {url.split('/map')[0]} target.")
    stats = return_analysis_content(url)
    if 'total' in d:
        total = extract_element_info(stats, 'TOTAL SELECTED AREA')
        check_value(expected=d['total'], actual=total, tolerance=tolerance)
    if 'loss' in d:
        loss = extract_element_info(stats, "LOSS")
        check_value(expected=d['loss'], actual=loss, tolerance=tolerance)
    if 'gain' in d:
        gain = extract_element_info(stats, "GAIN")
        check_value(expected=d['gain'], actual=gain, tolerance=tolerance)
    return


@pytest.fixture(params=analyze_areas_data())
def analysis_loss_over_time(request):
    """By its nature, loss should be larger the more time you consider. This test
    checks that behaviour is correct for a dataset."""
    d = request.param
    if 'loss' in d:
        losses={}
        first_year = int(str(d['start_date']).split('-')[0]) - 2000
        last_year = int(str(d['end_date']).split('-')[0]) - 2000
        start_dates = [f'{year + 2000}-01-01' for year in range(first_year, last_year + 1, 4)]
        for start in start_dates:
            d['start_date'] = start
            url = url_target(d)
            stats = return_analysis_content(url)
            losses[start] = extract_element_info(stats, "LOSS")
        loss_in_progressivley_shorter_time = list(losses.values())
        assert non_increasing(loss_in_progressivley_shorter_time), "The amount of loss changed in an impossible way; It cannot increase."


def test_analyze_areas(analyse_area):
    """Test each analysis field shows the total, loss, and gain (where available)
    that it is supposed to have."""
    return


def test_loss_over_time(analysis_loss_over_time):
    """Test for each instance in the YAML file that loss reduces as less time is
    considered in the users analysis."""
    return
