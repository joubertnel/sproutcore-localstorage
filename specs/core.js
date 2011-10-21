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
  
  it('is sane', function() {
    expect(true).toBeTruthy();
  });

  it('stores and retrieves KV pairs from HTML5 local storage', function() {
    SC.localStorage.writeValue(theKey, theVal);
    expect(SC.localStorage.readValue(theKey)).toEqual(theVal);
  });

});


// module("LocalStorage", {
 	   
//  	  setup: function() {
//  	    obj = SC.Object.create({ bck : 'green' }); 	
//  	}
// });



// test("To check if the KV pairs are stored and read from local storage", function() {
//   SC.localStorage.writeValue('Back', obj.bck);
//   equals(SC.localStorage.readValue('Back'), obj.bck, 'can read written value');
// });