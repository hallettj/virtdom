virtdom
=======

This was a demonstration for the February 2015 meeting of the Portland
JavaScript Admirers.  The exercise was to take a look at what goes on behind the
scenes in a virtual DOM implementation.


Building and running
--------------------

This project is built with gulp.  You will need to install the gulp command-line
tool, and the project dependencies.

    $ npm install -g gulp
	
	$ npm install

To build:

	$ gulp build

Start a local web server to serve index.html.  I use:

    $ python -m SimpleHTTPServer

In a web browser, open http://localhost:8000/index.html


License
-------

Apache License, Version 2.0

https://www.apache.org/licenses/LICENSE-2.0
