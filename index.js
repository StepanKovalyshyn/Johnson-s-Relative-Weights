const { Matrix, EVD, inverse } = require('ml-matrix');
const { sqrt, square } = require('mathjs');

const extractMatrix = function (matrix, matrixType) {
  let extractedMatrix = [];
  range(0, matrix.rows).forEach(i => {
    let newRow = [];
    range(0, matrix.columns).forEach(j => {
      if (matrixType === 'matrix-transposed') {
        newRow.push(parseFloat(matrix.get(j, i)));
      } else if (matrixType === 'eigen-vectors-matrix') {
        newRow.push(parseFloat(matrix.get(i, matrix.rows - 1 - j)));
      } else {
        newRow.push(parseFloat(matrix.get(i, j)));
      }
    })
    extractedMatrix.push(newRow);
  })
  return extractedMatrix;
}

const range = function (start, end) {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
}

const calculateRSquared = function (partialEffect) {
  let squaredValues = [];
  partialEffect.map(rowValue => squaredValues.push(Math.pow(rowValue, 2)));
  return squaredValues.reduce(function (a, b) {
    return a + b
  }, 0);
}

const createDiagonalMatrixOfEigenValues = function (eigenValues) {
  let diagonalMatrixOfEigenValues = [];
  range(0, eigenValues.length).forEach(i => {
    let matrixRow = [];
    range(0, eigenValues.length).forEach(j => {
      matrixRow.push(i === j ? eigenValues[i] : 0)
    }
    )
    diagonalMatrixOfEigenValues.push(matrixRow);
  });
  return diagonalMatrixOfEigenValues;
}

const computeCorrelationMatrixBetweenDependentVariables = function (correlationMatrix, dependentVariable) {
  let correlationMatrixBetweenDependentVariables = [];
  correlationMatrix.forEach((matrixRow, index) => {
    if (index === dependentVariable - 1) {
      matrixRow.forEach((matrixRowElement, matrixRowElementIndex) => {
        if (matrixRowElementIndex !== dependentVariable - 1) {
          correlationMatrixBetweenDependentVariables.push([matrixRowElement]);
        }
      })
    }
  });
  return correlationMatrixBetweenDependentVariables;
}

const computeCorrelationMatrixBetweenIndependentVariables = function (correlationMatrix, dependentVariable) {
  let correlationMatrixBetweenIndependentVariables = [];
  correlationMatrix.forEach((matrixRow, index) => {
    if (index !== dependentVariable - 1) {
      let matrixRowArray = [];
      matrixRow.forEach((matrixRowElement, matrixRowElementIndex) => {
        if (matrixRowElementIndex !== dependentVariable - 1) {
          matrixRowArray.push(matrixRowElement);
        }
      })
      correlationMatrixBetweenIndependentVariables.push(matrixRowArray);
    }
  });
  return correlationMatrixBetweenIndependentVariables;
}

const proceedJohnsonReletiveWeightsAlgorithm = function (correlationMatrix, dependentVariable) {

  if (!new Matrix(correlationMatrix).isSymmetric()) { throw "Matrix is not symmetric" };

  // Step 1. Compute correlation matrix between independent variables   
  const rxy = computeCorrelationMatrixBetweenDependentVariables(correlationMatrix, dependentVariable);
  let correlationMatrixBetweenIndependentVariables = computeCorrelationMatrixBetweenIndependentVariables(correlationMatrix, dependentVariable);

  // Step 2. Calculate EigenVector and EigenValues based on correlation matrix
  const evd = new EVD(new Matrix(correlationMatrixBetweenIndependentVariables));
  const eigenVectorsMatrix = extractMatrix(evd.eigenvectorMatrix, 'eigen-vectors-matrix');
  const eigenValues = createDiagonalMatrixOfEigenValues(evd.realEigenvalues.reverse());

  // Step 3. Calculate diagonal matrix of eigenvalue and then take square root of the diagonal matrix
  const squareRootDiagonalEVMatrix = sqrt(eigenValues);

  // Step 4. Calculate matrix multiplication of eigenvector, matrix in step 3 and Transpose of Eigenvector
  const evMatrixTransposed = extractMatrix(new Matrix(eigenVectorsMatrix), 'matrix-transposed');
  const lambda = extractMatrix(new Matrix(eigenVectorsMatrix).mmul(new Matrix(squareRootDiagonalEVMatrix)).mmul(new Matrix(evMatrixTransposed)), 'matrix-transposed');

  // Step 5. Square matrix in step 4.
  const lambdaSquared = square(lambda);

  // Step 6 To calculate the partial effect of each independent variable on dependent variable, calculate matrix multiplication of 
  // [Inverse of matrix in step 4] and correlation matrix [between dependent and independent variables (i.e. 1 X 1 matrix)]
  const lambdaInversed = extractMatrix(inverse(lambda), 'matrix-transposed');

  // RXY multiplicated with inverse matrix
  const partialEffect = extractMatrix(new Matrix(lambdaInversed).mmul(new Matrix(rxy)));

  // Step 7. To calculate R-Square, sum the above matrix (Step 6 matrix)
  const rSquared = calculateRSquared(partialEffect);

  // Step 8. To calculate raw relative weights, calculate matrix multiplication of [matrix in step 5] and [Square of matrix in step 6]
  // Square of step 6 matrix 
  const partialEffectSquared = square(partialEffect);

  // Square of step 6 matrix X matrix in step 5
  const rawRelativeWeights = [].concat.apply([], extractMatrix(new Matrix(lambdaSquared).mmul(new Matrix(partialEffectSquared))));

  // Step 9. To calculate raw relative weights as percentage of R-Square, divide raw relative weights by r-square and then multiply it by 100.
  const rescaledRawRelativeWeights = rawRelativeWeights.map(value => value / rSquared * 100);

  return { rawRelativeWeights, rescaledRawRelativeWeights, rSquared };
}

module.exports = proceedJohnsonReletiveWeightsAlgorithm;