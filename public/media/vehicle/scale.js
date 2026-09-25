const calculator = document.querySelector('[data-ubi-scale]');
if (calculator) {
  const ko = calculator.dataset.lang === 'ko';
  const format = new Intl.NumberFormat(ko ? 'ko-KR' : 'en-US');
  const update = () => {
    const vehicles = Number(calculator.querySelector('[name="ubi-vehicles"]').value);
    const hours = Number(calculator.querySelector('[name="ubi-hours"]').value);
    const rows = vehicles * hours * 3600 * 30;
    const gb = rows * 92 / 1e9;
    calculator.querySelector('[data-ubi-rows]').textContent = format.format(rows);
    calculator.querySelector('[data-ubi-size]').textContent = `≈ ${gb.toLocaleString(ko ? 'ko-KR' : 'en-US', { maximumFractionDigits: 3 })} GB`;
    calculator.querySelector('[data-ubi-formula]').textContent = `${format.format(vehicles)} × ${hours} × 3,600 × 30 = ${format.format(rows)}`;
  };
  calculator.addEventListener('change', update);
  update();
}
