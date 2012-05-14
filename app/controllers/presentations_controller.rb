class PresentationsController < ApplicationController
  
  def show
    @presentation = Presentation.find_by_url_slug(params[:slug])

    @images = []
    
    @presentation.slides.each do |s|
      @images << s.image
    end
  end
  
  def current_slide
    @presentation = Presentation.find(params[:id])
    render json: { current_slide: @presentation.current_slide + 1 }
  end

  def update_current_slide
    @presentation = Presentation.find(params[:id])

    @presentation.current_slide = params[:current_slide]
    
    render json: {}    
  end
end
