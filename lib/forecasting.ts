export function linearRegressionForecast(series: {t:number, y:number}[], steps=7) {
  // Simple least squares on t vs y
  const n = series.length;
  if (n < 2) return Array.from({length: steps}, (_,i)=>({t: series.at(-1)!.t + i+1, y: series.at(-1)!.y}));
  const sumT = series.reduce((a,b)=>a+b.t,0);
  const sumY = series.reduce((a,b)=>a+b.y,0);
  const sumTT = series.reduce((a,b)=>a+b.t*b.t,0);
  const sumTY = series.reduce((a,b)=>a+b.t*b.y,0);
  const denom = n*sumTT - sumT*sumT || 1;
  const m = (n*sumTY - sumT*sumY)/denom;
  const b = (sumY - m*sumT)/n;
  const lastT = series.at(-1)!.t;
  return Array.from({length: steps}, (_,i)=>{
    const t = lastT + i + 1;
    return { t, y: m*t + b };
  });
}
