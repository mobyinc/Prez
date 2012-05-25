class Presentation < ActiveRecord::Base
  has_many :slides, :order => 'sequence'
  
end
