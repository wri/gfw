## head

## 0.5.0 (10/04/2013)
* update CFPropertyList to 2.2

## 0.5.0.beta.1 (06/22/2013)
* add 'info' command
* add 'snapshot delete' command
* add ability to get all VM config values (related to #14)
* fix issue #16 (returning incorrect mac address)
* fix issue #18 (1.8.7 compatibility)
* fix issue #19 (duplicate config entires when cloning)
* internal cleanup of how command strings are handled (props to @patdowney)
* bump dependency on CFproperList to avoid libxml-ruby dependency (#24)

## 0.4.0 (01/17/2012)
* major internal refactoring for usage as a lib
* add fix for loading a custom vmrun_bin in ~/.fissionrc (issue #8)
* add guestos and uuid methods to VM (@ody)

## 0.3.0 (09/16/2011)
* add ability to suspend all running VMs ('--all')
* add 'delete' command
* add 'snapshot create' command
* add 'snapshot list' command
* add 'snapshot revert' command
* add '--headless' option to start
* fix issue #2

## 0.2.0 (07/13/2011)
* add 'status' command
* add 'start' command
* add 'stop' command
* add 'suspend' command
* add support for cloning single and split disk VMs

## 0.1.0 (05/17/2011)
Initial release
