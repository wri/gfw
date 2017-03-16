module Inflecto
  # A singleton instance of this class is yielded by Inflecto.inflections, which can then be used to specify additional
  # inflection rules. Examples:
  #
  #   Inflecto.inflections do |inflect|
  #     inflect.plural /^(ox)$/i, '\1\2en'
  #     inflect.singular /^(ox)en/i, '\1'
  #
  #     inflect.irregular 'octopus', 'octopi'
  #
  #     inflect.uncountable "equipment"
  #   end
  #
  # New rules are added at the top. So in the example above, the irregular rule for octopus will now be the first of the
  # pluralization and singularization rules that is runs. This guarantees that your rules run before any of the rules that may
  # already have been loaded.
  #
  class Inflections

    # Return instance
    #
    # @return [Inflections]
    #
    # @api private
    #
    def self.instance
      @__instance__ ||= new
    end

    # Return plurals
    #
    # @return [Array]
    #
    # @api private
    #
    attr_reader :plurals
    
    # Return singulars
    #
    # @return [Array]
    #
    # @api private
    #
    attr_reader :singulars
    
    # Return uncountables
    #
    # @return [Array]
    #
    # @api private
    #
    attr_reader :uncountables
    
    # Return humans
    #
    # @return [Array]
    #
    # @api private
    #
    #
    attr_reader :humans

    # Initialize object
    #
    # @return [undefined]
    #
    # @api private
    #
    def initialize
      @plurals, @singulars, @uncountables, @humans = [], [], [], []
    end

    # Add a new plural role
    #
    # Specifies a new pluralization rule and its replacement. The rule can either be a string or a regular expression.
    # The replacement should always be a string that may include references to the matched data from the rule.
    #
    # @param [String, Regexp] rule
    # @param [String, Regexp] replacement
    #
    # @return [self]
    #
    # @api private
    #
    def plural(rule, replacement)
      @uncountables.delete(rule) if rule.is_a?(String)
      @uncountables.delete(replacement)
      @plurals.insert(0, [rule, replacement])
      self
    end

    # Add a new singular rule
    #
    # Specifies a new singularization rule and its replacement. The rule can either be a string or a regular expression.
    # The replacement should always be a string that may include references to the matched data from the rule.
    #
    # @param [String, Regexp] rule
    # @param [String, Regexp] replacement
    #
    # @return [self]
    #
    # @api private
    #
    def singular(rule, replacement)
      @uncountables.delete(rule) if rule.is_a?(String)
      @uncountables.delete(replacement)
      @singulars.insert(0, [rule, replacement])
      self
    end

    # Add a new irregular pluralization
    #
    # Specifies a new irregular that applies to both pluralization and singularization at the same time. This can only be used
    # for strings, not regular expressions. You simply pass the irregular in singular and plural form.
    #
    # @example
    #
    #   Inflecto.irregular('octopus', 'octopi')
    #   Inflecto.irregular('person', 'people')
    #
    # @param [String] singular
    # @param [String] plural
    #
    # @return [self]
    #
    # @api private
    #
    def irregular(singular, plural)
      @uncountables.delete(singular)
      @uncountables.delete(plural)

      if singular[0,1].upcase == plural[0,1].upcase
        plural(Regexp.new("(#{singular[0,1]})#{singular[1..-1]}$", "i"), '\1' + plural[1..-1])
        plural(Regexp.new("(#{plural[0,1]})#{plural[1..-1]}$", "i"), '\1' + plural[1..-1])
        singular(Regexp.new("(#{plural[0,1]})#{plural[1..-1]}$", "i"), '\1' + singular[1..-1])
      else
        plural(Regexp.new("#{singular[0,1].upcase}(?i)#{singular[1..-1]}$"), plural[0,1].upcase + plural[1..-1])
        plural(Regexp.new("#{singular[0,1].downcase}(?i)#{singular[1..-1]}$"), plural[0,1].downcase + plural[1..-1])
        plural(Regexp.new("#{plural[0,1].upcase}(?i)#{plural[1..-1]}$"), plural[0,1].upcase + plural[1..-1])
        plural(Regexp.new("#{plural[0,1].downcase}(?i)#{plural[1..-1]}$"), plural[0,1].downcase + plural[1..-1])
        singular(Regexp.new("#{plural[0,1].upcase}(?i)#{plural[1..-1]}$"), singular[0,1].upcase + singular[1..-1])
        singular(Regexp.new("#{plural[0,1].downcase}(?i)#{plural[1..-1]}$"), singular[0,1].downcase + singular[1..-1])
      end
      self
    end

    # Add uncountable words 
    #
    # Uncountable will not be inflected
    #
    # @example
    #
    #   Inflecto.uncountable "money"
    #   Inflecto.uncountable "money", "information"
    #   Inflecto.uncountable %w( money information rice )
    #
    # @param [Enumerable<String>] words
    #
    # @return [self]
    #
    # @api private
    #
    def uncountable(words)
      @uncountables.concat(words)
      self
    end

    # Add humanize rule
    #
    # Specifies a humanized form of a string by a regular expression rule or by a string mapping.
    # When using a regular expression based replacement, the normal humanize formatting is called after the replacement.
    # When a string is used, the human form should be specified as desired (example: 'The name', not 'the_name')
    #
    # @example
    #   Inflecto.human(/_cnt$/i, '\1_count')
    #   Inflecto.human("legacy_col_person_name", "Name")
    #
    # @param [String, Regexp] rule
    # @param [String, Regexp] replacement
    #
    # @api private
    #
    # @return [self]
    #
    def human(rule, replacement)
      @humans.insert(0, [rule, replacement])
      self
    end

    # Clear all inflection rules
    #
    # @example
    #
    #   Inflecto.clear
    #
    # @return [self]
    #
    # @api private
    #
    def clear
      initialize
      self
    end

  end
end
