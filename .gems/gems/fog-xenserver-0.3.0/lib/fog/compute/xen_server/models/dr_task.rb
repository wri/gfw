module Fog
  module Compute
    class XenServer
      module Models
        class DrTask < Model
          # API Reference here:
          # http://docs.vmd.citrix.com/XenServer/6.2.0/1.0/en_gb/api/?c=DR_task

          provider_class :DR_task
          collection_name :dr_tasks

          identity :reference

          attribute :uuid

          has_many_identities :introduced_srs,  :storage_repositories,  :aliases => :introduced_SRs, :as => :introduced_SRs
        end
      end
    end
  end
end