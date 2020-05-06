
# Documentation for widget calculations

This document outlines the various mathematical and statistical calculations that exist within GFW's various dashboard widgets.

## 1. Statistical Bands (used in _Fires, GLAD_ widgets)

The following describes calculations used to generate the standard deviation bands in the GLAD and Fires Seasonal widgets, as well as the Fires Cumulative widget.

Using $y$ years of raw, weekly aggregated data; the goal of the opertations is calculate the mean ($\bar {c}$) and standard deviation (${\pm \sigma}$) of the number of alert counts ($c_w$) that occur in each week ($w_i$) of the year versus similar weeks in previous years - thus, removing seasonal affects from the data.

### 1a. Data Preparation

During this stage and prior to doing any calculations we must first:

    i. Parse dates 
    ii. Zero-fill data

Firstly, given the start- and end-dates of the dataset we must generate a sequential array of all unique isoweek-year combinations between the two dates, starting from the first isoweek of the first year and running through each following isoweek until the final isoweek of the final year:

> e.g.$[y_0 w_1, y_0 w_2, ... y_N w_{51}, y_N w_{52}]$

>> As an aside, please see the following notes on [isoweeks](https://en.wikipedia.org/wiki/ISO_week_date), it's complex - with some years having 53 isoweeks per year!

This then should leave us with an array of $52*N$ objects (where $N$ is the number of years), with each object containing its isoweek and year values:

$y_i w_j$ =
```json
{
    year: y_i,
    isoweek: w_j
}

```

Once we have this we aggregate the number of alerts, summing over each isoweek giving an additional key, so that each object now contains the following data:

```json
{
    year: y_i,
    isoweek: w_j,
    alert__count: c_ij
}

```

For weeks with no alerts we simply fill with `alert__count = 0`. 

### 1c. Grouping Data

As the next steps require us to make calculations using data from the same week across all years, a useful operation is to first group the data by year in order to align like isoweeks.

**Table 1**

|            | $w_1$           | $w_2$           | ... | $w_{52}$        | $w_{53}$        |
|-----------:|:---------------:|:---------------:|:---:|:---------------:|:---------------:|
| $y_0$      | $c_{y_0,w_{1}}$ | $c_{y_0,w_{2}}$ | ... | $c_{y_0,w_{1}}$ |$c_{y_0,w_{1}}$  |
| $y_1$      | $c_{y_1,w_{1}}$ | $c_{y_1,w_{2}}$ | ... | $c_{y_0,w_{1}}$ | null            |
| ...        | ...             | ...             | ... |  ...            | null            |
| $y_N$      | $c_{y_N,w_{1}}$ | $c_{y_N,w_{2}}$ | ... | $c_{y_0,w_{1}}$ | null            |

This way we end up with an array of arrays:

>$$[
    [y_0 w_1, y_0 w_2 ...y_0 w_{53}],
    [y_1 w_1, y_1 w_2 ...y_1 w_{52}],
    ...
    [y_N w_1, y_N w_2 ...y_N w_{52}]
]$$

where each $y_i w_j$ element is an object like above, containing: year $y_i$, isoweek $w_j$ and alert count $c_{i,j}$. Again, note that some arrays will go to week 53, whilst most will go only to 52.

This prepares the data for the next step which involves vertical calculations (i.e. column-wise, where $w_i$ is a constant).

### 1c. Reducing Data

Now the data is prepared such that we can iterate over isoweeks (columns) and for each calculate the mean and standard deviation.

>Mean: $\bar{c}_w=\frac{1}{N'}\sum_{i=1}^{N} c_{i,w}$

where the mean count for a given week $\bar{c}_w$ is calculated over all years $y$ where week = $w$.

>Std. dev: ${\sigma}_w=\sqrt{\frac{1}{N'}\sum_{i=1}^{N} (c_{i,w} -\bar{c_w})^2}$

Above, $N'$ is the number of data values we have historically for a given week, $w$. Note that for $w_{53}$ the amount of data is greatly reduced and therefore less reliable.

This effectively reduces the array of arrays down to a single array of length 53:

> $[w_1, w_2 ...w_{53}]$

where each element represents a single isoweek ($w_j$) and contains:

```json
{
    isoweek: w_j,
    mean_counts: mean_c_j,
    std_dev_counts: std_c_j
}
```

### 1d. Temporal Smoothing

Since the data has a lot of variance we want to smooth it temporally in order to surface seasonal behaviour in the underlying data. To do this we take a running-mean over a 3 month period (12 weeks) across adjacent weeks.

This creates an issue since smoothing over data reduces the final number of datapoints by a size equal to the smoothing window (i.e. the number of weeks we apply the running-mean over). This reduces our final dataset from 53 datapoints to 41.

#### 1d.i. Yearly Wrapping

In the case of the GLAD and Fires seasonal widgets, this problem is solved using a process called _wrapping_. In order to account for the smoothing's reduction of data, we must extend our initial data array by 6 weeks in both directions.

Taking advantage of the cyclical nature of the raw data, we can append additional columns to the left and right of the grouped data table found in **Table 1** of section `1c`.

To the left of **Table 1**, we can add an additional 6 isoweek columns by taking values from the _final_ weeks of the preceding year. For example, for the row where $y=2015$, we would take the isoweeks 47 to 52 from the $y=2014$ row and append them to the left (in cases where the preceding year has 53 isoweeks, we take weeks 48 to 53 instead).

Likewise, to the right of **Table 1**, we append additional isoweeks by taking values from the _first_ weeks of the _proceding_ year e.g. for $y=2015$, we would take the isoweeks 1 to 6 from the $y=2016$. In cases where the current year has 53 isoweeks, we take weeks 1 to 5 instead, as we require less additional data.

Note that there are two exceptions: columns $w_{-6}$ to $w_{-1}$ of the first year and columns $w_{53}$ to $w_{58}$ of the last year. Here values are set to `null` as no values exists before/after the start/end of the historical data.

This results in the following table with 52+12 weeks:

**Table 2**

|       | $w_{-6}$             | ... |  $w_{-2}$           |  $w_{-1}$             | $w_1$           | $w_2$           | ... | $w_{52}$         | $w_{53}$         | ... | $w_{57}$      | $w_{58}$      |
|:-----:|:--------------------:|:---:|:--------------------:|:--------------------:|:---------------:|:---------------:|:---:|:----------------:|:----------------:|:---:|:-------------:|:-------------:|
| $y_0$ | null                 | ... | null                 | null                 | $c_{y_0,w_{1}}$ | $c_{y_0,w_{2}}$ | ... | $c_{y_0,w_{52}}$ | $c_{y_0,w_{53}}$ | ... | $c_{y_1,w_5}$ | $c_{y_1,w_6}$ |
| $y_1$ | $c_{y_0,w_{47}}$     | ... | $c_{y_0,w_{52}}$     | $c_{y_0,w_{53}}$     | $c_{y_1,w_{1}}$ | $c_{y_1,w_{2}}$ | ... | $c_{y_1,w_{52}}$ | $c_{y_2,w_{1}}$  | ... | $c_{y_2,w_5}$ | $c_{y_2,w_6}$ |
| $y_2$ | $c_{y_0,w_{47}}$     | ... | $c_{y_1,w_{51}}$     | $c_{y_1,w_{52}}$     | $c_{y_2,w_{1}}$ | $c_{y_2,w_{2}}$ | ... | $c_{y_2,w_{52}}$ | $c_{y_3,w_{1}}$  | ... | $c_{y_3,w_5}$ | $c_{y_3,w_6}$ |
| ...   | ...                  | ... | ...                  | ...                  | ...             | ...             | ... |  ...             | ...              | ... | ...           | ...           |
| $y_N$ | $c_{y_{N-1},w_{47}}$ | ... | $c_{y_{N-1},w_{51}}$ | $c_{y_{N-1},w_{52}}$ | $c_{y_N,w_{1}}$ | $c_{y_N,w_{2}}$ | ... | $c_{y_N,w_{52}}$ | null             | ... | null          | null          |

In the code, columns $w_{-6}$ to $w_{-1}$ are found in the `leftYears` variable and columns $w_{53}$ to $w_{58}$ are found in `rightYears`, respectively. From here the mean and standard deviation are calculated column-wise, as in `1c.`, this time giving us an array of length 64:

> $d = [w_{-6}, w_{-5} ...w_{58}]$

Now, starting at ${w_1}$ taking slices of length 12 centred on ${w_1}$, iterating in steps of size = 1, and calculating the average of the mean and standard deviation values in the slice. Iterating from $w=1$ to $w=52$:

> Smoothed: $\bar{v}_w=\frac{1}{12}\sum_{k=w-6}^{w+5} v_{k} \Bigr\rvert_{w=1}^{w=52}$ 

where $v_w$ is the smoothed value (mean, or std) for week $w$.

#### 1d.ii. Windowed Smoothing

In the case of the cumulative Fires widget, we cannot exploit the cyclic nature of the data, since each year's cumulative data is independant of all others. Here we must employ a windowed smoothing method (or, [Boxcar](https://en.wikipedia.org/wiki/Boxcar_function) smoothing).

Here an average is taken at every isoweek, with the slice size ($b%) changing as we iterate over the array so that the smoothing is weakest towards both ends of the array.

> start: $\bar{v}_w=\frac{1}{b}\sum_{k=0}^{w+\frac{b}{2}} v_{k} \Bigr\rvert_{w=1}^{w=6}$
 
> end: $\bar{v}_w=\frac{1}{b}\sum_{k=w-\frac{b}{2}}^{52} v_{k} \Bigr\rvert_{w=48}^{w=52}$ 

where $b$ is the slices buffer (width), increasing with each iteration until the buffer equals the full window size of 12 at $w$=6. 

Note that in the middle of the array, smoothing works as outlined in the previous section `1d.i.`.


### 1e. Displaying on the chart

#### 1e.i. Bands

Our goal is to create three sets of bands using the smoothed data, where:

> Average Band: $\bar{c}_w {-1}\sigma\leq{c_w}\leq\bar{c}_w {+1}\sigma$

> High Band: $\bar{c}_w {+2}\sigma\leq{c_w}<\bar{c}_w {+1}\sigma$

> Low Band:  $\bar{c}_w {-2}\sigma\leq{c_w}<\bar{c}_w {-1}\sigma$

for any given week, w.

However must parse the data in a way that the chart can interpret, which involves calculating the absolute value of each boundary (for any given week).

Hence, for every week of smoothed data we calculate the following boundaries:

> Mean + 1 std: $\bar{c}_w {+1}\sigma$

> Mean - 1 std: $\bar{c}_w {-1}\sigma$

> Mean + 2 std: $\bar{c}_w {+2}\sigma$

> Mean - 2 std: $\bar{c}_w {-2}\sigma$

#### 1e.ii. Centering data on current week (Fires, GLAD seasonal widgets)

Finally, since the data is ordered by week (from 1 to 52), we need to centre the array on the current date.

If the isoweek of the current week is $w_n$, then we simply slice the array on $w=w'$, giving us two arrays: ${a_1} = [{w_1},{w_2}, ...{w_n}]$ and ${a_2} = [{w_{n+1}}, ...{w_{52}}]$, and append ${a_1}$ onto ${a_2}$, so that the weeks cross over the end of the previous year.


## 2. Dynamic Sentence Maths

Some widgets have custom logic and calculations in ordder to produce human-readable statements about the chart data.

### 2a. Peak Fire Season

The Seasonal Fires widget makes a statement about the peak fire season: noting, for a given location, the peak fire season's length ($l_{peak}$) in weeks, and a rough estimate of when the peak fire season begins ($w_{peak}$)

#### 2a.i. Peak Fire Season Start Date

We define the start of the peak fires season as the first week in which the mean alert counts crosses half of the historical datas mean-high alert counts (or, the maximum value of the smoothed values calculated above).

> first week of peak fire season: $w_{peak} = w\Bigr\rvert_{\bar{c}_{w}\geq{c_{fwhm}}}$

where the full-width half-maximum counts ($c_{fwhm}$ ) is:

> $c_{fwhm} = \frac{\bar{c}_{max} - \bar{c}_{min}}2$

Using the FWHM allows us to account for locations where there are fires in every week of the year (mostly larger location such as ISO-level countries etc).

>> Note that FWHM was chosen rather arbitrarily; and we could, if we wished, define some other threshold to denote the bgining of the fire season (e.g. 30% of the peak). There is a danger that the lower the thresold, the more prone to mis-calculatioon this method becomes, since multi-modal data may cross the threshold more than once per year.

This value is $w_{peak}$ is then used to generate the human-readable estimate of the start date such as:

> "the peak fires season typically begins in _early July_"

> "the peak fires season typically begins in _mid-August_"

> "the peak fires season typically begins in _late November_"

This is achieved by first converting $w_{peak}$ into a date in `DD-MMMM` format using `moment.js` (`MMMM` giving us a human-readable month name e.g. `March`).

The day number is then used to generate the estimate:

> "early": $day\leq10$

> "mid-": $10<{day}\leq20$

> "late": $day>20$

#### 2a.ii. Peak Fire Season Start Date

The length of the fire season, in weeks, is again calculated using the FWHM of the counts ($c_{fwhm}$).

Here we simply count the number of weeks in the array with counts above the FWHM of the smoothed data i.e. the length of the array of weeks where the mean counts is greater than the FWHM:

> $l_{peak} =  len\Bigr([...w_i]\Bigr)\Bigr\rvert_{\bar{c}_{w}\geq{c_{fwhm}}}$


### 2b. A period's deviation from the mean

All statistical widgets also comment on whether a given periods number off alert counts should be considered Normal/Average, High/Low, or Unusually High/Low.

This is done by comparing the number of counts in that total to mean and standard deviation of values for the same period over all years.

In the simple case (GLAD widget), where the period is a single week - we calculate the difference with that week's mean ($\bar{c}_w$) as a ratio of that weeks standard deviation ($\sigma_w$). We will call this distance from the mean $\delta_w$, where:


> $\delta_w$ = $\frac{c_w-\bar{c}_w}{\sigma_w}$

Now, if the distance from the mean is between $\pm1$, that week's value is within a single standard deviate and can be considered a 'normal' or 'average' nnumber of alerts for that particular week.

Outside of this the number of counts can be considered statistically significantly different from the norm, and is categorised as follows:

> Unusually High: $\delta_w > {+2}\sigma_w$

> High: ${+1}\sigma_w < \delta_w \leq {+2}\sigma_w$

> Normal/Average:  ${-1}\sigma_w\leq\delta_w \leq {+1}\sigma_w$

> Low: ${-2}\sigma_w \leq \delta_w < {-1}\sigma_w$

> Unusually Low: $\delta_w < {+2}\sigma_w$

For the more complex case of extended periods of multiple weeks, we must first calculate the number of counts for that period in all years, before then calculating the periods mean and standard deviation. For any given year ($y$), the total counts {$C$} are between weeks $i$ and $n$ given by:

>$C_{w,y} = \sum_{w=i}^{n}c_w$

Then, calculating over all years were $N'$ is the total number of years:

>Mean: $\bar{C}_w=\frac{1}{N'}\sum_{i=1}^{N'} C_{w,i}$

where the mean count for a given week $\bar{c}_w$ is calculated over all years $y$ where week = $w$.

>Std. dev: $\sigma_{C_w}=\sqrt{\frac{1}{N'}\sum_{i=1}^{N'} (C_{w,i} -\bar{C_w})^2}$

Once this is done, the calculation and categorisation is the same as above.
