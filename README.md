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

Building
--------

You may need to run the npm install command first to download the missing elements:

```npm install```

Next you should to build the library using the gulp tool. Use the command: 

```gulp build```.

Using in web browser mode
-------------------------

To use the library in web browser mode, simply copy the contents of the public_html directory anywhere. The index.html file is an example of usage.

Using in desktop mode
---------------------

Fast running desktop application:

```npm run start```

Compiling to executable file:

```npm run package```

Building installer:

```npm run make```

