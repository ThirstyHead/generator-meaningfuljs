'use strict';
var yeoman = require('yeoman-generator');
var gitConfig = require('git-config');
var lodash = require('lodash');
var fs = require('fs-extra');

var MeaningfulJsGenerator = yeoman.generators.Base.extend({
    // pointer to this generator (set in constructor)
    generator: undefined,

    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        yeoman.generators.Base.apply(this, arguments);

        // Set member variables
        this.generator = this;

        // Define arguments (e.g. yo meaningfuljs ______ )
        this.generator.argument('appName', {
            desc: 'The name of the app',
            required: false,
            type: String
        });
    },

    // Step #1
    // Your initialization methods (checking current project state, getting configs, etc)
    // See http://yeoman.io/authoring/running-context.html for info on all steps
    initializing: function() {
        // start blocking until this step is complete
        var done = this.generator.async();

        this.generator.log('');
        this.generator.log('===========================================');
        this.generator.log('Hi! Welcome to the MeaningfulJS generator.');
        this.generator.log('');
        this.generator.log('Your new project will be scaffolded out in the current directory:');
        this.generator.log(this.generator.destinationRoot());

        // check for arguments
        if(this.generator.appName){
            this.generator.config.set('appName', lodash.kebabCase(this.generator.appName));
        }

        // read in Git credentials from ~/.gitconfig
        gitConfig(function (err, config) {
            if(err){ return err; }

            var githubName = config.user.name || 'UNKNOWN GITHUB NAME';
            var githubEmail = config.user.email || 'UNKNOWN GITHUB EMAIL';
            var githubNameAndEmail = githubName + ' <' + githubEmail + '>';
            this.generator.config.set('githubName', githubName);
            this.generator.config.set('githubEmail', githubEmail);
            this.generator.config.set('githubNameAndEmail', githubNameAndEmail);

            // finish blocking for next step
            done();
        }.bind(this));

    },

    // Step #2
    // Where you prompt users for options (where you'd call this.prompt())
    prompting: function() {
        // start blocking until this step is complete
        var done = this.generator.async();

        var defaultAuthor = this.generator.config.get('githubNameAndEmail');
        this.generator.log('');
        this.generator.log('Current GitHub user:');
        this.generator.log(defaultAuthor);

        // appName was already set using 'yo meaningfuljs [appName]'
        if(this.generator.config.get('appName')){
            this.generator.log('');
            this.generator.log('Project name:');
            this.generator.log(this.generator.config.get('appName'));
        }

        this.generator.log('===========================================');
        this.generator.log('');

        var prompts = [
            {
                type: 'input',
                name: 'appName',
                message: 'What would you like to call your project?',
                default: this.appname, // defaults to current dir
                validate: function( value ) {
                    var valid = value && value.length > 0;
                    return valid || 'Please enter a name';
                },
                filter: function( val ) {
                    return lodash.kebabCase(val);
                }
            },
            {
                type: 'input',
                name: 'appDescription',
                message: 'How would you describe your project?',
                validate: function( value ) {
                    var valid = value && value.length > 0;
                    return valid || 'Please enter a short description';
                }
            },
            {
                type: 'input',
                name: 'appAuthor',
                message: 'What is your GitHub name <email>?',
                default: defaultAuthor,
                validate: function( value ) {
                    var valid = value && value.length > 0;
                    return valid || 'Please enter a your GitHub name <email>';
                }

            }
        ];

        // appName was already set using 'yo meaningfuljs [appName]'
        // remove the question
        if(this.generator.config.get('appName')){
            prompts.shift();
        }

        // write out answers to questions in .yo-rc.json
        this.generator.prompt(prompts, function(props) {
            // set if not already set using 'yo meaningfuljs [appName]'
            if(!this.generator.config.get('appName')){
                this.generator.config.set('appName', props.appName);
            }

            this.generator.config.set('appDescription', props.appDescription);
            this.generator.config.set('appAuthor', props.appAuthor);

            // finish blocking for next step
            done();
        }.bind(this));
    },

    // Step #3
    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
    configuring: function(){
        var gen = this.generator;

        // download / install oildex-seed into root directory
        var seedUrl = 'https://github.com/ThirstyHead/meaningfuljs.git';
        this.generator.bowerInstall([seedUrl], null, function(){
            fs.copySync('bower_components/meaningfuljs/', '.', null, function (err) {
                if(err) { return console.error(err); }
            });
            fs.emptyDir('bower_components', function (err) {
                if(err) { return console.error(err); }
            });

            // update package.json
            var packageJson = fs.readJsonSync('./package.json');
            packageJson.name = gen.config.get('appName');
            packageJson.description = gen.config.get('appDescription');
            packageJson.author = gen.config.get('githubNameAndEmail');
            fs.writeJsonSync('./package.json', packageJson);

            // update bower.json
            var bowerJson = fs.readJsonSync('./bower.json');
            bowerJson.name = gen.config.get('appName');
            bowerJson.description = gen.config.get('appDescription');
            bowerJson.author = gen.config.get('githubNameAndEmail');
            fs.writeJsonSync('./bower.json', bowerJson);
        });
    },

    // Step #4
    // Where you write the generator specific files (routes, controllers, etc)
    writing: function(){
        // nothing to do here, but I'm leaving it here as a placeholder.
    },

    // Step #5
    // Where installation are run (npm, bower)
    install: function(){
        this.npmInstall();

        // NOTE: no need to call bowerInstall here.
        //       this is called by the npm postinstall hook in
        //       package.json
        // this.bowerInstall();
    },

    // Step #6
    // Called last, cleanup, say good bye, etc
    end: function(){
        this.generator.log('');
        this.generator.log('===========================================');
        this.generator.log('You are now officially ready to rock.');
        this.generator.log('Have fun!');
        this.generator.log('');
        this.generator.log('Type "gulp" to see the available build commands.');
        this.generator.log('===========================================');
        this.generator.log('');
    }
});

module.exports = MeaningfulJsGenerator;
