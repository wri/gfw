# Changelog of fog-sakuracloud

## v1.7.5

- Bug: Server#create_and_attach_volume ignores api_zone. => TODO: Cleanup

## v1.7.4

- Bug: forgot zone is1a...

## v1.7.3

- Coordinate: Router#change_bandwidth update current instance by new ID.

## v1.7.2

- Bug: remove debug code from create_router

## v1.7.1

- Misc: Pass zone from Fog.credentials[:sakuracloud_api_zone].

## v1.7.0

- Change: Rebuild router model from internet resource.

## v1.6.0

- Miscs: Wrap request for error messages to be readable. #22
- Cleanup: replace @attribute[:id] to id #21

## v1.5.2

- Feature: Add filter params Start and End to collect_monitor_router.

## v1.5.1

- Feature: Add monitor to Router model PR #20 HT: @miyukki

## v1.5.0

- Feature: # Add new option api_zone to Provider to select zone easily.

## v1.4.0

- Feature: #17 Support Standard Disk Plan for Disk creation HT: @noralife
- Feature: #18 Add attach feature to Disk Model HT: @noralife

## v1.3.3

- Typo: Fix typo ( auth_encord -> auth_encode ) #16 HT: @mazgi
- Drop support ruby 1.9, add 2.2

## v1.3.2

- Feature: Set hostname (Disk#carve_hostname_on_disk)

## v1.3.1

- Feature: Add simple setter to ResourceRecordSets

## v1.3.0

- Feature: Manage Cloud DNS

## v1.2.0

- Feature: Manage Interface.

## v1.1.1

- Bugfix: Delete Server

## v1.1.0

- Feature: Support Install Script.

## v1.0.1

- #11 Using Relative paths.

## v0.1.2

- Clean up: #7 HT: @starbelly

## v0.1.1

- Add: Associate IP address to disk

## v0.1.0

- Add: Network resources
    - switch
    - router
- API change: create server requires options type.

## v0.0.4

- move lib/fog/bin/sakuracloud.rb from fog.

## v0.0.1-0.0.3

- divide from fog.
- supports
    - compute(with public switch only)
    - volume
