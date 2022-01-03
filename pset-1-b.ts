import { input } from "./utils";

const portionDownPayment = 0.25;

function monthlyInterest(currentSavings: number) {
  const annualInterestRate = 0.04;
  return (currentSavings * annualInterestRate) / 12;
}

(async () => {
  const maybeAnnualSalary = await input("Enter your annual salary: ");
  const maybePortionSaved = await input(
    "Enter the percent of your salary to save, as a decimal: "
  );
  const maybeTotalCost = await input("Enter the cost of your dream home: ");
  const maybeSemiAnnualRaise = await input(
    "Enter the semiannual raise, as a decimal: "
  );

  const annualSalary = parseFloat(maybeAnnualSalary);
  const portionSaved = parseFloat(maybePortionSaved);
  const totalCost = parseFloat(maybeTotalCost);
  const semiannualRaise = parseFloat(maybeSemiAnnualRaise);

  const totalDown = totalCost * portionDownPayment;

  function getMonths(
    currentSavings: number,
    months: number,
    annualSalary
  ): number {
    if (currentSavings >= totalDown) return months;

    const raise =
      months > 6 && months % 6 === 1 ? annualSalary * semiannualRaise : 0;
    const salary = annualSalary + raise;
    const monthlySalary = salary / 12;
    const salarySaved = monthlySalary * portionSaved;

    return getMonths(
      currentSavings + monthlyInterest(currentSavings) + salarySaved,
      months + 1,
      salary
    );
  }

  console.log("Number of months: ", getMonths(0, 0, annualSalary));
})();
