## Johnson-s-Relative-Weights

This package allows to proceed Johnson's Reletive Weights algorithm with JavaScript language.

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
        [0.55, 0.59, 0.52, 1.00, 0.52, 0.61, 0.45],
        [0.68, 0.68, 0.60, 0.52, 1.00, 0.63, 0.62],
        [0.62, 0.68, 0.62, 0.61, 0.63, 1.00, 0.57],
        [0.72, 0.56, 0.68, 0.45, 0.62, 0.57, 1.00]
    ],  
    3
    );
```

#### Results:
```javascript
{ 
    rawRelativeWeights: [ 0.11700359204348412, 0.06919352376937254, 0.06303302464829029, 0.08045287427575354, 0.0979607733622118, 0.15433290687286622 ],
    rescaledRawRelativeWeights: [ 20.132382803069014, 11.905878133216168, 10.84586344138086, 13.84323364982413, 16.855754208638114, 26.55550232269964 ]   
}
```


