  # coding: UTF-8
class Object
  def needsQuotes?
    return false unless self

    case self
    when ::String
      true
    when ::Date, ::DateTime, ::Time
      true
    else
      false
    end
  end
end