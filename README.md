# What is Global Forest Watch?

[Global Forest Watch](http://www.globalforestwatch.org/) (GFW) is a
dynamic online forest monitoring and alert system that empowers people
everywhere to better manage forests. This repository contains the GFW web app.

![Global forest watch map](app/assets/images/map-page.png?raw=true "Title")

# Developing

The GFW web app rides on [Ruby on Rails](http://rubyonrails.org), [Backbone](http://backbonejs.org/) and [React](https://reactjs.org/) with [Redux](https://redux.js.org/).

## Installing the app

### Docker

Place required environment settings in the `dev.env` file, and then run:

`./gfw.sh develop`

GFW should then be accessible at [localhost:5000/map](http://localhost:5000/map), note, it may take around 2 mins to load due to large number of requests.

### Local setup (>= OS X Yosemite 10.10)

First make sure you have [Xcode](https://developer.apple.com/xcode) and
[Command Line Tools](https://developer.apple.com/downloads/index.action)
installed.

Next install [Homebrew](http://brew.sh), the OS X package manager, and imagemagick:

```bash
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew update
$ brew install imagemagick@6
```

We recommend managing your Ruby installation through
[rvm](https://github.com/rvm/rvm). It's just an easy way to
run multiple Ruby versions for different applications:

```bash
$ \curl -sSL https://get.rvm.io | bash -s stable
```

Next clone the gfw repo:

```bash
$ git clone https://github.com/Vizzuality/gfw.git
```

Using rbenv, install and set Ruby 2.4.0 in the main app directory:

```bash
$ cd gfw
$ rvm install 2.4.0
$ rvm use 2.4.0
```

Now let's install Ruby on Rails:

```bash
$ gem install rails
```

Aaaaand now use [Bundler](http://bundler.io/), a rubygem manager, to
install all the gem depenencies for the app:

```bash
$ bundle install
```

It is possible if you are using OS Sierra or greater you will experience errors when running `bundle install` and `rmagick`. There is a fix for this forcing symlinks with `imagemagick`. You need to run the following command. Details can be found on [this thread](https://stackoverflow.com/questions/9050419/cant-install-rmagick-2-13-1-cant-find-magickwand-h).

```bash
$ brew install imagemagick@6 --force && brew link imagemagick@6 --force
```

Installing front end dependencies:

```bash
$ npm install
```

Almost there! Final steps are to copy the `.env.sample` to `.env`, and start the server:

```bash
$ ./bin/server
```
The app should now be accessible on [http://0.0.0.0:5000](http://0.0.0.0:5000).


## Deployment

We follow a [Gitflow Worklow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for development and deployment. Our `master` branch goes to production, `develop` goes to `master`. We also have a staging branch which is detached from the workflow that can be used to merge multiple branches for deployment to the staging site. Additionally you can deploy `develop` or feature branches to staging if desired.

![gitflow workflow](https://www.atlassian.com/dam/jcr:b5259cce-6245-49f2-b89b-9871f9ee3fa4/03%20(2).svg)

## Releases

We are using github releases to record changes to the app. To help us manage this we are using [Zeit Releases](https://github.com/zeit/release), an npm package for handling github releases, tagging commits (major, minor, patch), and automating semantic release logs. For a more detailed explantion of semantic changelogs see [this post](https://semver.org/).

#### Managing commits for a release

When developing, you can append onto your commits `(major/minor/patch)` and this commit title will automatically be grouped into the correct section for the release. Otherwise you will be prompted during the release to assign (or ignore) each of your commits. You will have to do this for every commit so don't forget to squash!

So how do you make a release on GFW?

1. Checkout master and merge in develop (not compulsory but advised for consistency).
2. Run `npx release [type]` where type can be `major`, `minor`, `patch`, or `pre` (see [zeit docs](https://github.com/zeit/release) for more details).
3. Follow the prompts to manage commits.
4. You will be taken to github draft release editor with all your commits grouped and ready to go.
5. Enter your title and include any extra info you want. 
6. Publish!

## Layers

Map layers, somewhat unsurprisingly, are an important part of GFW. As
such, the config and code supporting them can be a bit complex. Check
out the [layer documentation](docs/layers) for more information. If the
component you're working on isn't in there, please write some
documentation when you're done! 💞

## Google Custom Search API

Global Forest Watch uses the Google Custom Search API to power it's site-wide
search.

The search requests are handled inside: `app/controllers/search_controller.rb`
And depend on two config variables that you'll need to setup as ENV vars on
your `.env` file locally or in the Heroku environment settings.

```
GOOGLE_SEARCH_API_KEY
GOOGLE_CUSTOM_SEARCH_CX
```

Currently the API being used was generated by `simao.belchior@vizzuality.com`
and the custom search context is owned by Alyssa Barrett on the Google Custom
Search Engine control panel.


## Tests

### Front-end

We have a few Javascript tests in `jstest/` which you can (read: should)
run with Grunt:

```
grunt test
```

### BrowserStack

We use [BrowserStack](https://www.browserstack.com) to find and fix cross-browser issues.

<a href="https://www.browserstack.com"><img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" height="70" /></a>


# License

The MIT License (MIT)

Copyright (c) 2015 Vizzuality

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
