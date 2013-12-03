# What is Global Forest Watch?

[Global Forest Watch](http://www.wri.org/our-work/project/global-forest-watch) (GFW) is powerful, near-real-time forest monitoring system that unites satellite technology, data sharing, and human networks around the world to fight deforestation.

This repository contains the GFW web app.

![](http://i.imgur.com/oIk9IDK.jpg)

# Developing

The GFW web app rides on [Ruby on Rails](http://rubyonrails.org).

## OS X Mavericks Setup

First make sure you have [Xcode](https://developer.apple.com/xcode) and [Command Line Tools](https://developer.apple.com/downloads/index.action) installed.

Next install [Homebrew](http://brew.sh), the OS X package manager:

```bash
$ ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
```

We recommend managing your Ruby installation through [rbenv](https://github.com/sstephenson/rbenv). It's just an easy way to run multiple Ruby versions for different applications:

```bash
$ brew update
$ brew upgrade rbenv ruby-build
```

Next clone the gfw repo:

```bash
$ git clone https://github.com/Vizzuality/gfw.git
```

Using rbenv, install and set Ruby 2.0.0-p247 in the main app directory:

```bash
$ cd gfw
$ rbenv install 2.0.0-p247
$ rbenv local 2.0.0-p247
```

Now let's install Ruby on Rails:

```bash
$ sudo gem install rails
```

Aaaaand now use [Bundler](http://bundler.io/), a rubygem manager, to install all the gem depenencies for the app:

```bash
$ bundle install
```

If anything goes wrong during `bundle install`, try this:

```bash
$ brew install libtool --universal
$ brew link libtool
$ bundle install
```

Almost there! Final steps are to update your `~/.bash_profile` with your AWS credentials and the API Key for CartoDB:

```bash
export S3_KEY_ID={key}
export S3_KEY_SECRET={secret}
export CARTODB_API_KEY={cdbkey}
```

Last step for real. Start the app server and access it at [http://0.0.0.0:3000](http://0.0.0.0:3000):

```bash
$ rails server
```

# Build status

[![Build Status](https://secure.travis-ci.org/Vizzuality/gfw.png?branch=master)](http://travis-ci.org/Vizzuality/gfw)