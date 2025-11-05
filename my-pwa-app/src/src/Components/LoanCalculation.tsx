import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function generateSchedule(
  initialLoan: number,
  interestRate: number,
  monthlyPayment: number,
  months: number,
  extraPayments: any[],
) {
  const schedule = [];
  let balance = initialLoan;
  const monthlyRate = interestRate / 100 / 12;
  const maxExtraPerYear = initialLoan * 0.05;
  let extraPaidThisYear = 0;
  let currentYear = 1;

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;

    // Sondertilgung: kolla om det finns extra betalningar denna månad
    const calcYear = Math.ceil(i / 12);
    const currentMonth = i % 12 === 0 ? 12 : i % 12;

    // Om nytt år, nollställ extraPaidThisYear och uppdatera currentYear
    if (currentYear !== calcYear) {
      extraPaidThisYear = 0;
      currentYear = calcYear;
    }

    const extrasThisMonth = extraPayments.filter(
      (p) => p.year === currentYear && p.month === currentMonth,
    );

    let extraAmount = extrasThisMonth.reduce((sum, p) => sum + p.amount, 0);
    if (currentYear === 1) {
      extraAmount = 0; // Ingen Sondertilgung år 1
    } else if (extraPaidThisYear + extraAmount > maxExtraPerYear) {
      const allowed = Math.max(maxExtraPerYear - extraPaidThisYear, 0);
      if (allowed < extraAmount) {
        console.warn(
          `Sondertilgung för år ${currentYear} begränsad till ${allowed.toFixed(2)} € (max 5% av lånebeloppet).`,
        );
      }
      extraAmount = allowed;
    }
    extraPaidThisYear += extraAmount;

    balance = Math.max(balance - principal - extraAmount, 0);

    schedule.push({
      month: i,
      payment: monthlyPayment,
      interest,
      principal,
      extra: extraAmount,
      balance,
    });
  }
  return schedule;
}

function LoanCalculation() {
  const [view, setView] = useState('monthly');
  const [yearlyExtra, setYearlyExtra] = useState({ year: 2, amount: 0 });
  const [extraPayments, setExtraPayments] = useState([
    { year: 2, month: 3, amount: 2000 },
    { year: 2, month: 7, amount: 3000 },
  ]);
  const [paymentsPerYear, setPaymentsPerYear] = useState(12);

  const loanData = {
    initialLoan: 226000,
    interestRate: 3.73,
    monthlyPayment: 928.48,
  };

  const schedule = generateSchedule(
    loanData.initialLoan,
    loanData.interestRate,
    loanData.monthlyPayment,
    120,
    extraPayments,
  );

  // summera per år
  const yearlySchedule = [];
  for (let year = 1; year <= 10; year++) {
    const months = schedule.slice((year - 1) * 12, year * 12);
    const payment = months.reduce((sum, m) => sum + m.payment, 0);
    const interest = months.reduce((sum, m) => sum + m.interest, 0);
    const principal = months.reduce((sum, m) => sum + m.principal, 0);
    const extra = months.reduce((sum, m) => sum + m.extra, 0);
    const balance = months[months.length - 1].balance;

    yearlySchedule.push({ year, payment, interest, principal, extra, balance });
  }

  const totalMonthly = schedule.reduce(
    (tot, row) => ({
      payment: tot.payment + row.payment,
      interest: tot.interest + row.interest,
      principal: tot.principal + row.principal,
      extra: tot.extra + row.extra,
      balance: row.balance, // visa sista balans
    }),
    { payment: 0, interest: 0, principal: 0, extra: 0, balance: 0 },
  );

  const totalYearly = yearlySchedule.reduce(
    (tot, row) => ({
      payment: tot.payment + row.payment,
      interest: tot.interest + row.interest,
      principal: tot.principal + row.principal,
      extra: tot.extra + row.extra,
      balance: row.balance, // visa sista balans
    }),
    { payment: 0, interest: 0, principal: 0, extra: 0, balance: 0 },
  );

  return (
    <div>
      <Button variant="primary" onClick={() => setView(view === 'monthly' ? 'yearly' : 'monthly')}>
        Växla till {view === 'monthly' ? 'årsvis' : 'månadsvis'}
      </Button>

      <div className="mt-3">
        <label>År:</label>
        <input
          type="number"
          min="1"
          value={yearlyExtra.year}
          onChange={(e) => setYearlyExtra({ ...yearlyExtra, year: parseInt(e.target.value) })}
          style={{ width: '80px', marginRight: '10px' }}
        />
        <label>Sondertilgung per år (€):</label>
        <input
          type="number"
          min="0"
          value={yearlyExtra.amount}
          onChange={(e) => setYearlyExtra({ ...yearlyExtra, amount: parseFloat(e.target.value) })}
          style={{ width: '120px', marginRight: '10px' }}
        />
        <label>Antal inbetalningar per år:</label>
        <input
          type="number"
          min="1"
          value={paymentsPerYear}
          onChange={(e) => setPaymentsPerYear(parseInt(e.target.value))}
          style={{ width: '80px', marginRight: '10px' }}
        />
        <Button
          variant="success"
          onClick={() => {
            if (yearlyExtra.year === 1) {
              alert('Sondertilgung kan inte göras under det första året.');
              return;
            }
            const maxYearlyExtra = loanData.initialLoan * 0.05;
            let yearlyAmount = yearlyExtra.amount;
            if (yearlyAmount > maxYearlyExtra) {
              alert(
                `Sondertilgung för år ${yearlyExtra.year} har justerats till ${maxYearlyExtra.toFixed(2)} € (max 5% av lånebeloppet).`,
              );
              yearlyAmount = maxYearlyExtra;
            }
            const monthlyExtra = yearlyAmount / paymentsPerYear;
            if (monthlyExtra <= 0) return alert('Beloppet måste vara större än 0');
            const filtered = extraPayments.filter((p) => p.year !== yearlyExtra.year);
            const interval = Math.floor(12 / paymentsPerYear);
            const newExtras = Array.from({ length: paymentsPerYear }, (_, i) => ({
              year: yearlyExtra.year,
              month: 1 + i * interval,
              amount: monthlyExtra,
            }));
            setExtraPayments([...filtered, ...newExtras]);
          }}
        >
          Lägg till fördelad Sondertilgung
        </Button>
      </div>

      <div style={{ paddingBottom: '50px' }}>
        <Table responsive striped bordered hover className="mt-3">
          <thead>
            <tr>
              {view === 'monthly' ? (
                <>
                  <th>Månad</th>
                  <th>Betalning (€)</th>
                  <th>Ränta (€)</th>
                  <th>Amortering (€)</th>
                  <th>Sondertilgung (€)</th>
                  <th>Restskuld (€)</th>
                  <th>Ta bort</th>
                </>
              ) : (
                <>
                  <th>År</th>
                  <th>Total betalning (€)</th>
                  <th>Ränta (€)</th>
                  <th>Amortering (€)</th>
                  <th>Sondertilgung (€)</th>
                  <th>Restskuld (€)</th>
                  <th>Ta bort</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {view === 'monthly'
              ? schedule.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{row.payment.toFixed(2)}</td>
                    <td>{row.interest.toFixed(2)}</td>
                    <td>{row.principal.toFixed(2)}</td>
                    <td>{row.extra.toFixed(2)}</td>
                    <td>{row.balance.toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setExtraPayments(
                            extraPayments.filter(
                              (p) =>
                                !(
                                  p.year === Math.ceil(row.month / 12) &&
                                  p.month === (row.month % 12 === 0 ? 12 : row.month % 12)
                                ),
                            ),
                          );
                        }}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))
              : yearlySchedule.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{row.payment.toFixed(2)}</td>
                    <td>{row.interest.toFixed(2)}</td>
                    <td>{row.principal.toFixed(2)}</td>
                    <td>{row.extra.toFixed(2)}</td>
                    <td>{row.balance.toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setExtraPayments(extraPayments.filter((p) => p.year !== row.year));
                        }}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          zIndex: 1000,
          borderTop: '2px solid black',
          padding: '5px 10px',
        }}
      >
        <strong>Totalt: </strong>
        Betalning: {(view === 'monthly' ? totalMonthly.payment : totalYearly.payment).toFixed(2)} €,
        Ränta: {(view === 'monthly' ? totalMonthly.interest : totalYearly.interest).toFixed(2)} €,
        Amortering:{' '}
        {(view === 'monthly' ? totalMonthly.principal : totalYearly.principal).toFixed(2)} €,
        Sondertilgung: {(view === 'monthly' ? totalMonthly.extra : totalYearly.extra).toFixed(2)} €,
        Restskuld: {(view === 'monthly' ? totalMonthly.balance : totalYearly.balance).toFixed(2)} €
      </div>
    </div>
  );
}

export default LoanCalculation;
