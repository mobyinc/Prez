class Slide < ActiveRecord::Base
  belongs_to :presentation  

  mount_uploader :image, SlideImageUploader

  acts_as_list :scope => :presentation, :column => :sequence
  
  
end
