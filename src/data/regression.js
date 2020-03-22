// translated to javasript from
// https://www.mathworks.com/matlabcentral/fileexchange/74411-fitvirus
//

function iniGuess(C) {
  // INIGUESS Initial guess for logistic regression
  // calculate initial K, r, A using data from three equidistant points
  let m, q, p, r, k1, k2, k3, K, A;
  const n = C.length;

  // calculate time interval for equidistant points: k - 2 * m, k - m, k
  if (n % 2 === 0) {
    k1 = 0;
    k3 = n - 2;
  } else {
    k1 = 0;
    k3 = n - 1;
  }

  k2 = (k1 + k3) / 2 + 1;
  m = k2 - k1 - 1;
  console.log(n, k1, k2, k3);
  console.log(m, C[k2], C[k3], C[k1]);
  q = C[k2] * C[k2] - C[k3] * C[k1];
  if (q <= 0) {
    throw new Error(`q is negatif: ${q}, ${C}`);
  }

  p = C[k1] * C[k2] - 2 * C[k1] * C[k3] + C[k2] * C[k3];
  if (p <= 0) {
    throw new Error(`p is negatif ${p}`);
  }
  K = (C[k2] * p) / q;

  // .calculate r
  r = Math.log((C[k3] * (C[k2] - C[k1])) / C[k1] / (C[k3] - C[k2])) / m;
  if (r < 0) {
    throw new Error(`r is negatif ${r}`);
  }

  //%...calculate A
  A =
    (((C[k3] - C[k2]) * (C[k2] - C[k1])) / q) *
    Math.pow((C[k3] * (C[k2] - C[k1])) / C[k1] / (C[k3] - C[k2]), (k3 - m) / m);
  if (A <= 0) {
    throw new Error(`A is negatif ${A}`);
  }
  // this is initial guess
  console.log([K, r, A]);
  return [K, r, A];
}

function fun(x, [K, r, A]) {
  // Logistic model
  const y = K / (1 + A * Math.exp(-r * x));
  return y;
}

// adapted from
// https://github.com/jonasalmeida/fminsearch
const fminsearch = function(fun, Parm0, x, y, Opt) {
  if (!Opt) {
    Opt = {};
  }
  if (!Opt.maxIter) {
    Opt.maxIter = 1000;
  }
  if (!Opt.step) {
    // initial step is 1/100 of initial value (remember not to use zero in Parm0)
    Opt.step = Parm0.map(function(p) {
      return p / 100;
    });
    Opt.step = Opt.step.map(function(si) {
      if (si == 0) {
        return 1;
      } else {
        return si;
      }
    }); // convert null steps into 1's
  }
  if (typeof Opt.display === "undefined") {
    Opt.display = true;
  }
  if (!Opt.objFun) {
    Opt.objFun = function(y, yp) {
      return y
        .map(function(yi, i) {
          return Math.pow(yi - yp[i], 2);
        })
        .reduce(function(a, b) {
          return a + b;
        });
    };
  } //SSD

  var cloneVector = function(V) {
    return V.map(function(v) {
      return v;
    });
  };
  var P0 = cloneVector(Parm0),
    P1 = cloneVector(Parm0);
  var n = P0.length;
  var step = Opt.step;
  var funParm = function(P) {
    return Opt.objFun(y, fun(x, P));
  }; //function (of Parameters) to minimize
  // silly multi-univariate screening
  for (var i = 0; i < Opt.maxIter; i++) {
    for (var j = 0; j < n; j++) {
      // take a step for each parameter
      P1 = cloneVector(P0);
      P1[j] += step[j];
      if (funParm(P1) < funParm(P0)) {
        // if parm value going in the righ direction
        step[j] = 1.2 * step[j]; // then go a little faster
        P0 = cloneVector(P1);
      } else {
        step[j] = -(0.5 * step[j]); // otherwiese reverse and go slower
      }
    }
    if (Opt.display) {
      if (i > Opt.maxIter - 10) {
        console.log(i + 1, funParm(P0), P0);
      }
    }
  }
  return P0;
};

export function makeModel(y, options = { maxIter: 10000, display: false }) {
  const x = [];
  for (let i = 1; i <= y.length; i++) {
    x.push(i);
  }
  var fun2 = function(x, P) {
    return x.map(xi => fun(xi, P));
  };
  const guessP = iniGuess(y);
  var P = fminsearch(fun2, guessP, x, y, {
    maxIter: options.maxIter,
    display: options.display
  });

  const data = {
    x: [],
    y,
    yd: [],
    err: []
  };

  let i = 0;
  let yd = 0;
  while (yd < P[0] * 0.99) {
    const d = i + 1;
    yd = Math.round(fun(d, P));
    data.x.push(d);
    data.yd.push(yd);
    data.err.push(Math.round(Math.abs(((yd - y[i]) / y[i]) * 10000)) / 100);
    i++;
  }
  return {
    model: {
      K: Math.round(P[0]),
      r: Math.round(P[1] * 100) / 100,
      A: Math.round(P[2])
    },
    data
  };
}
