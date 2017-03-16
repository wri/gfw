#
# Author:: Matheus Francisco Barra Mina (<mfbmina@gmail.com>)
# © Copyright IBM Corporation 2015.
#
# LICENSE: MIT (http://opensource.org/licenses/MIT)
#
module Fog
  module Compute
    class Softlayer
      class Mock
        # Gets all Bare Metal buy options
        # @return [Excon::Response]
        def get_bare_metal_create_options
          response = Excon::Response.new
          response.body = bare_metal_options
          response.status = 200
          response
        end
      end

      class Real
        def get_bare_metal_create_options
          request(:hardware_server, "getCreateObjectOptions", :http_method => :GET)
        end
      end
    end
  end
end

module Fog
  module Compute
    class Softlayer
      class Mock
        def bare_metal_options
          {
            "datacenters"=>
              [
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"ams01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"dal01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"dal05"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"dal06"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"dal09"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"fra02"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"hkg02"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"hou02"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"lon02"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"mel01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"mex01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"mon01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"par01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"sea01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"sjc01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"sng01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"syd01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"tok02"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"tor01"
                        }
                    }
                },
                {
                  "template"=>
                    {
                      "datacenter"=>
                        {
                          "name"=>"wdc01"
                        }
                    }
                }
              ], "hardDrives"=>
              [
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"500 GB SATA II"
                      }
                    },
                  "template"=>
                    {
                      "hardDrives"=>
                        [
                          {
                            "capacity"=>"500"
                          }
                        ]
                    }
                }
              ], "networkComponents"=>
              [
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"10 Mbps Private Network Uplink"
                      }
                    },
                  "template"=>
                    {
                      "networkComponents"=>
                        [
                          {
                            "maxSpeed"=>10}
                        ]
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"100 Mbps Dual Public & Private Network Uplinks (Unbonded)"
                      }
                    },
                  "template"=>
                    {
                      "networkComponents"=>
                        [
                          {
                            "maxSpeed"=>100}
                        ]
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".02", "recurringFee"=>"10", "item"=>
                      {
                        "description"=>"1 Gbps Private Network Uplink"
                      }
                    },
                  "template"=>
                    {
                      "networkComponents"=>
                        [
                          {
                            "maxSpeed"=>1000}
                        ]
                    }
                }
              ], "operatingSystems"=>
              [
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"CentOS 7.x - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CENTOS_7_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"CentOS 6.x - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CENTOS_6_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"CentOS 6.x - Minimal Install (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CENTOS_6_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"CentOS 5.x - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CENTOS_5_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"CentOS 5.x - Minimal Install (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CENTOS_5_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"12", "item"=>
                      {
                        "description"=>"CloudLinux 6.x (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CLOUDLINUX_6_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"12", "item"=>
                      {
                        "description"=>"CloudLinux 6.x (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CLOUDLINUX_6_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"12", "item"=>
                      {
                        "description"=>"CloudLinux 5.x (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CLOUDLINUX_5_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"12", "item"=>
                      {
                        "description"=>"CloudLinux 5.x (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CLOUDLINUX_5_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"No Operating System"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"CUSTOS_1_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Debian GNU/Linux 7.x Wheezy/Stable - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"DEBIAN_7_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Debian GNU/Linux 7.x Wheezy/Stable - Minimal Install (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"DEBIAN_7_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Debian GNU/Linux 6.x Squeeze/Stable - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"DEBIAN_6_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Debian GNU/Linux 6.x Squeeze/Stable - Minimal Install (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"DEBIAN_6_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"VMware ESX 4.1"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"ESX_4_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"VMware ESXi 5.5"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"ESXI_5.5_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"VMware ESXi 5.1"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"ESXI_5.1_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"FreeBSD 10.x (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"FREEBSD_10_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"FreeBSD 10.x (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"FREEBSD_10_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"FreeBSD 9.x (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"FREEBSD_9_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"FreeBSD 9.x (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"FREEBSD_9_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"FreeBSD 8.x (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"FREEBSD_8_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"FreeBSD 8.x (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"FREEBSD_8_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"45", "item"=>
                      {
                        "description"=>"Red Hat Enterprise Linux 6.x - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"REDHAT_6_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"45", "item"=>
                      {
                        "description"=>"Red Hat Enterprise Linux 6.x - Minimal Install (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"REDHAT_6_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"45", "item"=>
                      {
                        "description"=>"Red Hat Enterprise Linux 5.x - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"REDHAT_5_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"45", "item"=>
                      {
                        "description"=>"Red Hat Enterprise Linux 5.x - Minimal Install (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"REDHAT_5_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Ubuntu Linux 14.04 LTS Trusty Tahr - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"UBUNTU_14_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Ubuntu Linux 14.04 LTS Trusty Tahr - Minimal Install (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"UBUNTU_14_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Ubuntu Linux 12.04 LTS Precise Pangolin - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"UBUNTU_12_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Ubuntu Linux 12.04 LTS Precise Pangolin - Minimal Install (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"UBUNTU_12_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Ubuntu Linux 10.04 LTS Lucid Lynx - Minimal Install (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"UBUNTU_10_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Ubuntu Linux 10.04 LTS Lucid Lynx - Minimal Install (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"UBUNTU_10_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Vyatta 6.6 Community Edition (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"VYATTACE_6.6R1_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Vyatta 6.5 Community Edition (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"VYATTACE_6.5R1_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"219", "item"=>
                      {
                        "description"=>"Vyatta 6.x Subscription Edition (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"VYATTASE_6.6R2_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".024", "recurringFee"=>"17", "item"=>
                      {
                        "description"=>"Windows Server 2012 Standard Edition (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2012-STD_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".18", "recurringFee"=>"125", "item"=>
                      {
                        "description"=>"Windows Server 2012 Datacenter Edition (64bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2012-DC_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".024", "recurringFee"=>"17", "item"=>
                      {
                        "description"=>"Windows Server 2008 Standard Edition SP2 (64bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-STD-SP2_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".024", "recurringFee"=>"17", "item"=>
                      {
                        "description"=>"Windows Server 2008 Standard Edition SP2 (32bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-STD-SP2_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".024", "recurringFee"=>"17", "item"=>
                      {
                        "description"=>"Windows Server 2008 Standard SP1 with R2 (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-STD-R2-SP1_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".024", "recurringFee"=>"17", "item"=>
                      {
                        "description"=>"Windows Server 2008 R2 Standard Edition (64bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-STD-R2_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".092", "recurringFee"=>"64", "item"=>
                      {
                        "description"=>"Windows Server 2008 Enterprise Edition SP2 (64bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-ENT-SP2_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".092", "recurringFee"=>"64", "item"=>
                      {
                        "description"=>"Windows Server 2008 Enterprise Edition SP2 (32bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-ENT-SP2_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".092", "recurringFee"=>"64", "item"=>
                      {
                        "description"=>"Windows Server 2008 R2 Enterprise Edition (64bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-ENT-R2_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".18", "recurringFee"=>"125", "item"=>
                      {
                        "description"=>"Windows Server 2008 Datacenter Edition SP2 (64bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-DC-SP2_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".18", "recurringFee"=>"125", "item"=>
                      {
                        "description"=>"Windows Server 2008 Datacenter Edition SP2 (32bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-DC-SP2_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".18", "recurringFee"=>"125", "item"=>
                      {
                        "description"=>"Windows Server 2008 R2 Datacenter Edition (64bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2008-DC-R2_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".024", "recurringFee"=>"17", "item"=>
                      {
                        "description"=>"Windows Server 2003 Standard SP2 with R2 (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2003-STD-SP2-5_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".024", "recurringFee"=>"17", "item"=>
                      {
                        "description"=>"Windows Server 2003 Standard SP2 with R2 (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2003-STD-SP2-5_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".092", "recurringFee"=>"64", "item"=>
                      {
                        "description"=>"Windows Server 2003 Enterprise SP2 with R2 (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2003-ENT-SP2-5_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".092", "recurringFee"=>"64", "item"=>
                      {
                        "description"=>"Windows Server 2003 Enterprise SP2 with R2 (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2003-ENT-SP2-5_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".18", "recurringFee"=>"125", "item"=>
                      {
                        "description"=>"Windows Server 2003 Datacenter SP2 with R2 (64 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2003-DC-SP2-1_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".18", "recurringFee"=>"125", "item"=>
                      {
                        "description"=>"Windows Server 2003 Datacenter SP2 with R2 (32 bit)"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"WIN_2003-DC-SP2-1_32"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Citrix XenServer 6.2"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"XENSERVER_6.2_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Citrix XenServer 6.1"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"XENSERVER_6.1_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Citrix XenServer 6.0.2"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"XENSERVER_6.0_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Citrix XenServer 5.6"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"XENSERVER_5.6_64"
                    }
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>"0", "recurringFee"=>"0", "item"=>
                      {
                        "description"=>"Citrix XenServer 5.5"
                      }
                    },
                  "template"=>
                    {
                      "operatingSystemReferenceCode"=>"XENSERVER_5.5_64"
                    }
                }
              ], "processors"=>
              [
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".3", "recurringFee"=>"199", "item"=>
                      {
                        "description"=>"2 x 2.0 GHz Core Bare Metal Instance - 8 GB Ram "
                      }
                    },
                  "template"=>
                    {
                      "memoryCapacity"=>8, "processorCoreAmount"=>2}
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".496", "recurringFee"=>"329", "item"=>
                      {
                        "description"=>"4 x 2.0 GHz Core Bare Metal Instance - 16 GB Ram"
                      }
                    },
                  "template"=>
                    {
                      "memoryCapacity"=>16, "processorCoreAmount"=>4}
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".571", "recurringFee"=>"379", "item"=>
                      {
                        "description"=>"8 x 2.0 GHz Core Bare Metal Instance - 8 GB Ram"
                      }
                    },
                  "template"=>
                    {
                      "memoryCapacity"=>8, "processorCoreAmount"=>8}
                },
                {
                  "itemPrice"=>
                    {
                      "hourlyRecurringFee"=>".692", "recurringFee"=>"459", "item"=>
                      {
                        "description"=>"16 x 2.0 GHz Core Bare Metal Instance - 16 GB Ram"
                      }
                    },
                  "template"=>
                    {
                      "memoryCapacity"=>16, "processorCoreAmount"=>16}
                }
              ]
          }
        end
      end
    end
  end
end
