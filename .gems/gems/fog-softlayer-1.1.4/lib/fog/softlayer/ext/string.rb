## some helpers for some dirty work
class String
  def softlayer_camelize
    self.split('_').inject([]){ |buffer,e| buffer.push(buffer.empty? ? e : e.capitalize) }.join
  end

  def fix_convention_exceptions
    # SLAPI WHY U No Follow Own Convention!?
    self.gsub!(/ipaddress/i, 'IpAddress')
    self.gsub!(/loadbalancer/i, 'LoadBalancer')
  end

  def softlayer_underscore
    self.gsub(/::/, '/').
        gsub(/([A-Z]+)([A-Z][a-z])/,'\1_\2').
        gsub(/([a-z\d])([A-Z])/,'\1_\2').
        tr("-", "_").
        downcase
  end
end