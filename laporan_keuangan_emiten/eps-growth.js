function epsGrowth(bvps, inflansi, eps, epsGrowth, berapaTahun) {
  let result = [];
  for (let i = 0; i < berapaTahun; i++) {
    eps += eps * epsGrowth / 100;
    result.push(eps)
  }
  const totalEps = result.reduce((acc, currentValue) => acc + currentValue);
  const hargaWajar = bvps + totalEps;
  // const hargaWajar = bvps + totalEps - (totalEps * inflansi / 100);
  console.log(`Book Value  : ${bvps}`);
  console.log(`Harga Wajar : ${hargaWajar}`);
}

epsGrowth(1803.87, 25, 394.70, 15.16, 5);