'use strict';
var yeoman = require('yeoman-generator');
var lodash = require('lodash');
var fs = require('fs-extra');
var lodash = require('lodash');
var grasp = require('grasp');
var cheerio = require('cheerio');

var MeaningfulJsGenerator = yeoman.generators.Base.extend({
    // pointer to this generator (set in constructor)
    generator: undefined,
    dir: {},
    values: {},

    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        yeoman.generators.Base.apply(this, arguments);

        // Set member variables
        this.generator = this;

        // set various directories
        this.dir.templates = 'src/templates';
        this.dir.components = 'src/client/components';
        this.dir.app = 'src/client/app';

        // Define arguments (e.g. yo meaningfuljs ______ )
        this.generator.argument('cName', {
            desc: 'The name of the component',
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
        this.generator.log('Your new component can be found here:');
        this.generator.log(this.generator.destinationPath(this.dir.components));

        // check for arguments
        if(this.generator.cName){
            this.generator.values.cName = lodash.kebabCase(this.generator.cName);
        }

        // finish blocking for next step
        done();
    },

    // Step #2
    // Where you prompt users for options (where you'd call this.prompt())
    prompting: function() {
        // start blocking until this step is complete
        var done = this.generator.async();

        // appName was already set using 'yo oildex:component [cName]'
        if(this.generator.values.cName){
            this.generator.log('');
            this.generator.log('Component name:');
            this.generator.log(this.generator.values.cName);
        }

        this.generator.log('===========================================');
        this.generator.log('');

        var prompts = [
            {
                type: 'input',
                name: 'cName',
                message: 'What would you like to call your component?',
                validate: function( value ) {
                    var valid = value && value.length > 0;
                    return valid || 'Please enter a name';
                },
                filter: function( val ) {
                    return lodash.kebabCase(val);
                }
            }
        ];

        // cName was already set using 'yo meaningfuljs:component [cName]'
        // remove the question
        if(this.generator.values.cName){
            prompts.shift();
        }

        // save answers to questions in this.generator.values
        this.generator.prompt(prompts, function(props) {
            if(props.cName){
                this.generator.values.cName = props.cName;
            }

            // finish blocking for next step
            done();
        }.bind(this));
    },

    // Step #3
    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
    configuring: function(){
        // nothing to do here, but I'm leaving it here as a placeholder.
    },

    // Step #4
    // Where you write the generator specific files (routes, controllers, etc)
    writing: function(){
        // build up custom variables
        var vals = this.generator.values;
        var src = this.generator.dir.templates + '/client/components/thing/';
        var dest = this.generator.dir.components + '/' + vals.cName;
        var appDir = this.generator.dir.app;
        vals.properName = lodash.chain(vals.cName)
                                .camelCase()
                                .capitalize()
                                .value();
        vals.controllerFile = dest + '/' + vals.cName + '.js';
        vals.viewFile = dest + '/' + vals.cName + '.html';
        vals.serviceFile = dest + '/' + vals.cName + '.service.js';
        vals.cssContainer = vals.cName + '-container';

        // copy files from /src/templates to /src/client/components
        fs.copySync(src, dest, null, function (err) {
            if(err) { return console.error(err); }
        });

        processController(dest, vals);
        processView(dest, vals);
        processService(dest, vals);
        processAppConfig(appDir, vals);
        processAppMainModule(appDir, dest, vals);
    },

    // Step #5
    // Where installation are run (npm, bower)
    install: function(){
        // nothing to do here, but I'm leaving it here as a placeholder.
    },

    // Step #6
    // Called last, cleanup, say good bye, etc
    end: function(){
        this.generator.log('');
        this.generator.log('===========================================');
        this.generator.log('You are now officially ready to rock.');
        this.generator.log('Have fun!');
        this.generator.log('===========================================');
        this.generator.log('');
    }
});

module.exports = MeaningfulJsGenerator;


//////////////////////////
// Helper Functions
//////////////////////////
function processController(dest, vals) {
    fs.renameSync(dest + '/thing.js', vals.controllerFile);
    var controller = fs.readFileSync(vals.controllerFile);
    var newController = grasp.replace('equery',
                                      'ThingController',
                                      vals.properName + 'Controller',
                                      controller.toString());
    newController = grasp.replace('equery',
                                  '\'ThingController\'',
                                  '\'' + vals.properName + 'Controller' + '\'',
                                  newController);
    newController = grasp.replace('equery',
                                  '\'Thing\'',
                                  '\'' + vals.properName + '\'',
                                  newController);
    newController = grasp.replace('equery',
                                  '\'app.thing\'',
                                  '\'app.' + vals.cName + '\'',
                                  newController);
    fs.writeFile(vals.controllerFile, newController, function (err) {
        if(err) { throw err; }
    });
    console.log('Updated ' + vals.controllerFile);
}

function processView(dest, vals) {
    fs.renameSync(dest + '/thing.html', vals.viewFile);
    var view = fs.readFileSync(vals.viewFile);
    var $ = cheerio.load(view);
    $('.thing-container').addClass(vals.cssContainer)
                         .removeClass('thing-container');
    $('h2').text('{{' + vals.cName + '.title}}');
    fs.writeFile(vals.viewFile, $.html(), function (err) {
        if(err) { throw err; }
    });
    console.log('Updated ' + vals.viewFile);
}

function processService(dest, vals) {
    fs.renameSync(dest + '/thing.service.js', vals.serviceFile);
    var service = fs.readFileSync(vals.serviceFile);
    var newService = grasp.replace('equery',
                                      'ThingService',
                                      vals.properName + 'Service',
                                      service.toString());
    newService = grasp.replace('equery',
                                  '\'ThingService\'',
                                  '\'' + vals.properName + 'Service' + '\'',
                                  newService);
    newService = grasp.replace('equery',
                                  'restUrl.thing',
                                  'restUrl.' + vals.cName,
                                  newService);
    newService = grasp.replace('equery',
                                  '\'app.thing\'',
                                  '\'app.' + vals.cName + '\'',
                                  newService);
    fs.writeFile(vals.serviceFile, newService, function (err) {
        if(err) { throw err; }
    });
    console.log('Updated ' + vals.serviceFile);
}

function processAppConfig(dest, vals) {
    var file = dest + '/app.config.json';
    var appConfigJson = fs.readJsonSync(file);
    appConfigJson.development.restUrl[vals.cName] = vals.cName;
    appConfigJson.production.restUrl[vals.cName] = 'http://localhost:4000/' + vals.cName;
    fs.writeJsonSync(file, appConfigJson);
    console.log('Updated ' + file);
}

function processAppMainModule(appDir, dest, vals) {
    var file = appDir + '/app.mainmodule.js';
    var main = fs.readFileSync(file);
    var newMain = grasp.replace('equery',
                                'var modules = [_$elements];',
                                'var modules = [{{ elements | append "\'app.' + vals.cName + '\'" | join ",\n" }}];',
                                main.toString());

    // Process route, add to app.mainmodule.js
    var routeFile = dest + '/thing.route.json';
    var route = fs.readJsonSync(routeFile);
    route.path = '/' + vals.cName;
    route.components.main = vals.cName;
    var stringRoute = JSON.stringify(route);
    // NOTE: current style rules require " in JSON, ' in JS.
    // This transformation from one to the other is to
    // satisfy the JSHint style rules.
    stringRoute = stringRoute.replace(/"/g, '\'');
    stringRoute = stringRoute.replace('}}', '} }');
    stringRoute = stringRoute.replace(/,/g, ', ');

    newMain = grasp.replace('equery',
                            'var routes = [_$elements];',
                            'var routes = [{{ elements | append "' + stringRoute + '" | join ",\n" }}];',
                            newMain);

    // NOTE: The route array is generated with a closing '} }'
    //       to work around a grasp.replace bug.
    //       Unfortunately, this throws a jshint in the
    //       client build. So this cleans up the generated code.
    newMain = newMain.replace('} }', '}}');

    fs.writeFile(file, newMain, function (err) {
        if(err) { throw err; }
    });

    // remove template route file
    // (now that it is included in app.mainmodule.js)
    fs.removeSync(routeFile);

    console.log('Updated ' + file);
}


