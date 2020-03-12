## Johnson-s-Relative-Weights

This package allows to proceed Johnson's Relative Weights algorithm with JavaScript language.

It accepts two parameters: correlation matrix and dependent variable.


#### Installation
$ npm install johnsons-relative-weights

#### Usage
```javascript
const jrwAnalysis = require('johnsons-relative-weights');

const jrwResults = jrwAnalysis(
    [
        [1.00, 0.66, 0.67, 0.54, 0.68, 0.62, 0.72],
        [0.66, 1.00, 0.58, 0.59, 0.68, 0.68, 0.56],
        [0.67, 0.58, 1.00, 0.52, 0.60, 0.62, 0.68],
        [0.54, 0.59, 0.52, 1.00, 0.52, 0.61, 0.45],
        [0.68, 0.68, 0.60, 0.52, 1.00, 0.63, 0.62],
        [0.62, 0.68, 0.62, 0.61, 0.63, 1.00, 0.57],
        [0.72, 0.56, 0.68, 0.45, 0.62, 0.57, 1.00]
    ],  
    1
);
```

#### Results:
```javascript

{ 
    rawRelativeWeights: [ 0.10774831782516386, 0.1164837573016094, 0.06551431494877613, 0.12116711335808825, 0.08006198853448922, 0.1710549870139989 ],
    rescaledRawRelativeWeights: [ 16.275431607141037, 17.594923647730514, 9.895966579892931, 18.302346675093172, 12.093399182706055, 25.837932307436496 ],
    rSquared: 0.6620304789821244  
}

```

#### Additional info:
https://medium.com/@stepan.kovalyshyn/johnsons-relative-weights-analysis-implementation-with-javascript-d85393c0bbb4

