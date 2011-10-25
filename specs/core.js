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


describe('LocalStorage', function() {
  var theKey = 'mar';
  var theVal = 'tini';
  var storage = SC.LocalStorage.create();

  beforeEach(function() {
    window.localStorage.clear();
  });
  
  it('stores and retrieves KV pairs from HTML5 local storage', function() {
    storage.writeValue(theKey, theVal);
    expect(storage.readValue(theKey)).toEqual(theVal);
    expect(window.localStorage.length).toEqual(1);
  });

  it('supports set/get semantics', function() {
    storage.set(theKey, theVal);
    expect(storage.get(theKey)).toEqual(theVal);
    expect(window.localStorage.length).toEqual(1);
  });

});

