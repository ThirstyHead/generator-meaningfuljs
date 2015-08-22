# generator-meaningfuljs
A [Yeoman](http://yeoman.io/) generator for the MeaningfulJS [MEAN stack](https://en.wikipedia.org/wiki/MEAN_(software_bundle)) web framework.

MeaningfulJS is written and maintained by [Scott Davis](http://thirstyhead.com/contact.html), author of the IBM developerWorks article series [Mastering MEAN](http://www.ibm.com/developerworks/library/wa-mean1/index.html) and the O'Reilly video [Architecture of the MEAN Stack](http://shop.oreilly.com/product/0636920039495.do).

## Installation
Once you have [NodeJS](https://nodejs.org/download/) and [Yeoman](http://yeoman.io/) installed, you can install this generator with a quick:

```
$ npm install -g generator-meaningfuljs
```

## Usage
To scaffold out a new MeaningfulJS application, type the following and answer a few simple questions:

```
$ mkdir myapp
$ cd myapp
$ yo meaningfuljs

===========================================
Hi! Welcome to the MeaningfulJS generator.

Your new project will be scaffolded out in the current directory:
/Users/scott/myapp

Current GitHub user:
Scott Davis <scott@thirstyhead.com>
===========================================

? What would you like to call your project? myapp
? How would you describe your project? My cool MEAN app
? What is your GitHub name <email>? Scott Davis <scott@thirstyhead.com>
```
You can also type the appName to bypass the initial question:

```
$ yo meaningfuljs myapp
```



## Protip (Creating a shorter alias)
I'll be the first to admit that typing `yo meaningfuljs` is quite the typing exercise -- it makes my hands cramp up just thinking about it.

The following instructions assume you're using a BASH shell in OS X or Linux. Feel free to adjust them for Windows or other shells accordingly.

If you'd like to create a local *shorter* alias, first find out where all of your globally installed Node modules live:

```
$ which yo
/Users/scott/.nvm/v0.12.0/bin/yo
```

This won't give you the exact directory, but it'll get you in the right neighborhood. Since I'm using [NVM](https://github.com/creationix/nvm), my global modules are in `/Users/scott/.nvm/v0.12.0/lib/node_modules`.

If you're using an operating system that supports symlinks, type:

```
$ ln -s generator-meaningfuljs generator-m
```

Forever after, you can now type `yo m` instead of the more verbose `yo meaningfuljs`.



