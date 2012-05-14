class CreateSlides < ActiveRecord::Migration
  def change
    create_table :slides do |t|
      t.integer :presentation_id
      t.integer :sequence, default: 0
      t.string :name
      t.string :image

      t.timestamps
    end
  end
end
