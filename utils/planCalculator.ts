import { Bill, PaycheckPlanItem, UserProfile } from '../constants/types';

export function calculatePaycheckPlan(
  payFrequency: UserProfile['payFrequency'],
  bills: Bill[]
): PaycheckPlanItem[] {

  const plan: PaycheckPlanItem[] = bills.map((bill) => {
    let amountToSetAside = 0;
    const monthlyAmount = bill.amount;

    switch (payFrequency) {
      case 'Weekly':
        amountToSetAside = monthlyAmount / 4;
        break;
      case 'Bi-weekly':
        amountToSetAside = monthlyAmount / 2;
        break;
      case 'Semi-monthly':
        amountToSetAside = monthlyAmount / 2;
        break;
      case 'Monthly':
        amountToSetAside = monthlyAmount;
        break;
    }

    return {
      billId: bill.id,
      name: bill.name,
      totalAmount: monthlyAmount,
      dueDay: bill.dueDay,
      amountToSetAside: amountToSetAside,
      isSaved: false,
    };
  });

  return plan;
}