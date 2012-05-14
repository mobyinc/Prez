ActiveAdmin.register Slide do
  form(:html => { :multipart => true }) do |f|
    f.inputs 'Slide' do
      f.input :presentation
      f.input :name
      f.input :sequence
      f.input :image, as: :file
    end
    
    f.buttons
  end
  
  show do |slide|
    attributes_table do
      row :name
      row :sequence
      row :image do
        image_tag(slide.image.url)
      end
    end
    active_admin_comments
  end
end
