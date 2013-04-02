require 'fileutils'

# Warning: The following deploy task will completely overwrite whatever is currently deployed to Heroku.
# The deploy branch is rebased onto master, so the push needs to be forced.

desc "Deploy app to Heroku after precompiling assets"
task :deploy do
  deploy_branch   = 'master'
  remote          = ENV['DEPLOY_TO'] || 'staging'
  deploy_repo_dir = "tmp/heroku_deploy"

  begin
    # Check branch and working directory. Fail if not on clean master branch.
    branch = `branch_name=$(git symbolic-ref HEAD 2>/dev/null); branch_name=${branch_name##refs/heads/}; echo ${branch_name:-HEAD}`.strip
    if branch != 'master'
      raise "You have checked out the #{branch} branch, please only deploy from the master branch!"
    end
    if `git status --porcelain`.present?
      raise "You have unstaged or uncommitted changes! Please only deploy from a clean working directory!"
    end

    unless File.exists? deploy_repo_dir
      # Copy repo to tmp dir so we can continue working while it deploys
      @new_repo = true
      puts "Copying repo to #{deploy_repo_dir}..."
      # Can't copy into self, so copy to /tmp first
      #FileUtils.cp_r Rails.root.to_s, "/tmp/heroku_deploy"
      #FileUtils.mv "/tmp/heroku_deploy", Rails.root.join('tmp')
      `sudo cp -r #{Rails.root.to_s} /tmp/heroku_deploy`
      `sudo mv /tmp/heroku_deploy #{Rails.root.join('tmp')}`
      %x{sudo chown -R `whoami` #{Rails.root.join('tmp')}}
    end

    # Change working directory to copied repo
    Dir.chdir(deploy_repo_dir)

    # Create new deploy branch if starting with a fresh repo
    if @new_repo
      # Set remote to parent git dir, so we can fetch updates on future deploys
      system "git remote set-url origin ../.."
      system "git checkout -b #{deploy_branch}"

      # Allow git to see public/assets
      puts "Removing public/assets from .gitignore..."
      system %q{sed -i -e '/public\/assets/d' .gitignore}
      system 'git add .gitignore; git commit -m "Allow git to commit public/assets"'
    else
      # Otherwise, we're already on the deploy branch, so fetch any new changes from original repo
      system "git fetch origin"

      # Rebase onto origin/master.
      # This step should never fail, because we are rebasing commits for files
      # that should be ignored by the master repo.
      unless system "git rebase origin/master"
        raise "Rebase Failed! Please delete tmp/heroku_deploy and start again."
      end
    end

    # Precompile assets
    Rake::Task['assets:precompile'].invoke

    # Add any extra tasks you want to run here, such as compiling static pages, etc.


    # Add all changes and new files
    system 'git add -A'

    commit_message = "Added precompiled assets"

    if @new_repo
      # Create new commit for new repo
      system "git commit -m '#{commit_message}'"#, :out => "/dev/null"
    else
      # If existing repo, amend previous assets commit
      system "git commit --amend -m '#{commit_message}'"#, :out => "/dev/null"
    end
    puts "Commit: #{commit_message}"


    # Force push deploy branch to Heroku
    puts "Pushing #{deploy_branch} branch to master on #{remote}..."
    IO.popen("git push #{remote} #{deploy_branch}:master -f") do |io|
      while (line = io.gets) do
        puts line
      end
    end
  end
end
