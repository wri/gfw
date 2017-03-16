# Fog::profitbricks

![Gem Version](https://badge.fury.io/rb/fog-profitbricks.svg) [![Build Status](https://travis-ci.org/fog/fog-profitbricks.svg?branch=master)](https://travis-ci.org/fog/fog-profitbricks) [![Dependency Status](https://gemnasium.com/fog/fog-profitbricks.svg)](https://gemnasium.com/fog/fog-profitbricks) [![Coverage Status](https://img.shields.io/coveralls/fog/fog-profitbricks.svg)](https://coveralls.io/r/fog/fog-profitbricks?branch=master) [![Code Climate](https://codeclimate.com/github/fog/fog-profitbricks/badges/gpa.svg)](https://codeclimate.com/github/fog/fog-profitbricks)

Module for the 'fog' gem to support ProfitBricks Cloud API.

## Table of Contents

* [Getting Started](#getting-started)
  * [Installation](#installation)
  * [Authentication](#authentication)
* [Operations](#operations)
  * [Data Centers](#data-centers)
    * [List Data Centers](#list-data-centers)
    * [Retrieve a Data Center](#retrieve-a-data-center)
    * [Create a Data Centers](#create-a-data-center)
    * [Update a Data Centers](#update-a-data-center)
    * [Delete a Data Centers](#delete-a-data-center)
  * [Locations](#locations)
    * [List Locations](#list-locations)
    * [Get a Location](#get-a-location)
  * [Servers](#servers)
    * [List Servers](#list-servers)
    * [Retrieve a Server](#retrieve-a-server)
    * [Create a Server](#create-a-server)
    * [Update a Server](#update-a-server)
    * [Delete a Server](#delete-a-server)
    * [List Attached Volumes](#list-attached-volumes)
    * [Attach a Volume](#attach-a-volume)
    * [Retrieve an Attached Volume](#retrieve-an-attached-volume)
    * [Detach a Volume](#detach-a-volume)
    * [List Attached CD-ROMs](#list-attached-cd-roms)
    * [Attach a CD-ROM](#attach-a-cd-rom)
    * [Retrieve an Attached CD-ROM](retrieve-an-attached-cd-rom)
    * [Detach a CD-ROM](#detach-a-cd-rom)
    * [Reboot a Server](#reboot-a-server)
    * [Start a Server](#start-a-server)
    * [Stop a Server](#stop-a-server)
  * [Volumes](#volumes)
    * [List Volumes](#list-volumes)
    * [Get a Volume](#get-a-volume)
    * [Create a Volume](#create-a-volume)
    * [Update a Volume](#update-a-volume)
    * [Delete a Volume](#delete-a-volume)
    * [Create a Volume Snapshot](#create-a-volume-snapshot)
    * [Restore a Volume Snapshot](#restore-a-volume-snapshot)
  * [Snapshots](#snapshots)
    * [List Snapshots](#list-snapshots)
    * [Get a Snapshot](#get-a-snapshot)
    * [Update a Snapshot](#update-a-snapshot)
    * [Delete a Snapshot](#delete-a-snapshot)
  * [Load Balancers](#load-balancers)
    * [List Load Balancers](#list-load-balancers)
    * [Get a Load Balancer](#get-a-load-balancer)
    * [Create a Load Balancer](#create-a-load-balancer)
    * [Update a Load Balancer](#update-a-load-balancer)
    * [List Load Balanced NICs](#list-load-balanced-nics)
    * [Get a Load Balanced NIC](#get-a-load-balanced-nic)
    * [Associate NIC to a Load Balancer](#associate-nic-to-a-load-balancer)
    * [Remove a NIC Association](#remove-a-nic-association)
  * [Firewall Rules](#firewall-rules)
    * [List Firewall Rules](#list-firewall-rules)
    * [Get a Firewall Rule](#get-a-firewall-rule)
    * [Create a Firewall Rule](#create-a-firewall-rule)
    * [Update a Firewall Rule](#update-a-firewall-rule)
    * [Delete a Firewall Rule](#delete-a-firewall-rule)
  * [Images](#images)
    * [List Images](#list-images)
    * [Get an Image](#get-an-image)
    * [Update an Image](#update-an-image)
    * [Delete an Image](#delete-an-image)
  * [Network Interfaces (NICs)](#network-interfaces-nics)
    * [List NICs](#list-nics)
    * [Get a NIC](#get-a-nic)
    * [Create a NIC](#create-a-nic)
    * [Update a NIC](#update-a-nic)
    * [Delete a NIC](#delete-a-nic)
  * [IP Blocks](#ip-blocks)
    * [List IP Blocks](#list-ip-blocks)
    * [Get an IP Block](#get-an-ip-block)
    * [Create an IP Block](#create-an-ip-block)
    * [Delete an IP Block](#delete-an-ip-block)
  * [Requests](#requests)
    * [List Requests](#list-requests)
    * [Get a Request](#get-a-request)
    * [Get a Request Status](#get-a-request-status)
  * [LANs](#lans)
    * [List LANs](#list-lans)
    * [Create a LAN](#create-a-lan)
    * [Get a LAN](#get-a-lan)
    * [Update a LAN](#update-a-lan)
    * [Delete a LAN](#delete-a-lan)
  * [Contributing](#contributing)

## Getting Started

Before you begin, you will need to have signed up for a ProfitBricks account. The credentials you create during sign-up will be used to authenticate against the API.

For more information on ProfitBricks REST API, visit the [API documentation](https://devops.profitbricks.com/api/cloud/v3/) page.

### Installation

Add this line to your application's Gemfile:

    gem 'fog-profitbricks'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install fog-profitbricks

### Authentication

Provide your credentials when creating a compute object:

```
compute = Fog::Compute.new(:provider => 'ProfitBricks', :profitbricks_username => 'username', :profitbricks_password => 'password')
```

## Operations

### Data Centers

Virtual Data Centers (VDCs) are the foundation of the ProfitBricks platform. VDCs act as logical containers for all other objects you will be creating, e.g., servers. You can provision as many data centers as you want. Data centers have their own private network and are logically segmented from each other to create isolation.

#### List Data Centers

```
compute.datacenters.all
```
---

#### Retrieve a Data Center

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |

```
compute.datacenters.get('datacenter_id')
```
---

#### Create a Data Center

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| name | string | The name of the data center. | Yes |
| location | string | The physical location where the data center will be created. This will be where all of your servers live. | Yes |
| name | string | A description for the data center, e.g. staging, production. | No|

The following table outlines the locations currently supported:

| VALUE| COUNTRY | CITY |
|---|---|---|
| us/las | United States | Las Vegas |
| de/fra | Germany | Frankfurt |
| de/fkb | Germany | Karlsruhe |

```
datacenter = compute.datacenters.create(:name => 'My data center', :location => 'us/las', :description => 'My data center description')
```

*NOTES*:
- The value for `name` cannot contain the following characters: (@, /, , |, ‘’, ‘).
- You cannot change a data center's `location` once it has been provisioned.

---

#### Update a Data Center

After retrieving a data center, either by getting it by id, or as a create response object, you can change it's properties and call the `update` method:

```
datacenter.name = 'My data center updated name'
datacenter.update
```

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
| --- | --- | --- | --- |
| name | string | The new name of the data center. | No|
| description | string | The new description of the data center. | No |

---

#### Delete a Data Center

This will remove all objects within the data center and remove the data center object itself.

**NOTE**: This is a highly destructive operation which should be used with extreme caution.

```
datacenter.delete
```

---

### Locations

Locations represent regions where you can provision your Virtual Data Centers.

#### List Locations

```
compute.locations.all
```

---

#### Get a Location

Retrieves the attributes of a given location.

The following table describes the request arguments:

| NAME | TYPE | DESCRIPTION | REQUIRED |
| --- | --- | --- | --- |
| location_id | string | The resource's unique identifier consisting of country/city. | Yes|

```
compute.locations.get('us/las')
```

---

### Servers

#### List Servers

You can retrieve a list of all servers within a data center.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |

```
compute.servers.all('datacenter_id')
```

---

#### Retrieve a Server

Returns information about a server such as its configuration, provisioning status, etc.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| server-id | string | 	The unique ID of the server. | Yes |

```
compute.servers.get('datacenter_id', 'server-id')
```

---

#### Create a Server

Creates a server within an existing data center. You can configure additional properties such as specifying a boot volume and connecting the server to an existing LAN.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| name | string | The hostname of the server. | Yes |
| cores | int | The total number of cores for the server. | Yes |
| ram | int | The amount of memory for the server in MB, e.g. 2048. Size must be specified in multiples of 256 MB with a minimum of 256 MB; however, if you set ramHotPlug to TRUE then you must use a minimum of 1024 MB. | Yes |
| availabilityZone | string |The availability zone in which the server should exist. | No |
| licenceType | string | Sets the OS type of the server. If undefined the OS type will be inherited from the boot image or boot volume. | No* |
| bootVolume | string | Reference to a Volume used for booting. If not ‘null’ then bootCdrom has to be ‘null’. | No |
| bootCdrom | string | Reference to a CD-ROM used for booting. If not 'null' then bootVolume has to be 'null'. | No |
| volumes | collection | A collection of volume IDs that you want to connect to the server. If the volume does not exist it will be created implicitly. | No |
| nics | collection | A collection of NICs you wish to create at the time the server is provisioned. | No |
| cpuFamily | string | Sets the CPU type. "AMD_OPTERON" or "INTEL_XEON". Defaults to "AMD_OPTERON". | No |

The following table outlines the various licence types you can define:

| LICENCE TYPE | COMMENT |
|---|---|
| WINDOWS | You must specify this if you are using your own, custom Windows image due to Microsoft's licensing terms. |
| LINUX ||
| UNKNOWN | If you are using an image uploaded to your account your OS Type will inherit as UNKNOWN. |

The following table outlines the availability zones currently supported:

| LICENCE TYPE | COMMENT |
|---|---|
| AUTO | Automatically Selected Zone |
| ZONE_1 | Fire Zone 1 |
| ZONE_2 | Fire Zone 2 |

```
compute.servers.create(:datacenter_id => 'datacenter_id', :name => 'My server', :cores => 2, :ram => 2048, :availability_zone => 'AUTO', :licence_type => 'LINUX')
```

**NOTE**: When creating a volume, you must specify either the `licence_type` or an `image`.

---

#### Update a Server

Perform updates to attributes of a server.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |
| name | string | The name of the server. | No |
| cores | int | The number of cores for the server. | No |
| ram | int | The amount of memory in the server. | No |
| availabilityZone | string | The new availability zone for the server. | No |
| licenceType | string | The licence type for the server. | No |
| bootVolume | string | Reference to a Volume used for booting. If not ‘null’ then bootCdrom has to be ‘null’ | No |
| bootCdrom | string | Reference to a CD-ROM used for booting. If not 'null' then bootVolume has to be 'null'. | No |

After retrieving a server, either by getting it by id, or as a create response object, you can change it's properties and call the `update` method:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.name = 'Updated server name'
server.ram = 1024
server.update
```

---

#### Delete a Server

This will remove a server from a data center. NOTE: This will not automatically remove the storage volume(s) attached to a server. A separate API call is required to perform that action.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `delete` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.delete
```

---

#### List Attached Volumes

Retrieves a list of volumes attached to the server.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| server-id | string | 	The unique ID of the server. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `get_volumes` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.get_volumes
```

---

#### Attach a Volume

This will attach a pre-existing storage volume to the server.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |
| storage-id | string | The unique ID of a storage volume. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `attach_volume` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.attach_volume('storage-id')
```

---

#### Retrieve an Attached Volume

This will retrieve the properties of an attached volume.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |
| volume-id | string | The unique ID of the attached volume. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `get_attached_volume` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.get_attached_volume('volume-id')
```

---

#### Detach a Volume

This will detach the volume from the server. Depending on the volume "hot_unplug" settings, this may result in the server being rebooted.

This will NOT delete the volume from your data center. You will need to make a separate request to delete a volume.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |
| volume-id | string | The unique ID of the attached volume. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `detach_volume` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.detach_volume('volume-id')
```

---

#### List Attached CD-ROMs

Retrieves a list of CD-ROMs attached to the server.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `get_cdroms` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.get_cdroms
```

---

#### Attach a CD-ROM

You can attach a CD-ROM to an existing server.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |
| cdrom-image-id | string | The unique ID of a CD-ROM. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `attach_cdrom` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.attach_cdrom('cdrom-image-id')
```

---

#### Retrieve an Attached CD-ROM

You can retrieve a specific CD-ROM attached to the server.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |
| cdrom-id | string | The unique ID of the attached CD-ROM. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `get_attached_cdrom` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.get_attached_cdrom('cdrom-id')
```

---

#### Detach a CD-ROM

This will detach a CD-ROM from the server.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |
| cdrom-id | string | The unique ID of the attached CD-ROM. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `detach_cdrom` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.detach_cdrom('cdrom-id')
```

---

#### Reboot a Server

This will force a hard reboot of the server. Do not use this method if you want to gracefully reboot the machine. This is the equivalent of powering off the machine and turning it back on.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `reboot` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.reboot
```

---

#### Start a Server

This will start a server. If the server's public IP was deallocated then a new IP will be assigned.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `start` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.start
```

---

#### Stop a Server

This will stop a server. The machine will be forcefully powered off, billing will cease, and the public IP, if one is allocated, will be deallocated.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |

After retrieving a server, either by getting it by id, or as a create response object, you can call the `stop` method directly on the object:

```
server = compute.servers.get('datacenter_id', 'server-id')
server.stop
```

---

### Volumes

#### List Volumes

Retrieve a list of volumes within the data center. If you want to retrieve a list of volumes attached to a server please see the [Servers](#servers) section for examples on how to do so.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |

```
compute.volumes.all('datacenter_id')
```

---

#### Get a Volume

Retrieves the attributes of a given volume.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| volume-id | string | 	The unique ID of the volume. | Yes |

```
compute.volumes.get('datacenter_id', 'volume-id')
```

---

#### Create a Volume

Creates a volume within the data center. This will NOT attach the volume to a server. Please see the [Servers](#servers) section for details on how to attach storage volumes.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| name | string | The name of the volume. | No |
| size | int | The size of the volume in GB. | Yes |
| bus | string | The bus type of the volume (VIRTIO or IDE). Default: VIRTIO. | No |
| image | string | The image or snapshot ID. | Yes* |
| type | string | The volume type, HDD or SSD. | Yes |
| licenceType | string | The licence type of the volume. Options: LINUX, WINDOWS, UNKNOWN, OTHER | Yes* |
| imagePassword | string | One-time password is set on the Image for the appropriate account. This field may only be set in creation requests. When reading, it always returns null. Password has to contain 8-50 characters. Only these characters are allowed: [abcdefghjkmnpqrstuvxABCDEFGHJKLMNPQRSTUVX23456789] | Yes* |
| sshKeys | string | SSH keys to allow access to the volume via SSH | Yes* |
| availabilityZone | string | The storage availability zone assigned to the volume. Valid values: AUTO, ZONE_1, ZONE_2, or ZONE_3. This only applies to HDD volumes. Leave blank or set to AUTO when provisioning SSD volumes. | No |

*You will need to provide either the `image` or the `licenceType` parameters. `licenceType` is required, but if `image` is supplied, it is already set and cannot be changed. Similarly either the `imagePassword` or `sshKeys` parameters need to be supplied when creating a volume. We recommend setting a valid value for `imagePassword` even when using `sshKeys` so that it is possible to authenticate using the remote console feature of the DCD.

```
volume = compute.volumes.create(:datacenter_id => 'datacenter_id', :size => 5, :type => 'HDD', :licence_type => 'LINUX')
```

---

#### Update a Volume

You can update -- in full or partially -- various attributes on the volume; however, some restrictions are in place:

You can increase the size of an existing storage volume. You cannot reduce the size of an existing storage volume. The volume size will be increased without reboot if the hot plug settings have been set to true. The additional capacity is not added to any partition therefore you will need to partition it afterwards. Once you have increased the volume size you cannot decrease the volume size.

Since an existing volume is being modified , none of the request parameters are specifically required as long as the changes being made satisfy the requirements for creating a volume.

After retrieving a volume, either by getting it by id, or as a create response object, you can change it's properties and call the `update` method:

```
volume = compute.volumes.get('datacenter_id', 'volume-id')
volume.name = 'My volume'
volume.update
```

---

#### Delete a Volume

Deletes the specified volume. This will result in the volume being removed from your data center. Use this with caution.

After retrieving a volume, either by getting it by id, or as a create response object, you can call the `delete` method directly on the object:

```
volume = compute.volumes.get('datacenter_id', 'volume-id')
volume.delete
```

---

#### Create a Volume Snapshot

Creates a snapshot of a volume within the data center. You can use a snapshot to create a new storage volume or to restore a storage volume.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| name | string | The name of the snapshot. ||
| description | string | The description of the snapshot. ||

After retrieving a volume, either by getting it by id, or as a create response object, you can call the `create_snapshot` method directly on the object:

```
volume = compute.volumes.get('datacenter_id', 'volume-id')
volume.create_snapshot('My snapshot', 'My snapshot description')
```

---

#### Restore a Volume Snapshot

This will restore a snapshot onto a volume. A snapshot is created as just another image that can be used to create new volumes or to restore an existing volume.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| snapshotId | string |  The ID of the snapshot. | Yes |

After retrieving a volume, either by getting it by id, or as a create response object, you can call the `restore_snapshot` method directly on the object:

```
volume = compute.volumes.get('datacenter_id', 'volume-id')
volume.restore_snapshot('snapshotId')
```

---

### Snapshots

#### List Snapshots

You can retrieve a list of all snapshots.

```
compute.snapshots.all
```

---

#### Get a Snapshot

Retrieves the attributes of a specific snapshot.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| snapshotId | string |  The ID of the snapshot. | Yes |

```
compute.snapshots.get('snapshotId')
```

---

#### Update a Snapshot

Perform updates to attributes of a snapshot.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| snapshotId | string |  The ID of the snapshot. | Yes |
| name | string |  The name of the snapshot. ||
| description | string | The description of the snapshot. ||
| cpuHotPlug | bool |  This volume is capable of CPU hot plug (no reboot required) ||
| cpuHotUnplug | bool |  	This volume is capable of CPU hot unplug (no reboot required) ||
| ramHotPlug | bool |  This volume is capable of memory hot plug (no reboot required) ||
| ramHotUnplug | bool |  	This volume is capable of memory hot unplug (no reboot required) ||
| nicHotPlug | bool | This volume is capable of NIC hot plug (no reboot required) ||
| nicHotUnplug | bool |  This volume is capable of NIC hot unplug (no reboot required) ||
| discVirtioHotPlug | bool |  This volume is capable of Virt-IO drive hot plug (no reboot required) ||
| discVirtioHotUnplug | bool |  This volume is capable of Virt-IO drive hot unplug (no reboot required) ||
| discScsiHotPlug | bool |  This volume is capable of SCSI drive hot plug (no reboot required) ||
| discScsiHotUnplug | bool |  This volume is capable of SCSI drive hot unplug (no reboot required) ||
| licencetype | string |  The snapshot's licence type: LINUX, WINDOWS, or UNKNOWN. ||

After retrieving a snapshot, either by getting it by id, or as a create response object, you can change it's properties and call the `update` method:

```
snapshot = compute.snapshots.get('snapshotId')
snapshot.name = 'Updated snapshot name'
snapshot.description = 'Updated snapshot description'
snapshot.nic_hot_plug = true
snapshot.nic_hot_unplug = true
snapshot.update
```

---

#### Delete a Snapshot

Deletes the specified snapshot.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| snapshotId | string |  The ID of the snapshot. | Yes |

After retrieving a snapshot, either by getting it by id, or as a create response object, you can call the `delete` method directly on the object:

```
snapshot = compute.snapshots.get('snapshotId')
snapshot.delete
```

---

### Load Balancers

#### List Load Balancers

Retrieve a list of load balancers within the data center.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |

```
compute.load_balancers.all('datacenter_id')
```

---

#### Get a Load Balancer

Retrieves the attributes of a given load balancer.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| load_balancer_id | string | The unique ID of the load balancer. | Yes |

```
compute.load_balancers.get('datacenter_id', 'load_balancer_id')
```

---

#### Create a Load Balancer

Creates a load balancer within the data center. Load balancers can be used for public or private IP traffic.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| name | string | The name of the load balancer. | Yes |
| ip | string | IPv4 address of the load balancer. All attached NICs will inherit this IP. | No |
| dhcp | bool | Indicates if the load balancer will reserve an IP using DHCP. | No |
| balancednics | string collection | List of NICs taking part in load-balancing. All balanced nics inherit the IP of the load balancer. | No |

```
compute.load_balancers.create(:datacenter_id => 'datacenter_id', :name => 'My load balancer')
```

---

#### Update a Load Balancer

Perform updates to attributes of a load balancer.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| name | string | The name of the load balancer. | No |
| ip | string | 	The IP of the load balancer. | No |
| dhcp | bool | Indicates if the load balancer will reserve an IP using DHCP. | No |

After retrieving a load balancer, either by getting it by id, or as a create response object, you can change it's properties and call the `update` method:

```
load_balancer = compute.load_balancers.get('datacenter_id', 'load_balancer_id')
load_balancer.name = 'Updated load balancer name'
load_balancer.update
```

---

#### Delete a Load Balancer

Deletes the specified load balancer.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| load_balancer_id | string | The unique ID of the load balancer. | Yes |

After retrieving a load balancer, either by getting it by id, or as a create response object, you can call the `delete` method directly on the object:

```
load_balancer = compute.load_balancers.get('datacenter_id', 'load_balancer_id')
load_balancer.delete
```

---

#### List Load Balanced NICs

This will retrieve a list of NICs associated with the load balancer.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| load_balancer_id | string | The unique ID of the load balancer. | Yes |

After retrieving a load balancer, either by getting it by id, or as a create response object, you can call the `get_nics` method directly on the object:

```
load_balancer = compute.load_balancers.get('datacenter_id', 'load_balancer_id')
load_balancer.get_nics
```

---

#### Get a Load Balanced NIC

Retrieves the attributes of a given load balanced NIC.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| load_balancer_id | string | The unique ID of the load balancer. | Yes |
| nic_id | string | The unique ID of the load balancer. | Yes |

After retrieving a load balancer, either by getting it by id, or as a create response object, you can call the `get_nic` method directly on the object:

```
load_balancer = compute.load_balancers.get('datacenter_id', 'load_balancer_id')
load_balancer.get_nic('nic_id')
```

---

#### Associate NIC to a Load Balancer

This will associate a NIC to a Load Balancer, enabling the NIC to participate in load-balancing.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| load_balancer_id | string | The unique ID of the load balancer. | Yes |
| nic_id | string | The unique ID of the load balancer. | Yes |

After retrieving a load balancer, either by getting it by id, or as a create response object, you can call the `associate_nic` method directly on the object:

```
load_balancer = compute.load_balancers.get('datacenter_id', 'load_balancer_id')
load_balancer.associate_nic('nic_id')
```

---

#### Remove a NIC Association

Removes the association of a NIC with a load balancer.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| load_balancer_id | string | The unique ID of the load balancer. | Yes |
| nic_id | string | The unique ID of the load balancer. | Yes |

After retrieving a load balancer, either by getting it by id, or as a create response object, you can call the `remove_nic_association` method directly on the object:

```
load_balancer = compute.load_balancers.get('datacenter_id', 'load_balancer_id')
load_balancer.remove_nic_association('nic_id')
```

---

### Firewall Rules

#### List Firewall Rules

Retrieves a list of firewall rules associated with a particular NIC.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server_id | string | The unique ID of the server. | Yes |
| nic_id | string | The unique ID of the NIC. | Yes |

```
compute.firewall_rules.all('datacenter_id', 'server_id', 'nic_id')
```

---

#### Get a Firewall Rule

Retrieves the attributes of a given firewall rule.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server_id | string | The unique ID of the server. | Yes |
| nic_id | string | The unique ID of the NIC. | Yes |
| firewall_rule_id | string | The unique ID of the firewall rule. | Yes |

```
fwr = compute.firewall_rules.get('datacenter_id', 'server_id', 'nic_id', 'firewall_rule_id')
```

---

#### Create a Firewall Rule

This will add a firewall rule to the NIC.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| server_id | string | The unique ID of the server. | Yes |
| nic_id | string | The unique ID of the NIC. | Yes |
| name | string | The name of the Firewall Rule. ||
| protocol | string | The protocol for the rule: TCP, UDP, ICMP, ANY. | Yes |
| sourceMac | string | Only traffic originating from the respective MAC address is allowed. Valid format: aa:bb:cc:dd:ee:ff. Value null allows all source MAC address. ||
| sourceIp | string | Only traffic originating from the respective IPv4 address is allowed. Value null allows all source IPs. ||
| targetIp | string | In case the target NIC has multiple IP addresses, only traffic directed to the respective IP address of the NIC is allowed. Value null allows all target IPs. ||
| portRangeStart | string | Defines the start range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd value null to allow all ports. ||
| portRangeEnd | string | Defines the end range of the allowed port (from 1 to 65534) if the protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd null to allow all ports. ||
| icmpType | string | Defines the allowed type (from 0 to 254) if the protocol ICMP is chosen. Value null allows all types. ||
| icmpCode | string | Defines the allowed code (from 0 to 254) if protocol ICMP is chosen. Value null allows all codes. ||

```
fwr = compute.firewall_rules.create(:datacenter_id => 'datacenter_id', :server_id => 'server-id', :nic_id => 'nic_id', :name => 'My firewall rule', :protocol => 'ANY')
```

---

#### Update a Firewall Rule

Perform updates to attributes of a firewall rule.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| server_id | string | The unique ID of the server. | Yes |
| nic_id | string | The unique ID of the NIC. | Yes |
| firewall_rule_id | string | The unique ID of the firewall rule. | Yes |
| name | string | The name of the Firewall Rule. ||
| sourceMac | string | Only traffic originating from the respective MAC address is allowed. Valid format: aa:bb:cc:dd:ee:ff. Value null allows all source MAC address. ||
| sourceIp | string | Only traffic originating from the respective IPv4 address is allowed. Value null allows all source IPs. ||
| targetIp | string | In case the target NIC has multiple IP addresses, only traffic directed to the respective IP address of the NIC is allowed. Value null allows all target IPs. ||
| portRangeStart | string |	Defines the start range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd value null to allow all ports. ||
| portRangeEnd | string | Defines the end range of the allowed port (from 1 to 65534) if the protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd null to allow all ports. ||
| icmpType | string | Defines the allowed type (from 0 to 254) if the protocol ICMP is chosen. Value null allows all types. ||
| icmpCode | string | Defines the allowed code (from 0 to 254) if protocol ICMP is chosen. Value null allows all codes. ||

After retrieving a firewall rule, either by getting it by id, or as a create response object, you can change its properties and call the `update` method:

```
fwr = compute.firewall_rules.get('datacenter_id', 'server_id', 'nic_id', 'firewall_rule_id')
fwr.name = 'Updated firewall rule name'
fwr.update
```

---

#### Delete a Firewall Rule

Removes the specific firewall rule.

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server_id | string | The unique ID of the server. | Yes |
| nic_id | string | The unique ID of the NIC. | Yes |
| firewall_rule_id | string | The unique ID of the firewall rule. | Yes |

After retrieving a firewall rule, either by getting it by id, or as a create response object, you can call the `delete` method directly on the object:

```
fwr = compute.firewall_rules.get('datacenter_id', 'server_id', 'nic_id', 'firewall_rule_id')
fwr.delete
```

---

### Images

#### List Images

Retrieve a list of images.

```
compute.images.all
```

---

#### Get an Image

Retrieves the attributes of a specific image.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| image-id | string | The unique ID of the image. | Yes |

```
compute.images.get('image-id')
```

---

#### Update an Image

Perform updates to attributes of an image.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| image-id | string | The unique ID of the image. | Yes |
| name | string |  The name of the image. ||
| description | string | The description of the image. ||
| licencetype | string |  The image's licence type: LINUX, WINDOWS, or UNKNOWN. ||
| cpuHotPlug | bool |  This volume is capable of CPU hot plug (no reboot required) ||
| cpuHotUnplug | bool |	This volume is capable of CPU hot unplug (no reboot required) ||
| ramHotPlug | bool |  This volume is capable of memory hot plug (no reboot required) ||
| ramHotUnplug | bool |	This volume is capable of memory hot unplug (no reboot required) ||
| nicHotPlug | bool | This volume is capable of NIC hot plug (no reboot required) ||
| nicHotUnplug | bool | This volume is capable of NIC hot unplug (no reboot required) ||
| discVirtioHotPlug | bool | This volume is capable of Virt-IO drive hot plug (no reboot required) ||
| discVirtioHotUnplug | bool | This volume is capable of Virt-IO drive hot unplug (no reboot required) ||
| discScsiHotPlug | bool | This volume is capable of SCSI drive hot plug (no reboot required) ||
| discScsiHotUnplug | bool | This volume is capable of SCSI drive hot unplug (no reboot required) ||

After retrieving an image, either by getting it by id, or as a create response object, you can change it's properties and call the `update` method:

```
image = compute.snapshots.get('snapshotId')
image.name = 'Updated snapshot name'
image.description = 'Updated snapshot description'
image.ram_hot_plug = true
image.ram_hot_unplug = true
image.update
```

---

#### Delete an Image

Deletes the specified image.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| image-id | string | The unique ID of the image. | Yes |

After retrieving an image, either by getting it by id, or as a create response object, you can call the `delete` method directly on the object:

```
image = compute.images.get('image-id')
image.delete
```

---

### Network Interfaces (NICs)

#### List NICs

Retrieve a list of LANs within the data center.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |

```
compute.nics.all('datacenter_id')
```

---

#### Get a NIC

Retrieves the attributes of a given NIC.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server-id | string | The unique ID of the server. | Yes |
| nic-id | string | The unique ID of the NIC. | Yes |

```
compute.nics.get('datacenter_id', 'server-id', 'nic-id')
```

---

#### Create a NIC

Adds a NIC to the target server.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server_id | string| The unique ID of the server. | Yes |
| name | string | The name of the NIC. ||
| ips | string collection | IPs assigned to the NIC. This can be a collection. ||
| dhcp | bool | Set to FALSE if you wish to disable DHCP on the NIC. Default: TRUE. ||
| lan | int | The LAN ID the NIC will sit on. If the LAN ID does not exist it will be created. | Yes |
| nat | bool | Indicates the private IP address has outbound access to the public internet. ||
| firewallActive | bool | Once you add a firewall rule this will reflect a true value. ||
| firewallrules | string collection | A list of firewall rules associated to the NIC represented as a collection. ||

```
compute.nics.create(:datacenter_id => 'datacenter_id', :server_id => 'server_id', :name = 'Internal NIC', :dhcp => true, :lan => 1)
```

---

#### Update a NIC

You can update -- in full or partially -- various attributes on the NIC; however, some restrictions are in place:

The primary address of a NIC connected to a load balancer can only be changed by changing the IP of the load balancer. You can also add additional reserved, public IPs to the NIC.

The user can specify and assign private IPs manually. Valid IP addresses for private networks are 10.0.0.0/8, 172.16.0.0/12 or 192.168.0.0/16.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server_id | string| The unique ID of the server. | Yes |
| nic-id | string| The unique ID of the NIC. | Yes |
| name | string | The name of the NIC. ||
| ips | string collection | IPs assigned to the NIC represented as a collection. ||
| dhcp | bool | Boolean value that indicates if the NIC is using DHCP or not. ||
| lan | int | The LAN ID the NIC sits on. ||
| nat | bool | Indicates the private IP address has outbound access to the public internet. ||

After retrieving a NIC, either by getting it by id, or as a create response object, you can call the `update` method directly on the object:

```
nic = compute.nics.get('datacenter_id', 'server-id', 'nic-id')
nic.name = 'Internal NIC updated'
nic.ips = ['10.0.0.7']
nic.update
```

---

#### Delete a NIC

Deletes the specified NIC.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| server_id | string| The unique ID of the server. | Yes |
| nic-id | string| The unique ID of the NIC. | Yes |

After retrieving a NIC, either by getting it by id, or as a create response object, you can call the `delete` method directly on the object:

```
nic = compute.nics.get('datacenter_id', 'server-id', 'nic-id')
nic.delete
```

---

### IP Blocks

#### List IP Blocks

Retrieve a list of IP Blocks.

```
compute.ip_blocks.all
```

---

#### Get an IP Block

Retrieves the attributes of a specific IP Block.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| ipblock-id | string | The unique ID of the IP block. | Yes |

```
compute.ip_blocks.get('ipblock-id')
```

---

#### Create an IP Block

Creates an IP block.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| location | string | 	This must be one of the locations: us/las, de/fra, de/fkb. | Yes |
| size | int | The size of the IP block you want. | Yes |
| name | string | A descriptive name for the IP block | No |

```
compute.ip_blocks.create(:location => 'de/fkb', :size => 1, :name => 'Fog test IP block')
```

---

#### Delete an IP Block

Deletes the specified IP Block.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| ipblock-id | string | The unique ID of the IP block. | Yes |

After retrieving an IP block, either by getting it by id, or as a create response object, you can call the `delete` method directly on the object:

```
ipb = compute.ip_blocks.get('ipblock-id')
ipb.delete
```

```
compute.ip_blocks.get('ipblock-id')
```

---

### Requests

#### List Requests

Retrieve a list of requests.

```
compute.requests.all
```

---

#### Get a Request

Retrieves the attributes of a specific request.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| request-id | string | The unique ID of the request. | Yes |

```
compute.requests.get('request-id')
```

---

#### Get a Request Status

Retrieves the status of a request.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| request-id | string | The unique ID of the request. | Yes |

```
compute.requests.get_status('request-id')
```

---

### LANs

#### List LANs

Retrieve a list of LANs within the data center.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |

```
compute.lans.all('datacenter_id')
```

---

#### Create a LAN

Creates a LAN within a data center.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| name | string | The name of your LAN. ||
| public | bool | Boolean indicating if the LAN faces the public Internet or not. ||
| nics | 	string collection | A collection of NICs associated with the LAN. ||

```
compute.lans.create(:datacenter_id => 'datacenter_id', :name => 'My lan', :public => false)
```

---

#### Get a LAN

Retrieves the attributes of a given LAN.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| lan-id | string | The unique ID of the LAN. | Yes |

```
compute.lans.get('datacenter_id', 'lan-id')
```

---

#### Update a LAN

Perform updates to attributes of a LAN.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | The unique ID of the data center. | Yes |
| lan-id | string | The unique ID of the LAN. | Yes |
| name | string | A descriptive name for the LAN. ||
| public | bool | Boolean indicating if the LAN faces the public Internet or not. ||

After retrieving a LAN, either by getting it by id, or as a create response object, you can change it's properties and call the `update` method:

```
lan = compute.lans.get('datacenter_id', 'lan-id')
lan.name = 'Updated LAN name'
lan.update
```

---

#### Delete a LAN

Deletes the specified LAN.

The following table describes the request arguments:

| NAME| TYPE | DESCRIPTION | REQUIRED |
|---|---|---|---|
| datacenter_id | string | 	The unique ID of the data center. | Yes |
| lan-id | string | The unique ID of the LAN. | Yes |

After retrieving a LAN, either by getting it by id, or as a create response object, you can call the `delete` method directly on the object:

```
lan = compute.lans.get('datacenter_id', 'lan-id')
lan.delete
```

---

## Contributing

1. Fork it ( https://github.com/fog/fog-profitbricks/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
