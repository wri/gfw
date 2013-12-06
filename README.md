# What is Global Forest Watch?

[Global Forest Watch](http://www.wri.org/our-work/project/global-forest-watch) (GFW) is powerful, near-real-time forest monitoring system that unites satellite technology, data sharing, and human networks around the world to fight deforestation.

This repository contains the GFW web app.

![](http://i.imgur.com/oIk9IDK.jpg)

# Developing

The GFW web app rides on [Ruby on Rails](http://rubyonrails.org).

## OS X Mavericks Setup

First make sure you have [Xcode](https://developer.apple.com/xcode) and [Command Line Tools](https://developer.apple.com/downloads/index.action) installed.

Don't skip the Xcode/CLT install!

Next install [Homebrew](http://brew.sh), the OS X package manager:

```bash
$ ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go/install)"
```

We recommend managing your Ruby installation through [rbenv](https://github.com/sstephenson/rbenv). It's just an easy way to run multiple Ruby versions for different applications:

```bash
$ brew update
$ brew install rbenv ruby-build
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
$ sudo gem install bundler
$ sudo bundle install
```

If anything goes wrong during `bundle install`, try this:

```bash
$ brew install libtool --universal
$ brew link libtool
$ bundle install
```

If the `debugger` dependency causes issues here ([like this](https://gist.github.com/robinkraft/b52ce6ec9681470194d4)), and can't get it to install via `brew install debugger` or `sudo gem install debugger` ([sample error message](https://gist.github.com/robinkraft/e86d7704b89c0e65b0c2)), or the like, just comment it out in the [Gemfile](https://github.com/Vizzuality/gfw/blob/develop/Gemfile).

You may run into some other dependency issues.

###### rmagick

If `rmagick` doesn't install ([error here](https://gist.github.com/robinkraft/083b9dbc12b3f4faf206)), install `imagemagick` first.

```shell
$ brew install imagemagick
```

###### diff-lcs

If `diff-lcs` is causes `brew install` to fail for the GFW project, install it independently:

```shell
$ sudo gem install diff-lcs -v 1.2.4
```

`diff-lcs` may ask to overwrite a few executables. Say yes at your own risk, but it won't install without overwriting.

##### Once `brew install` finishes

We're almost there! Final steps are to update your `~/.bash_profile` with your AWS credentials and the API Key for CartoDB:

```bash
export S3_KEY_ID={key}
export S3_KEY_SECRET={secret}
export CARTODB_API_KEY={cdbkey}
```

Last step for real. Start the app server and access it at [http://0.0.0.0:3000](http://0.0.0.0:3000):

```bash
$ rails server
```

If the site doesn't appear immediately when you visit the address above, give it up to a minute to warm up.

# Build status

[![Build Status](https://secure.travis-ci.org/Vizzuality/gfw.png?branch=master)](http://travis-ci.org/Vizzuality/gfw)
