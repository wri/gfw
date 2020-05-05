
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

### 2a. Peak Fire Season

### 2b. Period's deviation from the mean
