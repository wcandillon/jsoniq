#JSONiq
[![Circle CI](https://circleci.com/gh/wcandillon/jsoniq/tree/master.svg?style=svg)](https://circleci.com/gh/wcandillon/jsoniq/tree/master) [![NPM version](http://img.shields.io/npm/v/jsoniq.svg?style=flat)](http://badge.fury.io/js/jsoniq)

##The JSON Query Language
###Usage
To run a query:
```base
$cat query.jq
for $i in (1 to 10)
return $i
$jsoniq run query.jq
```

To print the query AST:
```base
$jsoniq ast query.jq
```

To print the query plan:
```base
$jsoniq plan query.jq
```
