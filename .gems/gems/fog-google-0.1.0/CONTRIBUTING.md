# Getting Involved

New contributors are always welcome, and when in doubt please ask questions! We strive to be an open and welcoming community. Please be nice to one another.

I recommend heading over to fog's [CONTRIBUTING](https://github.com/fog/fog/blob/master/CONTRIBUTING.md) and having a look around as well.  It has information and context about the state of the `fog` project as a whole.

### Coding

* Pick a task:
  * Offer feedback on open [pull requests](https://github.com/fog/fog-google/pulls).
  * Review open [issues](https://github.com/fog/fog-google/issues) for things to help on.
  * [Create an issue](https://github.com/fog/fog-google/issues/new) to start a discussion on additions or features.
* Fork the project, add your changes and tests to cover them in a topic branch.
  * [Fork](https://github.com/fog/fog-google/fork)
  * Create your feature branch (`git checkout -b my-new-feature`)
  * Commit your changes (`git commit -am 'Add some feature'`)
  * Push to the branch (`git push origin my-new-feature`)
  * Create a new pull request
* Commit your changes and rebase against `fog/fog-google` to ensure everything is up to date.
* [Submit a pull request](https://github.com/fog/fog-google/compare/)

### Non-Coding

* Offer feedback on open [issues](https://github.com/fog/fog-google/issues).
* Organize or volunteer at events.

## Contributing Code

This document is very much a work in progress.  Sorry about that.

It's worth noting that, if you're looking through the code, and you'd like to know the history of a line, you may not find it in the history of this repository, since most of the code was extracted from [fog/fog](https://github.com/fog/fog).  So, you can look at the history from commit [fog/fog#c596e](https://github.com/fog/fog/tree/c596e710952aa9c90713da3fbfb3027db0608413) backward for more information.

### Development environment

If you're going to be doing any kind of modifications, I highly recommend using [rbenv](https://github.com/sstephenson/rbenv), [ruby-build](https://github.com/sstephenson/ruby-build), (don't forget the [dependencies](https://github.com/sstephenson/ruby-build/wiki#suggested-build-environment)!) and [bundler](http://bundler.io/).

Once you've got that all installed, run

```shell
$ bundle install
```

to install the required gems.  You might have to [fight a bit](http://www.nokogiri.org/tutorials/installing_nokogiri.html) to get Nokogiri installed.

Then, you should be ready to go!  If you'd like to drop into an interactive shell, configured with your `:test` credential, use

```shell
rake console
```

### Testing

This module is tested with [Minitest](https://github.com/seattlerb/minitest).  Right now, the only tests that exist are live integration tests, found in `test/integration/`.  After completing the installation in the README, (including setting up your credentials and keys,) make sure you have a `:test` credential in `~/.fog`, something like:

```
test:
  google_project: my-project
  google_client_email: xxxxxxxxxxxxx-xxxxxxxxxxxxx@developer.gserviceaccount.com
  google_key_location: /path/to/my-project-xxxxxxxxxxxxx.p12
  google_json_key_location: /path/to/my-project-xxxxxxxxxxxxx.json
```

Note that you need both a `.p12` and a `.json` key file for all the tests to pass.

Then you can run all the live tests:

```shell
$ rake test
```

or just one:

```shell
$ rake test TEST=test/integration/compute/test_servers.rb TESTOPTS="--name=TestServers#test_bootstrap_ssh_destroy"
```

#### The transition from `shindo` to Minitest

Previously, [shindo](https://github.com/geemus/shindo) was the primary testing framework.  We've started moving away from it, and to Minitest, but some artifacts remain.

- The `test` directory contains the new Minitest tests, which currently only cover live integration testing for `compute`.
- The `tests` directory contains the old `shindo` tests, which generally pass if mocking is turned on.  No promises if mocking is off.
- Travis CI runs the mocked `shindo` tests, though hopefully in the long run it will run the unit and integration `Minitest` tests.  Currently, Google maintains its own Jenkins instance that runs the Minitest integraiton tests.

Follow [#50](https://github.com/fog/fog-google/issues/50) for the status of the transition from `shindo` to Minitest.

#### Some notes about the tests as they stand

The live integration tests for resources, (servers, disks, etc.,) have a few components:

- The `TestCollection` **mixin module** lives in `test/helpers/test_collection.rb` and contains the standard tests to run for all resources, (e.g. `test_lifecycle`).  It also calls `cleanup` on the resource's factory during teardown, to make sure that resources are getting destroyed before the next test run.
- The **factory**, (e.g. `ServersFactory`, in `test/integration/factories/servers_factory.rb`,) automates the creation of resources and/or supplies parameters for explicit creation of resources.  For example, `ServersFactory` initializes a `DisksFactory` to supply disks in order to create servers, and implements the `params` method so that tests can create servers with unique names, correct zones and machine types, and automatically-created disks.  `ServersFactory` inherits the `create` method from `CollectionFactory`, which allows tests to create servers on-demand.
- The **main test**, (e.g. `TestServers`, in `test/integration/compute/test_servers.rb`,) is the test that actually runs.  It mixes in the `TestCollection` module in order to run the tests in that module, it supplies the `setup` method in which it initializes a `ServersFactory`, and it includes any other tests specific to this collection, (e.g. `test_bootstrap_ssh_destroy`).

If you want to create another resource, you should add live integration tests; all you need to do is create a factory in `test/integration/factories/my_resource_factory.rb` and a main test in `test/integration/compute/test_my_resource.rb` that mixes in `TestCollection`.
