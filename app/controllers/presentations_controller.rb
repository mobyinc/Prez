class PresentationsController < ApplicationController
  before_filter :authenticate_admin_user!, only: [:present, :update_current_slide]
  
  def show
    find_presentation    
  end
  
  def present
    find_presentation
    @presenter = true
    
    render action: 'show'
  end
  
  def current_slide
    @presentation = Presentation.find(params[:id])
    render json: { current_slide: @presentation.slides[@presentation.current_slide].image.url }
  end

  def update_current_slide
    @presentation = Presentation.find(params[:id])

    @presentation.current_slide = (params[:current_slide].to_i - 1)
    @presentation.save
    
    render json: {}    
  end
  
  def find_presentation
    @presentation = Presentation.find_by_url_slug(params[:slug])
    
    if @presentation
      @images = []
    
      @presentation.slides.order(:sequence).each do |s|
        @images << s.image
      end
    else
      @error = "Oops, there is no presentation at this url"
    end
  end
end
