class CreatePresentations < ActiveRecord::Migration
  def change
    create_table :presentations do |t|      
      t.string :title
      t.string :url_slug
      t.text :description
      t.integer :current_slide, default: 0

      t.timestamps
    end
  end
end
