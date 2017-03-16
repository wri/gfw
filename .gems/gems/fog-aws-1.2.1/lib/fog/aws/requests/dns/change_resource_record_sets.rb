module Fog
  module DNS
    class AWS

      def self.hosted_zone_for_alias_target(dns_name)
        hosted_zones = if dns_name.match(/^dualstack\./)
          elb_dualstack_hosted_zone_mapping
        else
          elb_hosted_zone_mapping
        end

        Hash[hosted_zones.select { |k, _|
          dns_name =~ /\A.+\.#{k}\.elb\.amazonaws\.com\.?\z/
        }].values.last
      end

      def self.elb_hosted_zone_mapping
        @elb_hosted_zone_mapping ||= {
          "ap-northeast-1" => "Z2YN17T5R711GT",
          "ap-southeast-1" => "Z1WI8VXHPB1R38",
          "ap-southeast-2" => "Z2999QAZ9SRTIC",
          "eu-west-1"      => "Z3NF1Z3NOM5OY2",
          "eu-central-1"   => "Z215JYRZR1TBD5",
          "sa-east-1"      => "Z2ES78Y61JGQKS",
          "us-east-1"      => "Z3DZXE0Q79N41H",
          "us-west-1"      => "Z1M58G0W56PQJA",
          "us-west-2"      => "Z33MTJ483KN6FU",
        }
      end

      # See https://forums.aws.amazon.com/message.jspa?messageID=612414
      # Note: Oddly, to update this list, I have had to revert to going to
      #       dev console at https://console.aws.amazon.com/route53/home, then using
      #       search all sources for Z14GRHDCWA56QT to find this in a HashMap
      def self.elb_dualstack_hosted_zone_mapping
        @elb_dualstack_hosted_zone_mapping ||= {
          "ap-northeast-1" => "Z14GRHDCWA56QT",
          "ap-northeast-2" => "ZWKZPGTI48KDX",
          "ap-south-1" => "ZP97RAFLXTNZK",
          "ap-southeast-1" => "Z1LMS91P8CMLE5",
          "ap-southeast-2" => "Z1GM3OXH4ZPM65",
          "ca-central-1" => "ZQSVJUPU6J1EY",
          "eu-central-1" => "Z215JYRZR1TBD5",
          "eu-west-1" => "Z32O12XQLNTSW2",
          "eu-west-2" => "ZHURV8PSTC4K8",
          "us-east-1" => "Z35SXDOTRQ7X7K",
          "us-east-2" => "Z3AADJGX6KTTL2",
          "us-west-1" => "Z368ELLRRE2KJ0",
          "us-west-2" => "Z1H1FL5HABSF5",
          "sa-east-1" => "Z2P70J7HTTTPLU",
        }
      end

      # Returns the xml request for a given changeset
      def self.change_resource_record_sets_data(zone_id, change_batch, version, options = {})
        # AWS methods return zone_ids that looks like '/hostedzone/id'.  Let the caller either use
        # that form or just the actual id (which is what this request needs)
        zone_id = zone_id.sub('/hostedzone/', '')

        optional_tags = ''
        options.each do |option, value|
          case option
          when :comment
            optional_tags += "<Comment>#{value}</Comment>"
          end
        end

        #build XML
        if change_batch.count > 0

          changes = "<ChangeBatch>#{optional_tags}<Changes>"

          change_batch.each do |change_item|
            action_tag = %Q{<Action>#{change_item[:action]}</Action>}
            name_tag   = %Q{<Name>#{change_item[:name]}</Name>}
            type_tag   = %Q{<Type>#{change_item[:type]}</Type>}

            # TTL must be omitted if using an alias record
            ttl_tag = ''
            ttl_tag += %Q{<TTL>#{change_item[:ttl]}</TTL>} unless change_item[:alias_target]

            weight_tag = ''
            set_identifier_tag = ''
            region_tag = ''
            if change_item[:set_identifier]
              set_identifier_tag += %Q{<SetIdentifier>#{change_item[:set_identifier]}</SetIdentifier>}
              if change_item[:weight] # Weighted Record
                weight_tag += %Q{<Weight>#{change_item[:weight]}</Weight>}
              elsif change_item[:region] # Latency record
                region_tag += %Q{<Region>#{change_item[:region]}</Region>}
              end
            end

            failover_tag = if change_item[:failover]
                             %Q{<Failover>#{change_item[:failover]}</Failover>}
                           end

            geolocation_tag = if change_item[:geo_location]
                                xml_geo = change_item[:geo_location].map { |k,v| "<#{k}>#{v}</#{k}>" }.join
                                %Q{<GeoLocation>#{xml_geo}</GeoLocation>}
                              end

            resource_records = change_item[:resource_records] || []
            resource_record_tags = ''
            resource_records.each do |record|
              resource_record_tags += %Q{<ResourceRecord><Value>#{record}</Value></ResourceRecord>}
            end

            # ResourceRecords must be omitted if using an alias record
            resource_tag = ''
            resource_tag += %Q{<ResourceRecords>#{resource_record_tags}</ResourceRecords>} if resource_records.any?

            alias_target_tag = ''
            if change_item[:alias_target]
              # Accept either underscore or camel case for hash keys.
              dns_name = change_item[:alias_target][:dns_name] || change_item[:alias_target][:DNSName]
              hosted_zone_id = change_item[:alias_target][:hosted_zone_id] || change_item[:alias_target][:HostedZoneId] || AWS.hosted_zone_for_alias_target(dns_name)
              evaluate_target_health = change_item[:alias_target][:evaluate_target_health] || change_item[:alias_target][:EvaluateTargetHealth] || false
              evaluate_target_health_xml = !evaluate_target_health.nil? ? %Q{<EvaluateTargetHealth>#{evaluate_target_health}</EvaluateTargetHealth>} : ''
              alias_target_tag += %Q{<AliasTarget><HostedZoneId>#{hosted_zone_id}</HostedZoneId><DNSName>#{dns_name}</DNSName>#{evaluate_target_health_xml}</AliasTarget>}
            end

            health_check_id_tag = if change_item[:health_check_id]
                                    %Q{<HealthCheckId>#{change_item[:health_check_id]}</HealthCheckId>}
                                  end

            change_tags = %Q{<Change>#{action_tag}<ResourceRecordSet>#{name_tag}#{type_tag}#{set_identifier_tag}#{weight_tag}#{region_tag}#{failover_tag}#{geolocation_tag}#{ttl_tag}#{resource_tag}#{alias_target_tag}#{health_check_id_tag}</ResourceRecordSet></Change>}
            changes += change_tags
          end

          changes += '</Changes></ChangeBatch>'
        end

        %Q{<?xml version="1.0" encoding="UTF-8"?><ChangeResourceRecordSetsRequest xmlns="https://route53.amazonaws.com/doc/#{version}/">#{changes}</ChangeResourceRecordSetsRequest>}
      end

      class Real
        require 'fog/aws/parsers/dns/change_resource_record_sets'

        # Use this action to create or change your authoritative DNS information for a zone
        # http://docs.amazonwebservices.com/Route53/latest/DeveloperGuide/RRSchanges.html#RRSchanges_API
        #
        # ==== Parameters
        # * zone_id<~String> - ID of the zone these changes apply to
        # * options<~Hash>
        #   * comment<~String> - Any comments you want to include about the change.
        # * change_batch<~Array> - The information for a change request
        #   * changes<~Hash> -
        #     * action<~String> - 'CREATE' or 'DELETE'
        #     * name<~String>   - This must be a fully-specified name, ending with a final period
        #     * type<~String>   - A | AAAA | CNAME | MX | NS | PTR | SOA | SPF | SRV | TXT
        #     * ttl<~Integer>   - Time-to-live value - omit if using an alias record
        #     * weight<~Integer>   - Time-to-live value - omit if using an alias record
        #     * set_identifier<~String> - An identifier that differentiates among multiple resource record sets that have the same combination of DNS name and type.
        #     * region<~String> - The Amazon EC2 region where the resource that is specified in this resource record set resides.  (Latency only)
        #     * failover<~String> - To configure failover, you add the Failover element to two resource record sets. For one resource record set, you specify PRIMARY as the value for Failover; for the other resource record set, you specify SECONDARY.
        #     * geo_location<~String XML> - A complex type currently requiring XML that lets you control how Amazon Route 53 responds to DNS queries based on the geographic origin of the query.
        #     * health_check_id<~String> - If you want Amazon Route 53 to return this resource record set in response to a DNS query only when a health check is passing, include the HealthCheckId element and specify the ID of the applicable health check.
        #     * resource_records<~Array> - Omit if using an alias record
        #     * alias_target<~Hash> - Information about the domain to which you are redirecting traffic (Alias record sets only)
        #       * dns_name<~String> - The Elastic Load Balancing domain to which you want to reroute traffic
        #       * hosted_zone_id<~String> - The ID of the hosted zone that contains the Elastic Load Balancing domain to which you want to reroute traffic
        #       * evaluate_target_health<~Boolean> - Applies only to alias, weighted alias, latency alias, and failover alias resource record sets: If you set the value of EvaluateTargetHealth to true, the alias resource record sets inherit the health of the referenced resource record sets.
        # ==== Returns
        # * response<~Excon::Response>:
        #   * body<~Hash>:
        #     * 'ChangeInfo'<~Hash>
        #       * 'Id'<~String> - The ID of the request
        #       * 'Status'<~String> - status of the request - PENDING | INSYNC
        #       * 'SubmittedAt'<~String> - The date and time the change was made
        #   * status<~Integer> - 200 when successful
        #
        # ==== Examples
        #
        # Example changing a CNAME record:
        #
        #     change_batch_options = [
        #       {
        #         :action => "DELETE",
        #         :name => "foo.example.com.",
        #         :type => "CNAME",
        #         :ttl => 3600,
        #         :resource_records => [ "baz.example.com." ]
        #       },
        #       {
        #         :action => "CREATE",
        #         :name => "foo.example.com.",
        #         :type => "CNAME",
        #         :ttl => 3600,
        #         :resource_records => [ "bar.example.com." ]
        #       }
        #     ]
        #
        #     change_resource_record_sets("ABCDEFGHIJKLMN", change_batch_options)
        #
        def change_resource_record_sets(zone_id, change_batch, options = {})
          body = AWS.change_resource_record_sets_data(zone_id, change_batch, @version, options)
          request({
            :body       => body,
            :idempotent => true,
            :parser     => Fog::Parsers::DNS::AWS::ChangeResourceRecordSets.new,
            :expects    => 200,
            :method     => 'POST',
            :path       => "hostedzone/#{zone_id}/rrset"
          })
        end
      end

      class Mock

        SET_PREFIX = 'SET_'

        def record_exist?(zone,change,change_name)
          return false if zone[:records][change[:type]].nil?
          current_records = zone[:records][change[:type]][change_name]
          return false if current_records.nil?

          if !change[:set_identifier].empty?
            !current_records[change[:SetIdentifier]].nil?
          else
            !current_records.empty?
          end
        end

        def change_resource_record_sets(zone_id, change_batch, options = {})
          response = Excon::Response.new
          errors   = []


          if (zone = self.data[:zones][zone_id])
            response.status = 200

            change_id = Fog::AWS::Mock.change_id
            change_batch.each do |change|

              change_name = change[:name]
              change_name = change_name + "." unless change_name.end_with?(".")

              case change[:action]
              when "CREATE"
                if zone[:records][change[:type]].nil?
                  zone[:records][change[:type]] = {}
                end

                if !record_exist?(zone, change, change_name)
                  # raise change.to_s if change[:resource_records].nil?
                  new_record =
                    if change[:alias_target]
                      record = {
                        :alias_target => change[:alias_target]
                      }
                    else
                      record = {
                        :ttl => change[:ttl].to_s,
                      }
                    end

                  new_record = {
                    :change_id        => change_id,
                    :resource_records => change[:resource_records] || [],
                    :name             => change_name,
                    :type             => change[:type],
                    :set_identifier   => change[:set_identifier],
                    :weight           => change[:weight]
                  }.merge(record)

                  if change[:set_identifier].nil?
                    zone[:records][change[:type]][change_name] = new_record
                  else
                    zone[:records][change[:type]][change_name] = {} if zone[:records][change[:type]][change_name].nil?
                    zone[:records][change[:type]][change_name][SET_PREFIX + change[:set_identifier]] = new_record
                  end
                else
                  errors << "Tried to create resource record set #{change[:name]}. type #{change[:type]}, but it already exists"
                end
              when "DELETE"
                action_performed = false
                if !zone[:records][change[:type]].nil? && !zone[:records][change[:type]][change_name].nil? && !change[:set_identifier].nil?
                  action_performed = true unless zone[:records][change[:type]][change_name].delete(SET_PREFIX + change[:set_identifier]).nil?
                  zone[:records][change[:type]].delete(change_name) if zone[:records][change[:type]][change_name].empty?
                elsif !zone[:records][change[:type]].nil?
                  action_performed = true unless zone[:records][change[:type]].delete(change_name).nil?
                end

                if !action_performed
                  errors << "Tried to delete resource record set #{change[:name]}. type #{change[:type]}, but it was not found"
                end
              end
            end

            if errors.empty?
              change = {
                :id           => change_id,
                :status       => 'PENDING',
                :submitted_at => Time.now.utc.iso8601
              }
              self.data[:changes][change[:id]] = change
              response.body = {
                'Id'          => change[:id],
                'Status'      => change[:status],
                'SubmittedAt' => change[:submitted_at]
              }
              response
            else
              raise Fog::DNS::AWS::Error.new("InvalidChangeBatch => #{errors.join(", ")}")
            end
          else
            raise Fog::DNS::AWS::NotFound.new("NoSuchHostedZone => A hosted zone with the specified hosted zone ID does not exist.")
          end
        end
      end
    end
  end
end
