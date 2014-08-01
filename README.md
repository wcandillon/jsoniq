#JSONiq
[![Build Status](http://img.shields.io/travis/wcandillon/jsoniq/master.svg?style=flat)](https://travis-ci.org/wcandillon/jsoniq) [![NPM version](http://img.shields.io/npm/v/jsoniq.svg?style=flat)](http://badge.fury.io/js/jsoniq) [![Code Climate](http://img.shields.io/codeclimate/github/wcandillon/jsoniq.svg?style=flat)](https://codeclimate.com/github/wcandillon/jsoniq)


##The JSON Query Language

###Pending Update Lists

```javascript
var obj = { a: 1, b: { c: 1 } };
var store = new MemoryStore();
var ref = store.put(obj);
store.pul()
.insert(ref, ['b'], { d: 1 })
.delete(ref, ['b'], ['c'])
.apply();
console.log(obj); <= { a: 1, b: { d: 1 } }
```

###TODOs
* Implement apply, composition, inversion, and merging on a memory store
* Implement IndexedDB store
* Implement master-master replication
