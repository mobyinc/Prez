class Slide < ActiveRecord::Base
  belongs_to :presentation
  
  mount_uploader :image, SlideImageUploader
end
