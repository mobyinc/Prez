##
# CarrierWave Amazon S3 File Reprocessor Rake Task
#
# Written (specifically) for:
# - CarrierWave
# - Ruby on Rails 3
# - Amazon S3
#
# Works with:
# - Any server of which you have write-permissions in the Rails.root/tmp directory
# - Works with Heroku
#
# Not tested with, but might work with:
# - Ruby on Rails 2 
#
# Might work with, after a couple of tweaks:
# - File System Storage
# - Cloud Files Storage
# - GridFS
#
# Examples:
#
# Reprocess all versions of User#avatar
#  rake carrierwave:reprocess class=User mounted_uploader=avatar
#
# Reprocess the versions: thumb, small, medium for User#avatar
#  rake carrierwave:reprocess class=User mounted_uploader=avatar versions='thumb, small, medium'
#
# Reprocess for an underlying association, for things like Embedded MongoDB Documents
# which are models you cannot access directly, but rather through a regular Document
#
# Embeds One (picture) Association
#  rake carrierwave:reprocess class=User association=picture mounted_uploader=image versions='thumb, small, medium'
#
# Embeds Many (pictures) Association
#  rake carrierwave:reprocess class=User association=pictures mounted_uploader=image versions='thumb, small, medium'
#
# WARNING
# There is an issue with "Rake", that you cannot name your mounted_uploader "file".
# If you do this, then you will not be able to reprocess images through this rake task
#  class User
#    include Mongoid::Document
#    mount_uploader :file, PictureUploader
#  end
#
# This will NOT work with reprocessing through Rake because the mounted_uploader uses the "file" attribute.

namespace :carrierwave do
  
  ##
  # Only tested with Amazon S3 Storage
  # Needs some minor modifications if you want to use this for File System Store, Cloud Files and GridFS probably.
  # This should work without Ruby on Rails as well, just set a different TMP_PATH.
  desc "Reprocesses Carrier Wave file versions of a given model."
  task :reprocess => :environment do

    ##
    # Load in the OPEN URI library to be able
    # to pull down and store the original file in a temp directory
    require 'open-uri'
    
    ##
    # Default constants
    TMP_PATH          = "#{Rails.root}/tmp/carrierwave"
    
    ##
    # Set environment constants
    CLASS             = ENV['class'].capitalize
    ASSOCIATION       = ENV['association'] || nil
    MOUNTED_UPLOADER  = ENV['mounted_uploader'].to_sym
    VERSIONS          = ENV['versions'].nil? ? Array.new : ENV['versions'].split(',').map {|version| version.strip.to_sym}

    ##
    # Find the Model
    MODEL = Kernel.const_get(CLASS)
        
    ##
    # Create the temp directory
    %x(mkdir -p "#{TMP_PATH}")

    ##
    # Find all records for the provided Model
    records = MODEL.all
    
    ##
    # Output to console
    puts "\nCarrier Wave Version Reprocessing!"
    puts "======================================="
    puts "Model:              #{CLASS}"
    puts "Mounted Uploader:   #{MOUNTED_UPLOADER}"
    puts "Association:        #{ASSOCIATION}" if ASSOCIATION
    puts "Versions:           #{VERSIONS.empty? ? "all" : VERSIONS.join(', ')}\n\n"
    
    ##
    # Run through all records
    records.each do |record|
      
      ##
      # Set the mounted uploader object
      # If it has a one-to-one association (singular) then that object
      # will be returned and wrapped in an array so we can "iterate" through it below.
      # 
      # If it has a one-to-many association then it will return the array of associated objects
      #
      # If no association is specified, it assumes the amounted uploader is attached to the specified CLASS 
      if ASSOCIATION
        if ASSOCIATION.singular?
          objects = [record.send(ASSOCIATION)]
        else
          objects = record.send(ASSOCIATION)        
        end
      else
        objects = [record]
      end
      
      ##
      # Iterates through the objects
      objects.each do |object|
        
        ##
        # Returns the mounted uploader object
        mounted_object = object.send(MOUNTED_UPLOADER)
      
        ##
        # Retrieve Filename
        filename = mounted_object.path.split('/').last
      
        ##
        # Output to console
        puts "Reprocessing: #{filename}"
      
        ##
        # Read out the original file from the remote location
        # and write it out to the temp directory (TMP_PATH)
        # This file will be used as the base file to reprocess
        # the versions. Once all versions have been processed,
        # this temp file will be directly removed.
	open(mounted_object.url) do |original_object|
	  File.open(File.join(TMP_PATH, filename), 'w') do |temp_file|
	    temp_file.binmode # Added this
	    temp_file.write(original_object.read)
	  end
	end
        
        ##
        # By default it will add all available versions to the versions variable
        # which means that all available versions will be reprocessed.
        # If the "versions" argument has been provided, then only the specified
        # version(s) will be set to the versions variable, and thus, only these
        # will be reprocessed.
        versions = mounted_object.versions.map {|version| version[0]}
        versions = VERSIONS unless VERSIONS.empty?
      
        ##
        # Reprocesses the versions
        versions.each do |version|
          mounted_object.send(version).cache!(File.open(File.join(TMP_PATH, filename)))
          mounted_object.send(version).store!
        end

        ##
        # Removes the temp file
        %x(rm "#{TMP_PATH}/#{filename}")
      end
    end
  end
end