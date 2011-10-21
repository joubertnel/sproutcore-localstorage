// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: (c) 2011 Joubert Nel.
//            Portions © 2006-2011 Strobe Inc. and contributors.
//            Portions © 2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals */

/**
   @class

   SC.LocalStorage provides an easy eay to store key/value pairs, e.g. user
   preferences, on the local machine using [HTML 5 localStorage](http://dev.w3.org/html5/webstorage/#the-localstorage-attribute).
   You use this by providing built-in defaults using the SC.LocalStorage.defaults() method.
   You can slo implement the LocalStorageDefaultsDelegate interface to be notified
   whenever a default is required.

   You should also set the userDomain property on the defaults on page load. 
   This enables storing/fetching keys from localStorage for the correct user. 

   You can also set an appDomain property if you want. This will be automatically
   prefixed to key names with no slashes in them. 

   SC.localStorage.getPath('global:contactInfo.userName');

   @extends SC.Object
   @since SproutCore 2.0
*/
SC.LocalStorage = SC.Object.extend(/** @scope SC.LocalStorage.prototype */ {

  ready: NO,

  /**
     the default domain for the user.  This will be used to store keys in
     local storage.  If you do not set this property, the wrong values may be
     returned.
  */
  userDomain: null,

  /**
     The default app domain for the user.  Any keys that do not include a
     slash will be prefixed with this app domain key when getting/setting.
  */
  appDomain: null,

  /** @private
      Defaults.  These will be used if not defined on localStorage.
  */
  _defaults: null,


  /**
     Invoke this method to set the built-in defaults.  This will cause all
     properties to change.
  */
  defaults: function(newDefaults) {
    this._defaults = newDefaults ;
    this.allPropertiesDidChange();
  },

  /**
     Attempts to read a value from local storage.  If not found in
     localStorage, use the local defaults, if defined.  If the key passed
     does not include a slash, then add the appDomain or use "app/".

     @param {String} keyName
     @returns {Object} read value
  */
  readValue: function(keyName) {
    var ret, userKeyName, localStorage, key, del;

    // namespace keyname
    keyName = this._normalizeKeyName(keyName);
    userKeyName = this._userKeyName(keyName);

    // look into recently written values
    if (this._written) { ret = this._written[userKeyName]; }

    // attempt to read from localStorage

    if ($.browser.msie && $.browser.version === '7.0') {
      localStorage = document.body;
      try {
        localStorage.load("SC.LocalStorage");
      } catch(e) {
        console.error("Couldn't load localStorage in IE7: " + e.description);
      }
    } else {
      localStorage = window.localStorage;
      if (!localStorage && window.globalStorage) {
        localStorage = window.globalStorage[window.location.hostname];
      }
    }
    
    if (localStorage) {
      key = ["SC.LocalStorage", userKeyName].join('-at-');
      if ($.browser.msie && $.browser.version === '7.0') {
        ret = localStorage.getAttribute(key.replace(/\W/gi, ''));
      } else {
        ret = localStorage[key];
      }
      
      if (!SC.none(ret)) {
        try {
	  ret = $.parseJSON(ret);
	}
        catch(ex) {}
      }
    }

    // if not found in localStorage, try to notify delegate
    del = this.delegate ;
    if (del && del.localStorageNeedsDefault) {
      ret = del.localStorageNeedsDefault(this, keyName, userKeyName);
    }

    // if not found in localStorage or delegate, try to find in defaults
    if ((ret===undefined) && this._defaults) {
      ret = this._defaults[userKeyName] || this._defaults[keyName];
    }

    return ret ;
  },

  /**
     Attempts to write the value to local storage.
     Also notifies that the value has changed.

     @param {String} keyName
     @param {Object} value
     @returns {SC.LocalStorage} receiver
  */
  writeValue: function(keyName, value) {
    var userKeyName, written, localStorage, key, del;
    var encodedValue;
    var obj;

    keyName = this._normalizeKeyName(keyName);
    userKeyName = this._userKeyName(keyName);

    // save to local hash
    written = this._written ;
    if (!written) { written = this._written = {}; }
    written[userKeyName] = value;

    // save to local storage

    if ($.browser.msie && $.browser.version === '7.0') {
      localStorage = document.body;
    } else {
      localStorage = window.localStorage ;
      if (!localStorage && window.globalStorage) {
        localStorage = window.globalStorage[window.location.hostname];
      }
    }
    
    key = ["SC.LocalStorage", userKeyName].join('-at-');
    if (localStorage) {
      encodedValue = JSON.stringify(value);
      if ($.browser.msie && $.browser.version === '7.0') {
        localStorage.setAttribute(key.replace(/\W/gi, ''), encodedValue);
        localStorage.save("SC.LocalStorage");
      } else {
        try {
          localStorage[key] = encodedValue;
        } catch(e) {
          console.error("Failed using localStorage. "+e);
        }
      }
    }

    // also notify delegate
    del = this.delegate;
    if (del && del.localStorageDidChange) {
      del.localStorageDidChange(this, keyName, value, userKeyName);
    }

    return this ;
  },

  /**
     Removed the passed keyName from the written hash and local storage.

     @param {String} keyName
     @returns {SC.LocalStorage} receiver
  */
  resetValue: function(keyName) {
    var fullKeyName, userKeyName, written, localStorage, key;
    var obj;
    
    fullKeyName = this._normalizeKeyName(keyName);
    userKeyName = this._userKeyName(fullKeyName);

    this.propertyWillChange(keyName);
    this.propertyWillChange(fullKeyName);

    written = this._written;
    if (written) delete written[userKeyName];

    if ($.browser.msie && $.browser.version === '7.0') {
      localStorage = document.body;
    } else {
      localStorage = window.localStorage;
      if (!localStorage && window.globalStorage) {
        localStorage = window.globalStorage[window.location.hostname];
      }
    }

    key = ["SC.LocalStorage", userKeyName].join('-at-');

    if (localStorage) {
      if ($.browser.msie && $.browser.version === '7.0') {
        localStorage.setAttribute(key.replace(/\W/gi, ''), null);
        localStorage.save("SC.LocalStorage");
      } else {
        // In case error occurs while deleting local storage in any browser,
        // do not allow it to propagate further
        try {
          delete localStorage[key];
        } catch(e) {
          console.warn('Deleting local storage encountered a problem. '+e);
        }
      }
    }

    this.propertyDidChange(keyName);
    this.propertyDidChange(fullKeyName);
    return this;
  },

  /**
     Is called whenever you .get() or .set() values on this object

     @param {Object} key
     @param {Object} value
     @returns {Object}
  */
  unknownProperty: function(key, value) {
    if (value === undefined) {
      return this.readValue(key) ;
    } else {
      this.writeValue(key, value);
      return value ;
    }
  },

  /**
     Normalize the passed key name.  Used by all accessors to automatically
     insert an appName if needed.
  */
  _normalizeKeyName: function(keyName) {
    var domain;
    if (keyName.indexOf(':')<0) {
      domain = this.get('appDomain') || 'app';
      keyName = [domain, keyName].join(':');
    }
    return keyName;
  },

  /**
     Builds a user key name from the passed key name
  */
  _userKeyName: function(keyName) {
    var user = this.get('userDomain') || '(anonymous)' ;
    return [user, keyName].join('-at-');
  },

  _domainDidChange: function() {
    var didChange = NO;
    if (this.get("userDomain") !== this._scud_userDomain) {
      this._scud_userDomain = this.get('userDomain');
      didChange = YES;
    }

    if (this.get('appDomain') !== this._scud_appDomain) {
      this._scud_appDomain = this.get('appDomain');
      didChange = YES;
    }

    if (didChange) this.allPropertiesDidChange();
  }.observes('userDomain', 'appDomain'),

  init: function() {
    var dh;
    var myDB;
    var obj;
    var shortName;

    this._super();

    // Increment the jQuery ready counter, so that SproutCore will
    // defer loading the app until the user defaults are available.
    jQuery.readyWait++;

    if (SC.localStorage && SC.localStorage.get('dataHash')){
      dh = SC.localStorage.get('dataHash');
      if (dh) {
        this.dataHash = SC.localStorage.get('dataHash');
      }
    }
    
    this._scud_userDomain = this.get('userDomain');
    this._scud_appDomain  = this.get('appDomain');

    if ($.browser.msie && $.browser.version === '7.0') {
      //Add user behavior userData. This works in all versions of IE.
      //Adding to the body as is the only element never removed.
      document.body.addBehavior('#default#userData');
    }
  }

});

/** local storage available in the global SproutCore namespace */
SC.localStorage = SC.LocalStorage.create();