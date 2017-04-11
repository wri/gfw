import pytest
import yaml
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import logging

logging.basicConfig(level=logging.DEBUG)

def extract_element_info(s, expression):
    """s is a list of text extracted from the site., while
    expression is a string to match such as TOTAL SELECTED AREA"""
    line_of_interest = [expression in line for line in s]
    if True in line_of_interest:
        key_index = line_of_interest.index(True) + 1
        return int(s[key_index].split('ha')[0].replace(',', ''))


def gfw_analysis(test_values, tolerance=0.1, target='DEFAULT'):
    """Test GFW front-end. Test_values should be a dictionary object with keys
    that at least have 'url' (see example).
    Tolerance is the amount by which the values can be wrong
    (as a fractional percent), e.g. 0.1 = 10% error is acceptable.
    Target is a keyword (either 'DEFAULT', 'PROD', 'STAGING' or 'LOCAL') and
    modifies the passed url to run the tests on a diffrent environment if needed.
    If not, leave target as default, and the test will then run wherever the url
    relates to (rather than chaning it to local or wherever else).
    """
    log = logging.getLogger('gfw_analysis')
    assert test_values is not None, "Missing expected values to check against"
    if target == 'PROD':
        url_extension = test_values.get('url').split('/map/')[1]
        base_url = "http://globalforestwatch.org/map/"
        url = "".join([base_url, url_extension])
    elif target == 'STAGING':
        url_extension = test_values.get('url').split('/map/')[1]
        base_url = "http://staging.globalforestwatch.org/map/"
        url = "".join([base_url, url_extension])
    elif target == 'LOCAL':
        url_extension = test_values.get('url').split('/map/')[1]
        base_url = "0.0.0.0:5000/map/"
        url = "".join([base_url, test_values['url']])
    else:
        url = test_values.get('url')
    driver = webdriver.Firefox()
    driver.get(url)
    wait = WebDriverWait(driver, 10)
    site_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'analysis-stats')))
    stats = site_element.text.split('\n')
    # HERE SHOULD ONLY TRY AND EXTRACT VALUES BASED ON WHAT KEYS ARE IN THE TEST_VALUES D OBJ
    total = extract_element_info(stats, 'TOTAL SELECTED AREA')
    loss = extract_element_info(stats, "LOSS")
    gain = extract_element_info(stats, "GAIN")
    log.debug(f'Extracted: Total={total} ha, loss={loss} ha, gain={gain} ha')
    total_error =  f"Forest cover {total} was {total/test_values['total']*100}% of expected"
    loss_error = f"Forest loss {loss} was {loss/test_values['loss']*100}% of expected"
    gain_error =  f"Tree gain {gain} was {gain/test_values['total']*100}% of expected"
    assert total == pytest.approx(test_values['total'], rel=0.10), total_error
    assert loss == pytest.approx(test_values['loss'], rel=0.10), loss_error
    assert gain == pytest.approx(test_values['gain'], rel=0.10), gain_error
    #log.debug("Sucsess. Extracted values within expected range.")
    driver.close()
    driver.quit()
    return



def test_gfw_analysis():
    """This should probably become a test class with an instance for each entry
    in the yaml file, along with some custom setup and teardown,
    also look into running the browser in headless mode. For now though
    it is a minimum working example."""
    with open("./tests/test_analysis.yaml", 'r') as stream:
        try:
            d = yaml.load(stream)
        except yaml.YAMLError as exc:
            raise IOError("Unable to read YAML file")
    for key in d:
        print(f'Testing {key}')
        gfw_analysis(test_values=d[key])
