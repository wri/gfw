# Change Log

## [Unreleased](https://github.com/fog/fog-aws/tree/HEAD)

[Full Changelog](https://github.com/fog/fog-aws/compare/v1.2.0...HEAD)

**Closed issues:**

- Fog mock does not mimmick real behaviour for some Excon errors [\#341](https://github.com/fog/fog-aws/issues/341)

**Merged pull requests:**

- Spot fixes [\#349](https://github.com/fog/fog-aws/pull/349) ([ehowe](https://github.com/ehowe))
- add natGatewayId to describe\_route\_tables [\#346](https://github.com/fog/fog-aws/pull/346) ([mliao2](https://github.com/mliao2))
- Fog mock accuracy, fixes \#341 [\#344](https://github.com/fog/fog-aws/pull/344) ([easkay](https://github.com/easkay))
- Subnet [\#343](https://github.com/fog/fog-aws/pull/343) ([ehowe](https://github.com/ehowe))
- Fix multipart upload [\#340](https://github.com/fog/fog-aws/pull/340) ([nobmurakita](https://github.com/nobmurakita))

## [v1.2.0](https://github.com/fog/fog-aws/tree/v1.2.0) (2017-01-20)
[Full Changelog](https://github.com/fog/fog-aws/compare/v1.1.0...v1.2.0)

**Closed issues:**

- Support for AWS Application Load Balancer \(ALB\) [\#335](https://github.com/fog/fog-aws/issues/335)

**Merged pull requests:**

- Better iam policies [\#339](https://github.com/fog/fog-aws/pull/339) ([ehowe](https://github.com/ehowe))
- Pin nokogiri gem for Ruby 1.9 and Ruby 2.0 [\#337](https://github.com/fog/fog-aws/pull/337) ([sodabrew](https://github.com/sodabrew))
- Fix parsing of the Reserved Instance 'recurringCharge' field and add 'scope' field [\#336](https://github.com/fog/fog-aws/pull/336) ([sodabrew](https://github.com/sodabrew))
- Fixes / improvements for AutoScaling [\#334](https://github.com/fog/fog-aws/pull/334) ([lanej](https://github.com/lanej))

## [v1.1.0](https://github.com/fog/fog-aws/tree/v1.1.0) (2016-12-16)
[Full Changelog](https://github.com/fog/fog-aws/compare/v1.0.0...v1.1.0)

**Closed issues:**

- Support new Ohio region \(us-east-2\) [\#313](https://github.com/fog/fog-aws/issues/313)

**Merged pull requests:**

- Canada and London regions [\#333](https://github.com/fog/fog-aws/pull/333) ([mattheworiordan](https://github.com/mattheworiordan))
- Updated ELB Dual Stack hosted zone DNS records [\#332](https://github.com/fog/fog-aws/pull/332) ([mattheworiordan](https://github.com/mattheworiordan))
- Added support for attaching auto scaling groups to target groups [\#330](https://github.com/fog/fog-aws/pull/330) ([maf23](https://github.com/maf23))
- credential\_fetcher: Mark AWS metadata calls as idempotent [\#329](https://github.com/fog/fog-aws/pull/329) ([mtekel](https://github.com/mtekel))

## [v1.0.0](https://github.com/fog/fog-aws/tree/v1.0.0) (2016-12-12)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.13.0...v1.0.0)

**Merged pull requests:**

- fix host header with another port on s3 [\#327](https://github.com/fog/fog-aws/pull/327) ([rodrigoapereira](https://github.com/rodrigoapereira))
- Add new t2.xlarge, t2.2xlarge and r4 class instances. [\#326](https://github.com/fog/fog-aws/pull/326) ([rogersd](https://github.com/rogersd))
- Fix the bug that can't create fifo queue in SQS. [\#323](https://github.com/fog/fog-aws/pull/323) ([ebihara99999](https://github.com/ebihara99999))
- data pipeline mocks [\#318](https://github.com/fog/fog-aws/pull/318) ([ehowe](https://github.com/ehowe))

## [v0.13.0](https://github.com/fog/fog-aws/tree/v0.13.0) (2016-11-29)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.12.0...v0.13.0)

**Closed issues:**

- Fog::Compute::AWS::Image not properly loaded [\#324](https://github.com/fog/fog-aws/issues/324)
- Add creation\_date field for aws images [\#320](https://github.com/fog/fog-aws/issues/320)
- Bug: \[fog\]\[WARNING\] Unrecognized arguments: region, use\_iam\_profile [\#315](https://github.com/fog/fog-aws/issues/315)
- Better contributing documentation [\#311](https://github.com/fog/fog-aws/issues/311)
- AutoscalingGroups with a TargetGroup set are not parsed correctly [\#308](https://github.com/fog/fog-aws/issues/308)
- autoscaling create launch config doesn't work with BlockDeviceMappings  [\#307](https://github.com/fog/fog-aws/issues/307)
- Is there a configuration setting for the AWS provider to adjust the url scheme for S3 buckets? [\#305](https://github.com/fog/fog-aws/issues/305)
- DB Subnet Group id for Cluster returns nil [\#292](https://github.com/fog/fog-aws/issues/292)

**Merged pull requests:**

- Fixed some missing parts in change sets [\#322](https://github.com/fog/fog-aws/pull/322) ([nilroy](https://github.com/nilroy))
- Add creation date and enhanced networking support for images [\#321](https://github.com/fog/fog-aws/pull/321) ([puneetloya](https://github.com/puneetloya))
- Fix warnings in running tests [\#319](https://github.com/fog/fog-aws/pull/319) ([ebihara99999](https://github.com/ebihara99999))
- Add `Fog::AWS::STS.Mock\#assume\_role` [\#316](https://github.com/fog/fog-aws/pull/316) ([pedrommonteiro](https://github.com/pedrommonteiro))
- Ohio region [\#314](https://github.com/fog/fog-aws/pull/314) ([chanakyacool](https://github.com/chanakyacool))
- mime types gem update [\#312](https://github.com/fog/fog-aws/pull/312) ([lucianosousa](https://github.com/lucianosousa))
- fix S3 \#delete\_multiple\_objects for UTF-8 names [\#310](https://github.com/fog/fog-aws/pull/310) ([alepore](https://github.com/alepore))
- Support for target groups \(fix for \#308\) [\#309](https://github.com/fog/fog-aws/pull/309) ([msiuts](https://github.com/msiuts))
- create, describe, and destroy elastic file systems [\#304](https://github.com/fog/fog-aws/pull/304) ([ehowe](https://github.com/ehowe))
- Correct optional parameter naming in documentation for Fog::AWS::Auto… [\#302](https://github.com/fog/fog-aws/pull/302) ([ehealy](https://github.com/ehealy))
- Modify Db subnet group  [\#293](https://github.com/fog/fog-aws/pull/293) ([chanakyacool](https://github.com/chanakyacool))

## [v0.12.0](https://github.com/fog/fog-aws/tree/v0.12.0) (2016-09-22)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.11.0...v0.12.0)

**Implemented enhancements:**

- Add gestion of egress security group rules [\#290](https://github.com/fog/fog-aws/pull/290) ([KevinLoiseau](https://github.com/KevinLoiseau))

**Closed issues:**

- Fog directory appends local system path with amazon url when i try to give dynamic fog directory [\#295](https://github.com/fog/fog-aws/issues/295)
- Getting OperationAborted error on file storage operation [\#288](https://github.com/fog/fog-aws/issues/288)
- AWS Elasticsearch API [\#286](https://github.com/fog/fog-aws/issues/286)
- Disable chunked encoding [\#285](https://github.com/fog/fog-aws/issues/285)

**Merged pull requests:**

- add support endpoint and models/requests for trusted advisor checks [\#300](https://github.com/fog/fog-aws/pull/300) ([ehowe](https://github.com/ehowe))
- Add attribute is\_default in vpc [\#299](https://github.com/fog/fog-aws/pull/299) ([zhitongLBN](https://github.com/zhitongLBN))
- Cloud Formation: additional parameters [\#298](https://github.com/fog/fog-aws/pull/298) ([neillturner](https://github.com/neillturner))
- Cloud Formation: support for change sets, stack policy and other missing calls.   [\#297](https://github.com/fog/fog-aws/pull/297) ([neillturner](https://github.com/neillturner))

## [v0.11.0](https://github.com/fog/fog-aws/tree/v0.11.0) (2016-08-04)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.10.0...v0.11.0)

**Merged pull requests:**

- GitHub does no longer provide http:// pages [\#284](https://github.com/fog/fog-aws/pull/284) ([amatsuda](https://github.com/amatsuda))
- Skip multipart if body size is less than chunk.  [\#283](https://github.com/fog/fog-aws/pull/283) ([brettcave](https://github.com/brettcave))
- ECS container credentials [\#281](https://github.com/fog/fog-aws/pull/281) ([ryansch](https://github.com/ryansch))
- test\(ci\): fix 1.9 builds with json \>= 2.0 [\#280](https://github.com/fog/fog-aws/pull/280) ([lanej](https://github.com/lanej))
- Change DBSubnetGroup to DBSubnetGroupName model cluster while creation [\#279](https://github.com/fog/fog-aws/pull/279) ([chanakyacool](https://github.com/chanakyacool))

## [v0.10.0](https://github.com/fog/fog-aws/tree/v0.10.0) (2016-07-15)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.9.4...v0.10.0)

**Closed issues:**

- How to setup private files with CloudFront? [\#275](https://github.com/fog/fog-aws/issues/275)
- Feature: Custom Managed Policies [\#272](https://github.com/fog/fog-aws/issues/272)
- Question: which aws-sdk version is used [\#270](https://github.com/fog/fog-aws/issues/270)
- Support an IAM list\_attached\_role\_policies method [\#191](https://github.com/fog/fog-aws/issues/191)

**Merged pull requests:**

- RDS test fixes [\#276](https://github.com/fog/fog-aws/pull/276) ([MrPrimate](https://github.com/MrPrimate))
- Expanding IAM support [\#274](https://github.com/fog/fog-aws/pull/274) ([MrPrimate](https://github.com/MrPrimate))
- Rds snapshot improvements [\#269](https://github.com/fog/fog-aws/pull/269) ([tekken](https://github.com/tekken))
- add default region to use\_iam\_profile [\#268](https://github.com/fog/fog-aws/pull/268) ([shaiguitar](https://github.com/shaiguitar))

## [v0.9.4](https://github.com/fog/fog-aws/tree/v0.9.4) (2016-06-28)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.9.3...v0.9.4)

**Closed issues:**

- S3: retry on 503 Service Unavailable [\#265](https://github.com/fog/fog-aws/issues/265)
- Digest::Base Error [\#261](https://github.com/fog/fog-aws/issues/261)

**Merged pull requests:**

- Updated Region 'Mumbai' ap-south-1  [\#267](https://github.com/fog/fog-aws/pull/267) ([chanakyacool](https://github.com/chanakyacool))
- Replaces usage of Digest with OpenSSL::Digest  [\#266](https://github.com/fog/fog-aws/pull/266) ([esthervillars](https://github.com/esthervillars))
- AWS DNS - support newer DNS hosted zone IDs for dualstack ELBs [\#263](https://github.com/fog/fog-aws/pull/263) ([mattheworiordan](https://github.com/mattheworiordan))

## [v0.9.3](https://github.com/fog/fog-aws/tree/v0.9.3) (2016-06-20)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.9.2...v0.9.3)

**Closed issues:**

- Users list is empty in Fog::AWS::IAM::Groups  [\#256](https://github.com/fog/fog-aws/issues/256)
- I'd like to configure my Excon read\_timeout and write\_timeout  [\#254](https://github.com/fog/fog-aws/issues/254)
- Bump fog-core to \>=1.38.0 [\#247](https://github.com/fog/fog-aws/issues/247)
- no implicit conversion of Array into String in `aws/storage.rb` from `bucket\_name` in params. [\#246](https://github.com/fog/fog-aws/issues/246)
- \[S3\] Bucket name gets duplicated in case of redirect from AWS [\#242](https://github.com/fog/fog-aws/issues/242)
- CloudFormation stack tags cause describe\_stacks to break [\#240](https://github.com/fog/fog-aws/issues/240)

**Merged pull requests:**

- Parse EbsOptimized parameter in launch configuration description [\#259](https://github.com/fog/fog-aws/pull/259) ([djudd](https://github.com/djudd))
- Allow case-insensitive record comparison [\#258](https://github.com/fog/fog-aws/pull/258) ([mpick92](https://github.com/mpick92))
- Fix for empty ETag values [\#257](https://github.com/fog/fog-aws/pull/257) ([baryshev](https://github.com/baryshev))
- do not make requests if mocked. [\#252](https://github.com/fog/fog-aws/pull/252) ([shaiguitar](https://github.com/shaiguitar))
- Parse CloudWatch alarm actions as arrays instead of strings [\#245](https://github.com/fog/fog-aws/pull/245) ([eherot](https://github.com/eherot))
- Add support for CloudFormation stack tags. [\#241](https://github.com/fog/fog-aws/pull/241) ([jamesremuscat](https://github.com/jamesremuscat))
- Add log warning message about when not on us-region [\#200](https://github.com/fog/fog-aws/pull/200) ([kitofr](https://github.com/kitofr))

## [v0.9.2](https://github.com/fog/fog-aws/tree/v0.9.2) (2016-03-23)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.9.1...v0.9.2)

**Closed issues:**

- CHANGELOG.md is out of date [\#235](https://github.com/fog/fog-aws/issues/235)

**Merged pull requests:**

- Aurora [\#238](https://github.com/fog/fog-aws/pull/238) ([ehowe](https://github.com/ehowe))

## [v0.9.1](https://github.com/fog/fog-aws/tree/v0.9.1) (2016-03-04)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.8.2...v0.9.1)

## [v0.8.2](https://github.com/fog/fog-aws/tree/v0.8.2) (2016-03-04)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.9.0...v0.8.2)

**Merged pull requests:**

- autoscaler attach/detatch [\#229](https://github.com/fog/fog-aws/pull/229) ([shaiguitar](https://github.com/shaiguitar))

## [v0.9.0](https://github.com/fog/fog-aws/tree/v0.9.0) (2016-03-03)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.8.1...v0.9.0)

**Closed issues:**

- Fog::Storage::AWS::File\#save deprecation warning without alternative [\#226](https://github.com/fog/fog-aws/issues/226)
- Long format of aws resources [\#216](https://github.com/fog/fog-aws/issues/216)

**Merged pull requests:**

- Update README.md [\#233](https://github.com/fog/fog-aws/pull/233) ([h0lyalg0rithm](https://github.com/h0lyalg0rithm))
- fix mime-types CI issues, add 2.3.0 testing [\#231](https://github.com/fog/fog-aws/pull/231) ([lanej](https://github.com/lanej))
- support for rds clusters and aurora [\#230](https://github.com/fog/fog-aws/pull/230) ([ehowe](https://github.com/ehowe))
- Correct default DescribeAvailabilityZone filter to zone-name [\#225](https://github.com/fog/fog-aws/pull/225) ([gregburek](https://github.com/gregburek))
- Security Group perms of FromPort 0 and ToPort -1 [\#223](https://github.com/fog/fog-aws/pull/223) ([jacobo](https://github.com/jacobo))
- Page default parameters [\#222](https://github.com/fog/fog-aws/pull/222) ([ehowe](https://github.com/ehowe))
- rds enhancements [\#220](https://github.com/fog/fog-aws/pull/220) ([ehowe](https://github.com/ehowe))
- Added ap-northeast-2 to the fog mocks. [\#219](https://github.com/fog/fog-aws/pull/219) ([wyhaines](https://github.com/wyhaines))
- restore db instance fom db snapshot [\#217](https://github.com/fog/fog-aws/pull/217) ([ehowe](https://github.com/ehowe))

## [v0.8.1](https://github.com/fog/fog-aws/tree/v0.8.1) (2016-01-08)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.8.0...v0.8.1)

**Merged pull requests:**

- Add new aws regions [\#213](https://github.com/fog/fog-aws/pull/213) ([atmos](https://github.com/atmos))

## [v0.8.0](https://github.com/fog/fog-aws/tree/v0.8.0) (2016-01-04)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.7.6...v0.8.0)

**Fixed bugs:**

- IAM roles.all should paginate [\#176](https://github.com/fog/fog-aws/issues/176)

**Closed issues:**

- Fog gives wrong location for buckets when connected via non-default region [\#208](https://github.com/fog/fog-aws/issues/208)
- Is there any way to skip object level `acl` setting while `public` option is true [\#207](https://github.com/fog/fog-aws/issues/207)
- using/testing on ruby 1.9 [\#203](https://github.com/fog/fog-aws/issues/203)
- S3 KMS encryption support [\#196](https://github.com/fog/fog-aws/issues/196)
- Support S3 auto-expiring files? [\#194](https://github.com/fog/fog-aws/issues/194)
- Fog::AWS::ELB::InvalidConfigurationRequest: policy cannot be enabled [\#193](https://github.com/fog/fog-aws/issues/193)
- get\_https\_url generating negative expiry [\#188](https://github.com/fog/fog-aws/issues/188)
- Streaming requests shouldn't be idempotent [\#181](https://github.com/fog/fog-aws/issues/181)
- S3 connection hangs; does Fog support timeout? [\#180](https://github.com/fog/fog-aws/issues/180)
- Doesn't work after upgrading to 0.1.2 [\#83](https://github.com/fog/fog-aws/issues/83)

**Merged pull requests:**

- When not specified, region for a bucket should be DEFAULT\_REGION. [\#211](https://github.com/fog/fog-aws/pull/211) ([jamesremuscat](https://github.com/jamesremuscat))
- Support NoncurrentVersion\[Expiration,Transition\] for s3 lifecycle. [\#210](https://github.com/fog/fog-aws/pull/210) ([xtoddx](https://github.com/xtoddx))
- Update dynamodb to use the latest API version [\#209](https://github.com/fog/fog-aws/pull/209) ([dmathieu](https://github.com/dmathieu))
- Make sure to send the KmsKeyId when creating an RDS cluster [\#206](https://github.com/fog/fog-aws/pull/206) ([drcapulet](https://github.com/drcapulet))
- Reset 'finished' when rewinding S3Streamer [\#205](https://github.com/fog/fog-aws/pull/205) ([jschneiderhan](https://github.com/jschneiderhan))
- Add mime-types to test section in Gemfile [\#204](https://github.com/fog/fog-aws/pull/204) ([kitofr](https://github.com/kitofr))
- filters on tags can pass an array [\#202](https://github.com/fog/fog-aws/pull/202) ([craiggenner](https://github.com/craiggenner))
- Document options for S3 server-side encryption [\#199](https://github.com/fog/fog-aws/pull/199) ([shuhei](https://github.com/shuhei))
- make net/ssh require optional [\#197](https://github.com/fog/fog-aws/pull/197) ([geemus](https://github.com/geemus))
- Cache cluster security group parser [\#190](https://github.com/fog/fog-aws/pull/190) ([eherot](https://github.com/eherot))
- Allow region to be set for STS [\#189](https://github.com/fog/fog-aws/pull/189) ([fcheung](https://github.com/fcheung))
- add cn support for s3 [\#187](https://github.com/fog/fog-aws/pull/187) ([ming-relax](https://github.com/ming-relax))
- mock instance stop and start properly [\#184](https://github.com/fog/fog-aws/pull/184) ([ehowe](https://github.com/ehowe))
- Disable idempotent option when block is passed to get\_object [\#183](https://github.com/fog/fog-aws/pull/183) ([wangteji](https://github.com/wangteji))
- Yield arguments to Mock\#get\_object block more similar to Excon [\#182](https://github.com/fog/fog-aws/pull/182) ([tdg5](https://github.com/tdg5))
- add IAM role paging [\#178](https://github.com/fog/fog-aws/pull/178) ([lanej](https://github.com/lanej))
- properly mock rds name update [\#170](https://github.com/fog/fog-aws/pull/170) ([ehowe](https://github.com/ehowe))

## [v0.7.6](https://github.com/fog/fog-aws/tree/v0.7.6) (2015-08-26)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.7.5...v0.7.6)

**Closed issues:**

- mock directories.create destroys existing directory [\#172](https://github.com/fog/fog-aws/issues/172)

**Merged pull requests:**

- Add GovCloud region name to validation set. [\#175](https://github.com/fog/fog-aws/pull/175) ([triplepoint](https://github.com/triplepoint))
- Mocked put\_bucket no longer clobbers existing bucket [\#174](https://github.com/fog/fog-aws/pull/174) ([jgr](https://github.com/jgr))

## [v0.7.5](https://github.com/fog/fog-aws/tree/v0.7.5) (2015-08-24)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.7.4...v0.7.5)

**Closed issues:**

- how to change filepath for html\_table\_reporter in reporter options [\#167](https://github.com/fog/fog-aws/issues/167)
- Access Key, etc still required for Storage access when using use\_iam\_profile [\#162](https://github.com/fog/fog-aws/issues/162)
- Support for KMS ID for EBS Volume [\#141](https://github.com/fog/fog-aws/issues/141)

**Merged pull requests:**

- validate rds server security group associations [\#173](https://github.com/fog/fog-aws/pull/173) ([lanej](https://github.com/lanej))
- format security groups when modifying db instance [\#171](https://github.com/fog/fog-aws/pull/171) ([michelleN](https://github.com/michelleN))
- standardize region validation [\#169](https://github.com/fog/fog-aws/pull/169) ([lanej](https://github.com/lanej))
- expose elb region [\#168](https://github.com/fog/fog-aws/pull/168) ([lanej](https://github.com/lanej))
- volume\#key\_id and encrypted tests [\#165](https://github.com/fog/fog-aws/pull/165) ([lanej](https://github.com/lanej))
- raise InvalidParameterCombination error [\#163](https://github.com/fog/fog-aws/pull/163) ([michelleN](https://github.com/michelleN))
- storage request bad xml schema for put bucket notification fix [\#161](https://github.com/fog/fog-aws/pull/161) ([bahchis](https://github.com/bahchis))
- Use regex instead of string matching to support redirect correctly when path\_style is set to true [\#159](https://github.com/fog/fog-aws/pull/159) ([drich10](https://github.com/drich10))
- update \#promote\_read\_replica mock [\#158](https://github.com/fog/fog-aws/pull/158) ([lanej](https://github.com/lanej))

## [v0.7.4](https://github.com/fog/fog-aws/tree/v0.7.4) (2015-07-30)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.7.3...v0.7.4)

**Fixed bugs:**

- Route53 zone listing fix and support for private hosted zones [\#154](https://github.com/fog/fog-aws/pull/154) ([solud](https://github.com/solud))

**Merged pull requests:**

- AutoScaling attach/detach ELB support + tests [\#156](https://github.com/fog/fog-aws/pull/156) ([nbfowler](https://github.com/nbfowler))

## [v0.7.3](https://github.com/fog/fog-aws/tree/v0.7.3) (2015-07-10)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.7.2...v0.7.3)

**Closed issues:**

- "Error: The specified marker is not valid" after upgrade to 0.7.0 [\#148](https://github.com/fog/fog-aws/issues/148)

**Merged pull requests:**

- encrypted storage on rds [\#153](https://github.com/fog/fog-aws/pull/153) ([ehowe](https://github.com/ehowe))

## [v0.7.2](https://github.com/fog/fog-aws/tree/v0.7.2) (2015-07-08)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.7.1...v0.7.2)

**Fixed bugs:**

- NoMethodError trying to create a new AWS Route53 entry using version 0.7.1 [\#150](https://github.com/fog/fog-aws/issues/150)

**Merged pull requests:**

- fix \#change\_resource\_record\_sets [\#151](https://github.com/fog/fog-aws/pull/151) ([lanej](https://github.com/lanej))

## [v0.7.1](https://github.com/fog/fog-aws/tree/v0.7.1) (2015-07-08)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.7.0...v0.7.1)

**Merged pull requests:**

- Fix broken xmlns in DNS requests [\#149](https://github.com/fog/fog-aws/pull/149) ([decklin](https://github.com/decklin))
- Fix blank content-encoding headers [\#147](https://github.com/fog/fog-aws/pull/147) ([fcheung](https://github.com/fcheung))

## [v0.7.0](https://github.com/fog/fog-aws/tree/v0.7.0) (2015-07-07)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.6.0...v0.7.0)

**Closed issues:**

- Add support for AWS Lambda [\#124](https://github.com/fog/fog-aws/issues/124)

**Merged pull requests:**

- Describe vpcPeeringConnectionId [\#146](https://github.com/fog/fog-aws/pull/146) ([fdr](https://github.com/fdr))
- Adds isDefault to parser for describe\_vpcs [\#144](https://github.com/fog/fog-aws/pull/144) ([gregburek](https://github.com/gregburek))
- Support kinesis [\#143](https://github.com/fog/fog-aws/pull/143) ([mikehale](https://github.com/mikehale))
- The :geo\_location attribute needs to be xml formatted before calling aws [\#142](https://github.com/fog/fog-aws/pull/142) ([carloslima](https://github.com/carloslima))
- Escape Lambda function name in request paths [\#140](https://github.com/fog/fog-aws/pull/140) ([nomadium](https://github.com/nomadium))
- list\_hosted\_zones expects that options to be hash with symbol as key [\#139](https://github.com/fog/fog-aws/pull/139) ([slashmili](https://github.com/slashmili))

## [v0.6.0](https://github.com/fog/fog-aws/tree/v0.6.0) (2015-06-23)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.5.0...v0.6.0)

**Merged pull requests:**

- Add support for AWS Lambda service [\#123](https://github.com/fog/fog-aws/pull/123) ([nomadium](https://github.com/nomadium))

## [v0.5.0](https://github.com/fog/fog-aws/tree/v0.5.0) (2015-06-17)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.4.1...v0.5.0)

**Merged pull requests:**

- add t2.large [\#137](https://github.com/fog/fog-aws/pull/137) ([lanej](https://github.com/lanej))
- Make Mock create\_vpc method arity match Real [\#135](https://github.com/fog/fog-aws/pull/135) ([fdr](https://github.com/fdr))
- Add support for EC2 Container Service [\#120](https://github.com/fog/fog-aws/pull/120) ([nomadium](https://github.com/nomadium))

## [v0.4.1](https://github.com/fog/fog-aws/tree/v0.4.1) (2015-06-15)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.4.0...v0.4.1)

**Closed issues:**

- Fog doesn't support storage\_type or gp2 for RDS? [\#129](https://github.com/fog/fog-aws/issues/129)
- Fog-aws not working with Hitachi [\#122](https://github.com/fog/fog-aws/issues/122)
- "NoMethodError: undefined method `body' for \#\<Fog::DNS::AWS::Error:0x007f6c673e1720\>" [\#112](https://github.com/fog/fog-aws/issues/112)
- Add support for EC2 Container Service \(ECS\) [\#93](https://github.com/fog/fog-aws/issues/93)

**Merged pull requests:**

- Fix attributes of flavors [\#134](https://github.com/fog/fog-aws/pull/134) ([yumminhuang](https://github.com/yumminhuang))
- Fix S3 signature v4 signing [\#133](https://github.com/fog/fog-aws/pull/133) ([fcheung](https://github.com/fcheung))
- Add New M4 Instance Type [\#132](https://github.com/fog/fog-aws/pull/132) ([yumminhuang](https://github.com/yumminhuang))
- raise correct error when exceeding address limit [\#131](https://github.com/fog/fog-aws/pull/131) ([lanej](https://github.com/lanej))
- make elb/policies collection standalone [\#128](https://github.com/fog/fog-aws/pull/128) ([lanej](https://github.com/lanej))
- model managed policies [\#126](https://github.com/fog/fog-aws/pull/126) ([lanej](https://github.com/lanej))

## [v0.4.0](https://github.com/fog/fog-aws/tree/v0.4.0) (2015-05-27)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.3.0...v0.4.0)

**Merged pull requests:**

- model iam groups [\#121](https://github.com/fog/fog-aws/pull/121) ([lanej](https://github.com/lanej))

## [v0.3.0](https://github.com/fog/fog-aws/tree/v0.3.0) (2015-05-21)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.2.2...v0.3.0)

**Closed issues:**

- How to determine the disableApiTermination attribute value  [\#98](https://github.com/fog/fog-aws/issues/98)

**Merged pull requests:**

- support iam/get\_user without username [\#114](https://github.com/fog/fog-aws/pull/114) ([lanej](https://github.com/lanej))
- Added a new request - describe\_instance\_attribute [\#110](https://github.com/fog/fog-aws/pull/110) ([nilroy](https://github.com/nilroy))

## [v0.2.2](https://github.com/fog/fog-aws/tree/v0.2.2) (2015-05-13)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.2.1...v0.2.2)

## [v0.2.1](https://github.com/fog/fog-aws/tree/v0.2.1) (2015-05-13)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.2.0...v0.2.1)

**Merged pull requests:**

- mocks for topic permissions [\#111](https://github.com/fog/fog-aws/pull/111) ([lanej](https://github.com/lanej))

## [v0.2.0](https://github.com/fog/fog-aws/tree/v0.2.0) (2015-05-13)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.1.2...v0.2.0)

**Implemented enhancements:**

- update RDS to 2014-10-31 version [\#107](https://github.com/fog/fog-aws/pull/107) ([lanej](https://github.com/lanej))

**Closed issues:**

- IAM authentication not compatible with GovCloud  [\#100](https://github.com/fog/fog-aws/issues/100)
- Enabling termination protection [\#95](https://github.com/fog/fog-aws/issues/95)
- SSLv3 deprecation: action required? [\#88](https://github.com/fog/fog-aws/issues/88)

**Merged pull requests:**

- configure server attributes in mock [\#109](https://github.com/fog/fog-aws/pull/109) ([michelleN](https://github.com/michelleN))
- support aws kms [\#108](https://github.com/fog/fog-aws/pull/108) ([lanej](https://github.com/lanej))
- Another attempt to solve content-encoding header issues [\#106](https://github.com/fog/fog-aws/pull/106) ([fcheung](https://github.com/fcheung))
- default replica AutoMinorVersionUpgrade to master [\#104](https://github.com/fog/fog-aws/pull/104) ([michelleN](https://github.com/michelleN))
- Refresh credentials if needed when signing S3 URL [\#103](https://github.com/fog/fog-aws/pull/103) ([matkam](https://github.com/matkam))
- Allow the IAM constructor to accept a region [\#102](https://github.com/fog/fog-aws/pull/102) ([benbalter](https://github.com/benbalter))
- configure auto\_minor\_version\_upgrade in mock [\#101](https://github.com/fog/fog-aws/pull/101) ([michelleN](https://github.com/michelleN))
- Adding instanceTenancy to reserved instance parser. [\#97](https://github.com/fog/fog-aws/pull/97) ([dmbrooking](https://github.com/dmbrooking))
- Parse elasticache configuration endpoint from response [\#96](https://github.com/fog/fog-aws/pull/96) ([fcheung](https://github.com/fcheung))
- Fix mock VPC ELB creation in regions other than us-east-1 [\#94](https://github.com/fog/fog-aws/pull/94) ([mrpoundsign](https://github.com/mrpoundsign))
- Fix repository URL in README.md [\#91](https://github.com/fog/fog-aws/pull/91) ([tricknotes](https://github.com/tricknotes))
- adding support for d2 instance type [\#90](https://github.com/fog/fog-aws/pull/90) ([yumminhuang](https://github.com/yumminhuang))
- Support weight round robin mock [\#89](https://github.com/fog/fog-aws/pull/89) ([freddy1666](https://github.com/freddy1666))
- Update README.md [\#87](https://github.com/fog/fog-aws/pull/87) ([nomadium](https://github.com/nomadium))
- Add mock for EC2 request\_spot\_instances API request [\#86](https://github.com/fog/fog-aws/pull/86) ([nomadium](https://github.com/nomadium))
- Move more requires to autoload [\#85](https://github.com/fog/fog-aws/pull/85) ([plribeiro3000](https://github.com/plribeiro3000))
- Add mock for EC2 describe\_spot\_price\_history API request [\#84](https://github.com/fog/fog-aws/pull/84) ([nomadium](https://github.com/nomadium))

## [v0.1.2](https://github.com/fog/fog-aws/tree/v0.1.2) (2015-04-07)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.1.1...v0.1.2)

**Closed issues:**

- Ruby warnings Comparable & Return nil  [\#81](https://github.com/fog/fog-aws/issues/81)
- CircleCI failing [\#80](https://github.com/fog/fog-aws/issues/80)
- Heroku error [\#77](https://github.com/fog/fog-aws/issues/77)
- Repeatable signed urls for the same expiry [\#65](https://github.com/fog/fog-aws/issues/65)

**Merged pull requests:**

- Handle missing parameters in describe\_spot\_price\_history request [\#82](https://github.com/fog/fog-aws/pull/82) ([nomadium](https://github.com/nomadium))
- create db instance in the correct region [\#79](https://github.com/fog/fog-aws/pull/79) ([lanej](https://github.com/lanej))
- Remove assignment within conditional in File\#body [\#78](https://github.com/fog/fog-aws/pull/78) ([greysteil](https://github.com/greysteil))
- mock DescribeDBEngineVersions [\#76](https://github.com/fog/fog-aws/pull/76) ([ehowe](https://github.com/ehowe))
- Fix blank content-encoding when none is supplied [\#75](https://github.com/fog/fog-aws/pull/75) ([fcheung](https://github.com/fcheung))
- \[rds\] prevent final snapshot on replicas [\#74](https://github.com/fog/fog-aws/pull/74) ([lanej](https://github.com/lanej))
- Fix for `undefined method `map' for nil:NilClass` [\#73](https://github.com/fog/fog-aws/pull/73) ([mattheworiordan](https://github.com/mattheworiordan))
- Resource record sets bug fix + support eu-central-1  [\#72](https://github.com/fog/fog-aws/pull/72) ([mattheworiordan](https://github.com/mattheworiordan))
- Fix EC2 security groups where SSH inbound rule isn't first [\#71](https://github.com/fog/fog-aws/pull/71) ([ayumi](https://github.com/ayumi))
- eu-central missing from Fog::Compute::AWS::Mock [\#70](https://github.com/fog/fog-aws/pull/70) ([wyhaines](https://github.com/wyhaines))
- Remove executable bit from files. [\#69](https://github.com/fog/fog-aws/pull/69) ([voxik](https://github.com/voxik))
- Remove Mac specific files. [\#68](https://github.com/fog/fog-aws/pull/68) ([voxik](https://github.com/voxik))
- Stringify keys for query parameters [\#67](https://github.com/fog/fog-aws/pull/67) ([jfmyers9](https://github.com/jfmyers9))
- Mock method for AWS S3 post\_object\_hidden\_fields  [\#63](https://github.com/fog/fog-aws/pull/63) ([byterussian](https://github.com/byterussian))
- Reduce loading time [\#62](https://github.com/fog/fog-aws/pull/62) ([plribeiro3000](https://github.com/plribeiro3000))
- Add support for cname buckets [\#61](https://github.com/fog/fog-aws/pull/61) ([dsgh](https://github.com/dsgh))

## [v0.1.1](https://github.com/fog/fog-aws/tree/v0.1.1) (2015-02-25)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.1.0...v0.1.1)

**Closed issues:**

- head\_url signed [\#47](https://github.com/fog/fog-aws/issues/47)
- AWS Credentials required when using IAM Profile [\#44](https://github.com/fog/fog-aws/issues/44)

**Merged pull requests:**

- Support for IAM managed policies [\#60](https://github.com/fog/fog-aws/pull/60) ([fcheung](https://github.com/fcheung))
- Fix for ScanFilter parameters [\#58](https://github.com/fog/fog-aws/pull/58) ([nawaidshamim](https://github.com/nawaidshamim))
- \[dns\] fix Records\#get, mock records and proper errors [\#57](https://github.com/fog/fog-aws/pull/57) ([lanej](https://github.com/lanej))
- \[aws|compute\] support c4.8xlarge flavor [\#56](https://github.com/fog/fog-aws/pull/56) ([ddoc](https://github.com/ddoc))
- \[aws|compute\] adding support for c4 instance class [\#55](https://github.com/fog/fog-aws/pull/55) ([ddoc](https://github.com/ddoc))
- not allowed to delete a "revoking" rds firewall [\#54](https://github.com/fog/fog-aws/pull/54) ([lanej](https://github.com/lanej))
- raise when destroying an ec2 firewall authorized to an rds firewall [\#53](https://github.com/fog/fog-aws/pull/53) ([lanej](https://github.com/lanej))
- Making it easier to get pre-signed head requests [\#51](https://github.com/fog/fog-aws/pull/51) ([mrloop](https://github.com/mrloop))
- Support customer encryption headers in multipart uploads [\#50](https://github.com/fog/fog-aws/pull/50) ([lautis](https://github.com/lautis))
- don't allow sg authorization to unknown sgs [\#49](https://github.com/fog/fog-aws/pull/49) ([lanej](https://github.com/lanej))

## [v0.1.0](https://github.com/fog/fog-aws/tree/v0.1.0) (2015-02-03)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.0.8...v0.1.0)

**Closed issues:**

- AWS Launch Configuration missing Ebs.Volume\_Type [\#18](https://github.com/fog/fog-aws/issues/18)

**Merged pull requests:**

- Fix v4 signature when path has repeated slashes in the middle [\#46](https://github.com/fog/fog-aws/pull/46) ([fcheung](https://github.com/fcheung))
- get signin token for federation [\#45](https://github.com/fog/fog-aws/pull/45) ([ehowe](https://github.com/ehowe))
- add 'volumeType' and 'encrypted' to blockDeviceMapping parser [\#43](https://github.com/fog/fog-aws/pull/43) ([ichii386](https://github.com/ichii386))
- default namespace and evaluation period on alarm [\#37](https://github.com/fog/fog-aws/pull/37) ([michelleN](https://github.com/michelleN))

## [v0.0.8](https://github.com/fog/fog-aws/tree/v0.0.8) (2015-01-27)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.0.7...v0.0.8)

**Closed issues:**

- NoMethodError - undefined method `signature\_parameters' for nil:NilClass [\#28](https://github.com/fog/fog-aws/issues/28)

**Merged pull requests:**

- add missing mocks [\#41](https://github.com/fog/fog-aws/pull/41) ([michelleN](https://github.com/michelleN))
- Add idempotent excon option to some route53 API calls [\#40](https://github.com/fog/fog-aws/pull/40) ([josacar](https://github.com/josacar))
- Allow for AWS errors not specifying region [\#39](https://github.com/fog/fog-aws/pull/39) ([greysteil](https://github.com/greysteil))
- correct engine version param on rds replicas [\#38](https://github.com/fog/fog-aws/pull/38) ([lanej](https://github.com/lanej))
- \[AWS|Autoscaling\] Add missing ebs attributes to describe\_launch\_configurations [\#35](https://github.com/fog/fog-aws/pull/35) ([fcheung](https://github.com/fcheung))
- \[AWS|Storage\] signed\_url should use v2 signature when aws\_signature\_version is 2 [\#34](https://github.com/fog/fog-aws/pull/34) ([fcheung](https://github.com/fcheung))
- BUGFIX: When fog\_credentials endpoint is set @region defaults to nil [\#33](https://github.com/fog/fog-aws/pull/33) ([nicholasklick](https://github.com/nicholasklick))
- \[AWS|Autoscaling\] Support classic link related properties for launch configurations [\#32](https://github.com/fog/fog-aws/pull/32) ([fcheung](https://github.com/fcheung))
- fix autoscaling activities collection setup [\#31](https://github.com/fog/fog-aws/pull/31) ([fcheung](https://github.com/fcheung))
- Add PlacementTenancy to launch configuration parser and test case [\#29](https://github.com/fog/fog-aws/pull/29) ([benpillet](https://github.com/benpillet))
- Use Fog::Formatador [\#27](https://github.com/fog/fog-aws/pull/27) ([starbelly](https://github.com/starbelly))

## [v0.0.7](https://github.com/fog/fog-aws/tree/v0.0.7) (2015-01-23)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.0.6...v0.0.7)

**Closed issues:**

- SSL Error on S3 connection [\#9](https://github.com/fog/fog-aws/issues/9)

**Merged pull requests:**

- simulate sns confirmation message [\#36](https://github.com/fog/fog-aws/pull/36) ([lanej](https://github.com/lanej))
- Support for VPC Classic Link [\#3](https://github.com/fog/fog-aws/pull/3) ([fcheung](https://github.com/fcheung))

## [v0.0.6](https://github.com/fog/fog-aws/tree/v0.0.6) (2015-01-12)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.0.5...v0.0.6)

**Closed issues:**

- missed files [\#1](https://github.com/fog/fog-aws/issues/1)

**Merged pull requests:**

- \[AWS|Core\] Fix signature v4 non canonicalising header case properly [\#4](https://github.com/fog/fog-aws/pull/4) ([fcheung](https://github.com/fcheung))
- another attempt at s3 region redirecting [\#2](https://github.com/fog/fog-aws/pull/2) ([geemus](https://github.com/geemus))

## [v0.0.5](https://github.com/fog/fog-aws/tree/v0.0.5) (2015-01-06)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.0.4...v0.0.5)

## [v0.0.4](https://github.com/fog/fog-aws/tree/v0.0.4) (2015-01-04)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.0.3...v0.0.4)

## [v0.0.3](https://github.com/fog/fog-aws/tree/v0.0.3) (2015-01-02)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.0.2...v0.0.3)

## [v0.0.2](https://github.com/fog/fog-aws/tree/v0.0.2) (2015-01-02)
[Full Changelog](https://github.com/fog/fog-aws/compare/v0.0.1...v0.0.2)

## [v0.0.1](https://github.com/fog/fog-aws/tree/v0.0.1) (2015-01-02)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*