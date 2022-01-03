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

  const annualSalary = parseFloat(maybeAnnualSalary);
  const portionSaved = parseFloat(maybePortionSaved);
  const totalCost = parseFloat(maybeTotalCost);

  const monthlySalary = annualSalary / 12;
  const salarySaved = monthlySalary * portionSaved;
  const totalDown = totalCost * portionDownPayment;

  function getMonths(currentSavings: number, months: number): number {
    if (currentSavings >= totalDown) return months;
    return getMonths(
      currentSavings + monthlyInterest(currentSavings) + salarySaved,
      months + 1
    );
  }

  console.log("Number of months: ", getMonths(0, 0));
})();
