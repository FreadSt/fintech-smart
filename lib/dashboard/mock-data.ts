export const dashboardSummary = {
  totalBalance: "$25,230.00",
  balanceTrend: "10%",
  balanceDelta: "+ $2,780.00",
  income: "$2,259.70",
  incomeTrend: "10%",
  expense: "$1,589.65",
  expenseTrend: "12%",
  savings: "$1,678.00",
  savingsTrend: "8.5%",
};

export const balanceSparkline = [28, 42, 36, 52, 44, 58, 48, 62, 54, 68];

export const budgetMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export const budgetSegments = [
  [55, 25, 12, 8],
  [48, 30, 14, 8],
  [62, 18, 12, 8],
  [44, 28, 18, 10],
  [58, 22, 12, 8],
  [52, 26, 14, 8],
  [66, 16, 10, 8],
  [50, 24, 16, 10],
];

export type Period = 'daily' | 'weekly' | 'monthly';

export interface BudgetEntry {
  income: number;
  spent: number;
  scheduled: number;
  savings: number;
}

export const budgetData: Record<Period, { labels: string[]; entries: BudgetEntry[] }> = {
  monthly: {
    labels: budgetMonths, 
    entries: [
      { income: 4200, spent: 2100, scheduled: 800, savings: 600 },
      { income: 4500, spent: 2300, scheduled: 900, savings: 750 },
      { income: 5000, spent: 2800, scheduled: 700, savings: 900 },
      { income: 4800, spent: 2500, scheduled: 850, savings: 700 },
      { income: 4300, spent: 2000, scheduled: 750, savings: 800 },
      { income: 4700, spent: 2200, scheduled: 800, savings: 850 },
      { income: 3800, spent: 1800, scheduled: 600, savings: 550 },
      { income: 4600, spent: 2400, scheduled: 820, savings: 780 },
    ],
  },
  weekly: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    entries: [
      { income: 800, spent: 320, scheduled: 150, savings: 120 },
      { income: 750, spent: 280, scheduled: 120, savings: 100 },
      { income: 900, spent: 400, scheduled: 180, savings: 150 },
      { income: 820, spent: 350, scheduled: 160, savings: 130 },
      { income: 950, spent: 420, scheduled: 200, savings: 170 },
      { income: 600, spent: 250, scheduled: 100, savings:  80 },
      { income: 500, spent: 180, scheduled:  90, savings:  70 },
    ],
  },
  daily: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    entries: [
      { income:    0, spent:   0, scheduled:  50, savings:   0 },
      { income:    0, spent:   0, scheduled:  30, savings:   0 },
      { income: 2400, spent:   0, scheduled:  80, savings: 200 },
      { income:    0, spent: 850, scheduled: 120, savings:   0 },
      { income:    0, spent: 420, scheduled:  90, savings: 100 },
      { income:    0, spent: 180, scheduled:  60, savings:  50 },
    ],
  },
};

export const budgetLegend = [
  { label: "Income", colorClass: "bg-primary", amount: "$18,160" },
  { label: "Spent", colorClass: "bg-[#9db800]", amount: "$9,870" },
  { label: "Scheduled", colorClass: "bg-[#6b7a00]", amount: "$4,210" },
  { label: "Savings", colorClass: "bg-accent-emerald", amount: "$3,520" },
];

export const spendingCategories = [
  {
    label: "Auto & Transport",
    percentage: 40,
    amount: "$316",
    colorClass: "bg-secondary",
    color: "#00bdf9",
  },
  {
    label: "Food",
    percentage: 25,
    amount: "$197",
    colorClass: "bg-primary",
    color: "#e6ff4b",
  },
  {
    label: "Clothes",
    percentage: 20,
    amount: "$158",
    colorClass: "bg-[#9db800]",
    color: "#24d79f",
  },
  {
    label: "Other",
    percentage: 15,
    amount: "$118",
    colorClass: "bg-muted",
    color: "#e7e7e7",
  },
];

export const spendingTotal = "$789";

export const transactions = [
  {
    name: "Paypal",
    category: "Subscription",
    date: "Today, 12:32 AM",
    amount: "-$12.89",
    positive: false,
    initial: "P",
    account: "Credit *8967",
    status: "Completed",
  },
  {
    name: "Apple",
    category: "Software",
    date: "Yesterday, 09:15 PM",
    amount: "-$4.99",
    positive: false,
    initial: "A",
    account: "Credit *8967",
    status: "Completed",
  },
  {
    name: "Adobe",
    category: "Creative tools",
    date: "Mar 12, 08:00 AM",
    amount: "+$54.99",
    positive: true,
    initial: "Ad",
    account: "Main wallet",
    status: "Completed",
  },
  {
    name: "Walmart",
    category: "Groceries",
    date: "Mar 11, 06:42 PM",
    amount: "-$86.20",
    positive: false,
    initial: "W",
    account: "Debit *4210",
    status: "Completed",
  },
  {
    name: "Chase",
    category: "Salary",
    date: "Mar 10, 02:18 PM",
    amount: "+$1,200.00",
    positive: true,
    initial: "C",
    account: "Main wallet",
    status: "Cleared",
  },
];

export const cards = [
  {
    type: "Credit",
    balance: "$4,568.00",
    lastFour: "8967",
    expires: "05/27",
    network: "VISA",
    limit: "$8,000",
    used: 57,
    variant: "primary",
  },
  {
    type: "Debit",
    balance: "$12,420.50",
    lastFour: "4210",
    expires: "11/28",
    network: "VISA",
    limit: "$15,000",
    used: 28,
    variant: "surface",
  },
];

export const goals = [
  { name: "Emergency fund", saved: "$1,500", target: "$3,000", progress: 50 },
  { name: "Vacation", saved: "$840", target: "$2,400", progress: 35 },
  { name: "New laptop", saved: "$620", target: "$1,600", progress: 39 },
];

export const quickTransfers = [
  { name: "John Doe", initials: "JD", amount: "$250" },
  { name: "Anna Miller", initials: "AM", amount: "$180" },
  { name: "Sara Kim", initials: "SK", amount: "$320" },
  { name: "Sally Johnson", initials: "SJ", amount: "$320" },
];

export const paymentMethods = [
  { name: "Credit *8967", type: "Card", due: "Mar 18", status: "Primary" },
  { name: "Main wallet", type: "Wallet", due: "Instant", status: "Active" },
  { name: "Debit *4210", type: "Card", due: "Mar 25", status: "Backup" },
];

export const scheduledPayments = [
  { name: "Rent", amount: "$1,200.00", due: "Mar 18", status: "Scheduled" },
  { name: "Electricity", amount: "$86.40", due: "Mar 21", status: "Pending" },
  { name: "Internet", amount: "$59.99", due: "Mar 24", status: "Scheduled" },
];
