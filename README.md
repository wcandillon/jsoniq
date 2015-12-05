# JSONiq
[![Circle CI](https://circleci.com/gh/wcandillon/jsoniq/tree/master.svg?style=svg)](https://circleci.com/gh/wcandillon/jsoniq/tree/master) [![NPM version](http://img.shields.io/npm/v/jsoniq.svg?style=flat)](http://badge.fury.io/js/jsoniq)

## The JSON Query Language
### Usage
To compile a query to JavaScript:
```bash
$ cat query.jq
for $x in (4,1,2,3)
for $y in (4,1,2,3)
order by $x ascending, $y descending
return { x: $x, y: $y }
$ jsoniq compile query.jq
$ node query.js
{ x: 1, y: 4 }
{ x: 1, y: 3 }
{ x: 1, y: 2 }
{ x: 1, y: 1 }
{ x: 2, y: 4 }
{ x: 2, y: 3 }
...
```

Or to run the query directly
```bash
$ jsoniq run query.jq
```


To print the query AST:
```bash
$ jsoniq ast query.jq
```

To print the query plan:
```bash
$ jsoniq plan query.jq
```
