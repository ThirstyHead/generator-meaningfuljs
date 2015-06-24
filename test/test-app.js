'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var mockGenerator = require('yeoman-generator').test;
var os = require('os');

describe('GeneratorOildex:app', function () {
    var generatorPath = path.join(__dirname, '../generators/app');
    var destPath = path.join(os.tmpdir(), './generator-oildex-test/');

    before(function(){
        console.log('===================================');
        console.log('Generated files can be found here: ' + destPath);
        console.log('===================================');
    });

    it('creates base project config files', function(done) {
        runMockGenerator(done);
        assert.file(destPath + 'package.json');
        assert.file(destPath + 'bower.json');
    });


    function runMockGenerator(done, options, args, prompts){
        // set default options if not passed in
        if(!options){
            options = { 
                skipInstall: true 
            };
        }

        // set default args if not passed in
        if(!args){
            args = [];
        }


        // set default prompts if not passed in
        if(!prompts){
            prompts = { 
               'appType': 'Client-Side App',
               'appName': 'MyApp',
               'appDescription': 'This is my app',
               'appAuthor': 'Bubba <bubba@jones.com>'
            };
        }

        mockGenerator.run(generatorPath)
        .inDir(destPath)
        .withOptions(options)
        .withArguments(args)
        .withPrompts(prompts)
        .on('end', done);
    }
});