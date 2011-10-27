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
/*globals App describe afterEach beforeEach it expect */


App = SC.Application.create({
  storage: SC.LocalStorage.create({appDomain:'LocalStorageTest',
                                   userDomain:'UberDuber'}),
  currentSumerBinding: 'storage.sumer'
});


describe('LocalStorage', function() {

  afterEach(function() {
    window.localStorage.clear();
  });
  
  beforeEach(function() {
    window.localStorage.clear();
    App.get('storage').defaults();
  });
  
  it('stores and retrieves KV pairs from HTML5 local storage', function() {
    App.setPath('storage.mar', 'tini');
    expect(App.getPath('storage.mar')).toEqual('tini');
    expect(window.localStorage.length).toEqual(1);
  });
  

  describe('defaults', function() {

    beforeEach(function() {
      App.get('storage').defaults({'sumer': 'imhotep'},
                                  {'mar': 'tini'});

      App.setPath('storage.mar', 'vel');
      SC.run.sync();
    });

    it('prioritizes the value in localStorage over a default value', function() {
      expect(App.getPath('storage.mar')).toEqual('vel');
    });

    it('returns the default if key is not in localStorage', function() {
      expect(App.getPath('storage.sumer')).toEqual('imhotep');
    });

    it('notifies the runtime when defaults change', function() {
      expect(App.get('currentSumer')).toEqual('imhotep');
      App.get('storage').defaults({'sumer': 'ra'});
      SC.run.sync();
      expect(App.get('currentSumer')).toEqual('ra');
    });

  });

  xdescribe('userDomain', function() {

    var watcher;

    beforeEach(function() {
      App.setPath('storage.mar', 'tini');
      
      watcher = SC.Object.create({
        weWereNotified: NO,
        
        marDidChange: function() {
          this.set('weWereNotified', YES);
        }.observes('App.storage.mar')
      });
      
      SC.run.sync();
    });

    it('notifies the runtime that all properties have changed when the userDomain changes', function() {
      expect(watcher.get('weWereNotified')).toEqual(NO);
      App.setPath('storage.userDomain', 'Nosferatu');
      SC.run.sync();
      expect(watcher.get('weWereNotified')).toEqual(YES);      
    });
  });

});

