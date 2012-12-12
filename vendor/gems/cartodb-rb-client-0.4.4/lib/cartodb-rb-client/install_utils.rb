module InstallUtils
  def postgresql_installed?

    return false unless system 'which pg_config > /dev/null'

    pg_config_file = %x[cat `which pg_config`]
    pgconfig_dirs_keys = %w(BINDIR INCLUDEDIR PKGINCLUDEDIR INCLUDEDIR-SERVER LIBDIR PKGLIBDIR SHAREDIR PGXS)

    dirs_to_check = Hash[*%x[`which pg_config`].split("\n").map{|o| o.split(' = ')}.select{|o| pgconfig_dirs_keys.include?(o.first)}.flatten]

    if dirs_to_check.keys.count == pgconfig_dirs_keys.count
      return dirs_to_check.values.inject(true){|exists, dir| exists && File.exists?(dir)}
    end

    false
  end
end

include InstallUtils
