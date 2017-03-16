# trollop

http://manageiq.github.io/trollop/

[![Gem Version](https://badge.fury.io/rb/trollop.svg)](http://badge.fury.io/rb/trollop)
[![Build Status](https://travis-ci.org/ManageIQ/trollop.svg)](https://travis-ci.org/ManageIQ/trollop)
[![Code Climate](https://codeclimate.com/github/ManageIQ/trollop/badges/gpa.svg)](https://codeclimate.com/github/ManageIQ/trollop)
[![Coverage Status](http://img.shields.io/coveralls/ManageIQ/trollop.svg)](https://coveralls.io/r/ManageIQ/trollop)
[![Dependency Status](https://gemnasium.com/ManageIQ/trollop.svg)](https://gemnasium.com/ManageIQ/trollop)

Documentation quickstart: See Trollop.options and then Trollop::Parser#opt.
Also see the examples at http://manageiq.github.io/trollop/.

## Description

Trollop is a commandline option parser for Ruby that just gets out of your way.
One line of code per option is all you need to write. For that, you get a nice
automatically-generated help page, robust option parsing, and sensible defaults
for everything you don't specify.

## Features

- Dirt-simple usage.
- Single file. Throw it in lib/ if you don't want to make it a Rubygem dependency.
- Sensible defaults. No tweaking necessary, much tweaking possible.
- Support for long options, short options, subcommands, and automatic type validation and
  conversion.
- Automatic help message generation, wrapped to current screen width.

## Requirements

* A burning desire to write less code.

## Install

* gem install trollop

## Synopsis

```ruby
require 'trollop'
opts = Trollop::options do
  opt :monkey, "Use monkey mode"                    # flag --monkey, default false
  opt :name, "Monkey name", :type => :string        # string --name <s>, default nil
  opt :num_limbs, "Number of limbs", :default => 4  # integer --num-limbs <i>, default to 4
end

p opts # a hash: { :monkey=>false, :name=>nil, :num_limbs=>4, :help=>false }
```

## License

Copyright &copy; 2008-2014 [William Morgan](http://masanjin.net/).

Copyright &copy; 2014 Red Hat, Inc.

Trollop is released under the [MIT License][http://www.opensource.org/licenses/MIT].
