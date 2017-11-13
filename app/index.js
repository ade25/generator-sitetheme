'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const _s = require('underscore.string');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('babel', {
      desc: 'Use Babel',
      type: Boolean,
      defaults: true
    });
  }

  initializing() {
    this.pkg = require('../package.json');
    this.composeWith(
      require.resolve(`generator-${this.options['test-framework']}/generators/app`),
      { 'skip-install': this.options['skip-install'] }
    );
  }

  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! I will build a theme resource directory now. Out of the box I include a gulpfile to build your app.'));
    }
    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
      default : this.appname // Default to current folder name
    }, {
      type    : 'confirm',
      name    : 'correct',
      message : 'The theme will be generated in the current directory. Is this the correct location? Should we continue?'
    }]).then((answers) => {
      this.log('app name', answers.name);
      this.log('correct', answers.correct);
      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.projectName = answers.name;
      this.appName = _s.slugify(_s.humanize(this.projectName));
    });
  }

  writing() {
    this._writingGulpfile();
    this._writingPackageConfig();
    this._writingPackageJSON();
    this._writingBabel();
    this._writingGit();
    this._writingEditorConfig();
    this._writingThemeComponents();
    this._writingThemeManifest();
    this._writingStyles();
    this._writingScripts();
    this._writingHtml();
    this._writingReadMe();
    this._writingMisc();
  }


  _writingGulpfile() {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.babel.js'),
      {
        date: (new Date).toISOString().split('T')[0],
        name: this.projectName,
        version: this.pkg.version,
        includeBabel: this.options['babel'],
        testFramework: this.options['test-framework']
      }
    );
  }

  _writingPackageConfig() {
    this.fs.copyTpl(
      this.templatePath('_config.json'),
      this.destinationPath('config.json'),
      {
        date: (new Date).toISOString().split('T')[0],
        name: this.appName,
        version: this.pkg.version,
        includeBabel: this.options['babel'],
        testFramework: this.options['test-framework']
      }
    );
  }

  _writingPackageJSON() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        date: (new Date).toISOString().split('T')[0],
        name: this.appName,
        title: this.projectName,
        version: this.pkg.version
      }
    );
  }

  _writingBabel() {
    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    );
  }

  _writingGit() {
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore'));

    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes'));
  }

  _writingEditorConfig() {
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
  }

  _writingThemeComponents() {

    this.fs.copy(
      this.templatePath('rules.xml'),
      this.destinationPath('rules.xml')
    );

    this.fs.copy(
      this.templatePath('_config.yml'),
      this.destinationPath('config.yml')
    );
    this.fs.copy(
      this.templatePath('overrides'),
      this.destinationPath('app/overrides')
    );
  }

  _writingThemeManifest() {
    this.fs.copyTpl(
      this.templatePath('_manifest.cfg'),
      this.destinationPath('manifest.cfg'),
      {
        date: (new Date).toISOString().split('T')[0],
        name: this.appName,
        title: this.projectName,
        version: this.pkg.version
      }
    );
  }

  _writingStyles() {
    this.fs.copy(
      this.templatePath('src'),
      this.destinationPath('app'),
    );
  }

  _writingScripts() {
    mkdirp('app/scripts');
    this.fs.copyTpl(
      this.templatePath('app.js'),
      this.destinationPath('app/scripts/app.js'),
    );
  }

  _writingHtml() {
    this.fs.copy(
      this.templatePath('layouts'),
      this.destinationPath('app/_layouts')
    );

    this.fs.copy(
      this.templatePath('includes/components'),
      this.destinationPath('app/_includes/components')
    );

    this.fs.copy(
      this.templatePath('includes/layout'),
      this.destinationPath('app/_includes/layout')
    );
    mkdirp('app/_includes/base');
    this.fs.copyTpl(
      this.templatePath('includes/base/head.html'),
      this.destinationPath('app/_includes/base/head.html'),
      {
        name: this.appName,
        title: this.projectName
      }
    );
    this.fs.copy(
      this.templatePath('includes/base/piwik.html'),
      this.destinationPath('app/_includes/base/piwik.html')
    );
  }

  _writingReadMe() {
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        date: (new Date).toISOString().split('T')[0],
        name: this.appName,
        title: this.projectName
      }
    );
  }


  _writingMisc() {
    mkdirp('app/assets');
    mkdirp('app/assets/images');
  }



  install() {
    const hasYarn = commandExists('yarn');
    this.installDependencies({
      npm: !hasYarn,
      bower: true,
      yarn: hasYarn,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });
  }


};