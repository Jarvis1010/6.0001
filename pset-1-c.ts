import { input } from "./utils";

const portionDownPayment = 0.25;
const semiannualRaise = 0.07;
const totalCost = 1_000_000;
const totalDown = totalCost * portionDownPayment;
const MAX_MONTHS = 36;
const acceptable = totalDown - 100;

function monthlyInterest(currentSavings: number) {
  const annualInterestRate = 0.04;
  return Math.floor(((currentSavings * annualInterestRate) / 12) * 100) / 100;
}

(async () => {
  const maybeAnnualSalary = await input("Enter your annual salary: ");
  const annualSalary = parseFloat(maybeAnnualSalary);

  function getMonths(portionSaved) {
    const getSavings = (
      currentSavings: number,
      months: number,
      annualSalary
    ): number => {
      if (months === MAX_MONTHS) return currentSavings;

      const raiseRaw =
        months > 6 && months % 6 === 1 ? annualSalary * semiannualRaise : 0;

      const raise = Math.floor(raiseRaw * 100) / 100;

      const salary = annualSalary + raise;

      const monthlySalary = salary / 12;
      const salarySaved = monthlySalary * portionSaved;

      return getSavings(
        currentSavings + monthlyInterest(currentSavings) + salarySaved,
        months + 1,
        salary
      );
    };
    return getSavings;
  }

  function getPortionSaved(min, max, count): [number, number] {
    if (min >= max) throw new Error("No solution");

    const portionSaved = Math.ceil((min * 10000 + max * 10000) / 2) / 10000;
    console.log(`${min} - ${max} - ${portionSaved}`);

    const currentSavingsRaw = getMonths(portionSaved)(0, 0, annualSalary);
    const currentSavings = Math.floor(currentSavingsRaw * 100) / 100;

    console.log(`${currentSavings} - ${acceptable}`);

    if (currentSavings >= acceptable && currentSavings < totalDown)
      return [portionSaved, count];

    const newMin = currentSavings < acceptable ? portionSaved : min;
    const newMax = currentSavings > totalDown ? portionSaved : max;

    return getPortionSaved(newMin, newMax, count + 1);
  }
  try {
    const [rate, count] = getPortionSaved(0, 1, 0);

    console.log("Best savings rate: ", rate);
    console.log("Steps in bisection search: ", count);
  } catch (err) {
    console.error(err);
  }
})();
