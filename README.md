#JSONiq
[![Circle CI](https://circleci.com/gh/wcandillon/jsoniq/tree/master.svg?style=svg)](https://circleci.com/gh/wcandillon/jsoniq/tree/master) [![NPM version](http://img.shields.io/npm/v/jsoniq.svg?style=flat)](http://badge.fury.io/js/jsoniq)

##The JSON Query Language
###Usage
To compile a query:
```base
$cat query.jq
for $i in (1 to 5)
return $i
$jsoniq compile query.jq
$node query.js
1
2
3
4
5
```

To print the query AST:
```base
$jsoniq ast query.jq
```

To print the query plan:
```base
$jsoniq plan query.jq
```
