# Fission
[![Build Status](https://secure.travis-ci.org/thbishop/fission.png)](http://travis-ci.org/thbishop/fission)
[![Dependency Status](https://gemnasium.com/thbishop/fission.png)](https://gemnasium.com/thbishop/fission)

## Intro
Fission is a simple command line tool for managing VMware Fusion VMs.  Only Fusion 3.x is currently
supported.  See [Fusion Version Support](#fusion-version-support) for more info.

## Install
    gem install fission

## Usage
### Clone
    fission clone existing_vm new_vm [--start]

If you provide '--start', then the new VM will be powered on after cloning

### Delete
    fission delete my_vm [--force]

Deletes the VM.  This will delete the files from disk and remove the related metadata in Fusion.

By default, the VM will not be deleted if:

* The VM is running
* The Fusion GUI is running (as the metadata cannot be cleanly removed)

Providing '--force' will:

* Stop the VM if it's running
* Delete the VM even if the Fusion GUI is running

### Info
    fission info my_vm

Outputs information about the VM

### Snapshot Create
    fission snapshot create my_vm snapshot_name

Creates a snapshot for the VM

In order to create the snapshot:

* The VM must be running
* The snapshot name must be unique

### Snapshot Delete
    fission snapshot delete my_vm snapshot_name

Deletes a snapshot for the VM

If you have the Fusion GUI running, the VM must be running in order to delete the snapshot.

### Snapshot List
    fission snapshot list my_vm

Lists the snapshots for the VM

### Snapshot Revert
    fission snapshot revert my_vm existing_snapshot

Reverts a VM to an existing snapshot

In order to revert to the snapshot:

* The Fusion GUI cannot be running

### Start
    fission start my_vm [--headless]

Starts the VM

Providng '--headless' will start the VM without a Fusion GUI console

Note that the Fusion GUI cannot be running to start a VM with '--headless'

### Status
    fission status

Displays the status (running or not) of all of the VMs found

### Stop
    fission stop my_vm

Stops the VM

### Suspend
    fission suspend [my_vm | --all]

Suspends the VM or all running VMs

### Help
    fission -h

or just

    fission

## Configuration
By default, fission will use the default VMware Fusion VM directory
(~/Documents/Virtual Machines.localized/) when cloning.  If you want to use a
different directory, you can set this in a config file.

The config file needs to be in YAML format and live at '~/.fissionrc'

    $cat ~/.fissionrc
    ---
    vm_dir: "/vm"

## Fusion Version Support
As of now, only Fusion 3.x is supported (that's what I have available to test).
It's my understanding that some folks are currently using fission with Fusion
4.x as well.  In order to have fission work with Fusion 4.x, you will need to
tell fission where the Fusion 4.x vmrun file is.  You can do so with the
following item placed in your ~/.fissionrc (remember, YAML format):

    vmrun_bin: /Applications/VMware Fusion.app/Contents/Library/vmrun

## Other Notable Info
The name of the VM used in the previous examples should be the directory name
of the VM minus the '.vmwarevm' extension.  Typically the VM name and the
directory name are the same.

As of now, VMware Fusion doesn't provide an easy, out of
the box, way to modify the personality (hostname, ip, etc.) of a VM.  Because of
this, a clone created by fission is an _exact_ copy of the original (including
hostname, ip address, etc.).  Most likely, this isn't what you want.

One approach is to create a VM which will act as a template.  Create the VM with
the desired install method (ideally with easy install) and settings, but do not
power on the VM.  You can then create clones from this VM 'template'.  When you
power on the clone, it will start the OS install process (and assign a new ip, etc.).

## Fission with RVM
Please see the following gist for a walkthrough of making fission available
regardless of ruby environment when using RVM https://gist.github.com/1203167

## Contribute
* Fork the project
* Make your feature addition or bug fix (with tests and docs) in a topic branch
* Bonus points for not mucking with the gemspec or version
* Send a pull request and I'll get it integrated

## License
See LICENSE
