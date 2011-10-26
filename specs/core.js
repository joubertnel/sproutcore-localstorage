// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: (c) 2011 Joubert Nel.
//            Portions © 2006-2011 Strobe Inc. and contributors.
//            Portions © 2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// ========================================================================
// SC.LocalStorage Core Tests
// ========================================================================
/*globals module test ok isObj equals expects */

var localStorage = SC.LocalStorage.create({appDomain:'LocalStorageTest'});

describe('LocalStorage', function() {
  var theKey = 'mar';
  var theVal = 'tini';  

  it('stores and retrieves KV pairs from HTML5 local storage in a bindings-compatible way', function() {
    localStorage.set(theKey, theVal);
    expect(localStorage.get(theKey)).toEqual(theVal);
  });

});

