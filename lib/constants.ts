import Utilities from '@/public/images/expense-categories/utilities.svg';
import Food from '@/public/images/expense-categories/groceries.svg';
import Household from '@/public/images/expense-categories/household.svg';
import Medicament from '@/public/images/expense-categories/medicament.svg';
import Rent from '@/public/images/expense-categories/rent.svg';
import Clothes from '@/public/images/expense-categories/clothes.svg';
import SelfCare from '@/public/images/expense-categories/self-care.svg';
import Charity from '@/public/images/expense-categories/charity.svg';
import Education from '@/public/images/expense-categories/education.svg';
import Entertainment from '@/public/images/expense-categories/entertainment.svg';
import Auto from '@/public/images/expense-categories/car.svg';
import PublicTransport from '@/public/images/expense-categories/public-transport.svg';
import Repair from '@/public/images/expense-categories/repair.svg';
import Other from '@/public/images/expense-categories/other.svg';


export const WEEK_STARTS_FROM = [
  {
    value: '1',
    label: 'General.weekDays.sunday'
  },
  {
    value: '2',
    label: 'General.weekDays.monday'
  },
  {
    value: '3',
    label: 'General.weekDays.tuesday'
  },
  {
    value: '4',
    label: 'General.weekDays.wednesday'
  },
  {
    value: '5',
    label: 'General.weekDays.thursday'
  },
  {
    value: '6',
    label: 'General.weekDays.friday'
  },
  {
    value: '7',
    label: 'General.weekDays.saturday'
  },
]

export const CURRENCIES = [
  {
    value: 'usd',
    label: 'General.currencies.usd'
  },
  {
    value: 'eur',
    label: 'General.currencies.eur'
  },
  {
    value: 'uah',
    label: 'General.currencies.uah'
  },
  {
    value: 'rub',
    label: 'General.currencies.rub'
  },
  {
    value: 'pln',
    label: 'General.currencies.pln'
  },
];

export const LANGUAGES = [
  {
    value: 'en',
    label: 'General.languages.en'
  },
  {
    value: 'ru',
    label: 'General.languages.ru'
  },
  {
    value: 'ua',
    label: 'General.languages.ua'
  },
];

export const INCOME_SOURCES = [
  {
    value: 'cash',
    label: 'IncomesPage.income_sources.cash'
  },
  {
    value: 'investment',
    label: 'IncomesPage.income_sources.investment'
  },
  {
    value: 'salary',
    label: 'IncomesPage.income_sources.salary'
  },
  {
    value: 'pension',
    label: 'IncomesPage.income_sources.pension'
  },
  {
    value: 'money_transfer',
    label: 'IncomesPage.income_sources.money_transfer'
  },
  {
    value: 'rent',
    label: 'IncomesPage.income_sources.rent'
  },
  {
    value: 'refund',
    label: 'IncomesPage.income_sources.refund'
  },
  {
    value: 'cashback',
    label: 'IncomesPage.income_sources.cashback'
  },
];

export const ITEMS_PER_PAGE = [
  {
    value: '10',
    label: 'General.itemsPerPage.10'
  },
  {
    value: '15',
    label: 'General.itemsPerPage.15'
  },
  {
    value: '20',
    label: 'General.itemsPerPage.20'
  },
];

export const PAYMENT_METHODS = [
  {
    value: 'cash',
    label: 'ExpensesPage.payment_methods.cash'
  },
  {
    value: 'card',
    label: 'ExpensesPage.payment_methods.card'
  },
];

export const EXPENSE_CATEGORIES = [
  {
    value: 'utilities',
    label: 'ExpensesPage.expense_destinations.utilities',
    icon: Utilities
  },
  {
    value: 'food',
    label: 'ExpensesPage.expense_destinations.food',
    icon: Food
  },
  {
    value: 'household',
    label: 'ExpensesPage.expense_destinations.household',
    icon: Household
  },
  {
    value: 'medicament',
    label: 'ExpensesPage.expense_destinations.medicament',
    icon: Medicament
  },
  {
    value: 'rent',
    label: 'ExpensesPage.expense_destinations.rent',
    icon: Rent
  },
  {
    value: 'clothes',
    label: 'ExpensesPage.expense_destinations.clothes',
    icon: Clothes
  },
  {
    value: 'self_care',
    label: 'ExpensesPage.expense_destinations.self_care',
    icon: SelfCare
  },
  {
    value: 'charity',
    label: 'ExpensesPage.expense_destinations.charity',
    icon: Charity
  },
  {
    value: 'education',
    label: 'ExpensesPage.expense_destinations.education',
    icon: Education
  },
  {
    value: 'entertainment',
    label: 'ExpensesPage.expense_destinations.entertainment',
    icon: Entertainment
  },
  {
    value: 'auto',
    label: 'ExpensesPage.expense_destinations.auto',
    icon: Auto
  },
  {
    value: 'public_transport',
    label: 'ExpensesPage.expense_destinations.public_transport',
    icon: PublicTransport
  },
  {
    value: 'repair',
    label: 'ExpensesPage.expense_destinations.repair',
    icon: Repair
  },
  {
    value: 'other',
    label: 'ExpensesPage.expense_destinations.other',
    icon: Other
  },
];