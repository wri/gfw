## Automated Tests

An automated test suite for Global Forest Watch.

### Requirements
* Python 3.6

  To install the Python dependencies `cd` to the `gfw/tests/` folder, and execute `pip install -r requirements.txt`

* Selenium
  Selenium enables us to drive browser action, install it using Homebrew via `brew install selenium-server-standalone`.

* Firefox
* Gecko driver

  The geckodriver allows Selenium to interact with Firefox, and can be installed via Homebrew via `brew install geckodriver`.


### Run the Tests

From the `gfw` root folder execute the following:

```bash
py.test -v
```


### Adding Tests

#### Analysis tool

Test cases to check for the Analysis tool can be added simply by appending to
the `test_analysis.yaml` file. E.g. the below is all that is required to add a
new test. We have simply captured the url of an analysis case, and recorded the expected total, loss and gain which should be returned. The name given (e.g. ProtectedArea1) is arbitrary.


```yaml
ProtectedAarea1:
  url:  http://globalforestwatch.org/map/11/42.94/-4.56/ALL/grayscale/loss,forestgain/612?tab=analysis-tab&wdpaid=555549019&begin=2001-01-01&end=2016-01-01&threshold=30&dont_analyze=true&tour=default
  total:  78212
  loss:  3078
  gain:  556

```
