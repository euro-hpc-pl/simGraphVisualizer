SimGraphVisualizer
======================================

__SimGraphVisualizer__ is a javascript library for visualizing and editing of Ising graphs.
Library uses the javascript programming language, so it works in browser and does not require powerful server.

Please note that this is a very early stage of library development, so unexpected errors may occur.

License
-------

SimGraphVisualizer is copyright by Dariusz Pojda <dpojda@iitis.pl> and is distributed under the Apache License 2.0.

Subdirectories
--------------

Here are some of the subdirectories and their contents:

* ```/``` holds some important project files, as license.txt, README, etc...

* ```/src``` holds the source files. The .js files are concatenated together to produce ```public_html/js/sgv.js```

* ```/public_html``` holds the html/php files for the example web site.

* ```/public_html/js``` holds the library file ```sgv.js``` and optionaly minimized ```sgv.min.js``` file.

Using
-----

To use the library, simply copy the contents of the public_html directory anywhere. The index.html file is an example of usage.

Building and testing
--------------------
You may need to run the npm install command first to download the missing elements.

After making changes to the code, you can build the library by running the script ```.\build.bat``` in Windows or using the gulp tool, using the command: ```gulp build```.

