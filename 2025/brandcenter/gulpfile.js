'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.sass.setConfig({
  cleanCssOptions: { level: 0 },
  autoprefixerOptions: {
     overrideBrowserslist: ["> 1%", "last 2 versions", "not dead"]
  }
})

build.initialize(require('gulp'));
