SproutCore LocalStorage
-----------------------

SC.LocalStorage provides an easy eay to store key/value pairs, e.g. user
preferences, on the local machine using [HTML 5 localStorage](http://dev.w3.org/html5/webstorage/#the-localstorage-attribute).
You use this by providing built-in defaults using the SC.LocalStorage.defaults() method.
You can slo implement the LocalStorageDefaultsDelegate interface to be notified
whenever a default is required.

You should also set the userDomain property on the defaults on page load. 
This enables storing/fetching keys from localStorage for the correct user. 

You can also set an appDomain property if you want. This will be automatically
prefixed to key names with no slashes in them. 

```javascript
SC.localStorage.getPath('global:contactInfo.userName');
```