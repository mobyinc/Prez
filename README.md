# Prez

Take control of remote presentations.

## The Problem

Have you ever had to give a presentation remotely over the phone before? If you distribute a document (Keynote, Powerpoint, etc) people always skip ahead and get distracted. If you do a screenshare, the lovely images you spent hours creating are mangled by compression and there are always complications with coordinating the screencast.

## How it Works

Prez allows you to quickly create a slide deck by uploading a series of images. Once your slides are up, simply give the presentation url to your audience. When an audience member follows the url, they will see the current slide.

As the presenter, you can login and navigate the presentation and the current slide will update automatically for the audience.

No more audience members skipping ahead.  No more crummy screencasts.

## Features

The project is pretty basic and currently only includes the base features we required for our purposes. We'll gladly pull and good enhancements.  The current features include:

* Heroku compatible rails 3.2 for easy one-off deploy
* Admin area for management of presentations and users
* Each presentation can have a custom url slug
* Login required to conrol presentations
* Ajax loading of images for better performance with a large number of slides
* Works on mobile devices (iPhone, iPad, etc)

## Getting Started

We recommend Heroku free hosting, so that's what we're going to cover here, but you can use any Rails hosting. Prez has been tested on Rails 3.2 / Ruby 1.9.3, and it will likely work on other versions.

The following steps should get you up and running:

* Signup and/or setup a new Heroku app
* Checkout a local copy of the source
* Add the Heroku remote repo
* Push to Heroku
* Migrate and seed the database

You should be able to visit the Heroku url for your app and it should say:

"Oops, there is no presentation at this url"

Now navigate to:

```ruby
http://mycleverappname.herokuapp.com/admin
```

Login with admin@admin.com and use 'password' as the password.

From here, you can add more users, change your password, or add your first presentation fairly intuatively. Prez uses the excellent [Active Admin](https://github.com/gregbell/active_admin). If you've ever used that, you'll feel right at home.

## Presenting

Your presentations are viewable at:

```ruby
http://mycleverappname.heroku.com/presentation_slug/
```

...and you can control them from:

```ruby
http://mycleverappname.heroku.com/presentation_slug/present
```

... which will require you to login.

That's it!

## License

Copyright (c) 2012 Moby, Inc.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.