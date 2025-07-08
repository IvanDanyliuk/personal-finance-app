import Savings from '@/public/images/expense-categories/savings.svg';
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
import Visa from '@/public/images/payment-systems/visa.svg';
import MasterCard from '@/public/images/payment-systems/mastercard.svg';
import PayPal from '@/public/images/payment-systems/paypal.svg';
import AmEx from '@/public/images/payment-systems/amex.svg';
import { AccountType } from './types/bank';


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
    label: 'IncomesPage.income_sources.cash',
    color: 'hsl(var(--primary-9))'
  },
  {
    value: 'investment',
    label: 'IncomesPage.income_sources.investment',
    color: 'hsl(var(--primary-8))'
  },
  {
    value: 'salary',
    label: 'IncomesPage.income_sources.salary',
    color: 'hsl(var(--primary-7))'
  },
  {
    value: 'pension',
    label: 'IncomesPage.income_sources.pension',
    color: 'hsl(var(--primary-6))'
  },
  {
    value: 'money_transfer',
    label: 'IncomesPage.income_sources.money_transfer',
    color: 'hsl(var(--primary-5))'
  },
  {
    value: 'rent',
    label: 'IncomesPage.income_sources.rent',
    color: 'hsl(var(--primary-4))'
  },
  {
    value: 'refund',
    label: 'IncomesPage.income_sources.refund',
    color: 'hsl(var(--primary-3))'
  },
  {
    value: 'cashback',
    label: 'IncomesPage.income_sources.cashback',
    color: 'hsl(var(--primary-2))'
  },
  {
    value: 'replenishment',
    label: 'IncomesPage.income_sources.replenishment',
    color: 'hsl(var(--secondary-3))'
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

export const PAYMENT_SYSTEMS = [
  {
    value: 'visa',
    label: 'ExpensesPage.payment_systems.visa',
    icon: Visa
  },
  {
    value: 'mastercard',
    label: 'ExpensesPage.payment_systems.mastercard',
    icon: MasterCard
  },
  {
    value: 'paypal',
    label: 'ExpensesPage.payment_systems.paypal',
    icon: PayPal
  },
  {
    value: 'amex',
    label: 'ExpensesPage.payment_systems.amex',
    icon: AmEx
  },
];

export const EXPENSE_CATEGORIES = [
  {
    value: 'for_savings',
    label: 'ExpensesPage.expense_destinations.for_savings',
    icon: Savings,
    color: 'hsl(var(--primary-7))'
  },
  {
    value: 'utilities',
    label: 'ExpensesPage.expense_destinations.utilities',
    icon: Utilities,
    color: 'hsl(var(--primary-9))'
  },
  {
    value: 'food',
    label: 'ExpensesPage.expense_destinations.food',
    icon: Food,
    color: 'hsl(var(--primary-8))'
  },
  {
    value: 'household',
    label: 'ExpensesPage.expense_destinations.household',
    icon: Household,
    color: 'hsl(var(--primary-7))'
  },
  {
    value: 'medicament',
    label: 'ExpensesPage.expense_destinations.medicament',
    icon: Medicament,
    color: 'hsl(var(--primary-6))'
  },
  {
    value: 'rent',
    label: 'ExpensesPage.expense_destinations.rent',
    icon: Rent,
    color: 'hsl(var(--primary-5))'
  },
  {
    value: 'clothes',
    label: 'ExpensesPage.expense_destinations.clothes',
    icon: Clothes,
    color: 'hsl(var(--primary-4))'
  },
  {
    value: 'self_care',
    label: 'ExpensesPage.expense_destinations.self_care',
    icon: SelfCare,
    color: 'hsl(var(--primary-3))'
  },
  {
    value: 'charity',
    label: 'ExpensesPage.expense_destinations.charity',
    icon: Charity,
    color: 'hsl(var(--primary-2))'
  },
  {
    value: 'education',
    label: 'ExpensesPage.expense_destinations.education',
    icon: Education,
    color: 'hsl(var(--primary-1))'
  },
  {
    value: 'entertainment',
    label: 'ExpensesPage.expense_destinations.entertainment',
    icon: Entertainment,
    color: 'hsl(var(--primary-9))'
  },
  {
    value: 'auto',
    label: 'ExpensesPage.expense_destinations.auto',
    icon: Auto,
    color: 'hsl(var(--primary-8))'
  },
  {
    value: 'public_transport',
    label: 'ExpensesPage.expense_destinations.public_transport',
    icon: PublicTransport,
    color: 'hsl(var(--primary-7))'
  },
  {
    value: 'repair',
    label: 'ExpensesPage.expense_destinations.repair',
    icon: Repair,
    color: 'hsl(var(--primary-6))'
  },
  {
    value: 'other',
    label: 'ExpensesPage.expense_destinations.other',
    icon: Other,
    color: 'hsl(var(--primary-5))'
  },
];

export const COUNTRIES = [
  {
    value: 'at',
    label: 'General.countries.at'
  },
  {
    value: 'be',
    label: 'General.countries.be'
  },
  {
    value: 'bg',
    label: 'General.countries.bg'
  },
  {
    value: 'cz',
    label: 'General.countries.cz'
  },
  {
    value: 'dk',
    label: 'General.countries.dk'
  },
  {
    value: 'de',
    label: 'General.countries.de'
  },
  {
    value: 'ee',
    label: 'General.countries.ee'
  },
  {
    value: 'ie',
    label: 'General.countries.ie'
  },
  {
    value: 'el',
    label: 'General.countries.el'
  },
  {
    value: 'es',
    label: 'General.countries.es'
  },
  {
    value: 'fr',
    label: 'General.countries.fr'
  },
  {
    value: 'hr',
    label: 'General.countries.hr'
  },
  {
    value: 'it',
    label: 'General.countries.it'
  },
  {
    value: 'cy',
    label: 'General.countries.cy'
  },
  {
    value: 'lv',
    label: 'General.countries.lv'
  },
  {
    value: 'lt',
    label: 'General.countries.lt'
  },
  {
    value: 'lu',
    label: 'General.countries.lu'
  },
  {
    value: 'hu',
    label: 'General.countries.hu'
  },
  {
    value: 'mt',
    label: 'General.countries.mt'
  },
  {
    value: 'nl',
    label: 'General.countries.nl'
  },
  {
    value: 'pl',
    label: 'General.countries.pl'
  },
  {
    value: 'pt',
    label: 'General.countries.pt'
  },
  {
    value: 'ro',
    label: 'General.countries.ro'
  },
  {
    value: 'sl',
    label: 'General.countries.sl'
  },
  {
    value: 'sk',
    label: 'General.countries.sk'
  },
  {
    value: 'fi',
    label: 'General.countries.fi'
  },
  {
    value: 'se',
    label: 'General.countries.se'
  },
  {
    value: 'is',
    label: 'General.countries.is'
  },
  {
    value: 'li',
    label: 'General.countries.li'
  },
  {
    value: 'no',
    label: 'General.countries.no'
  },
  {
    value: 'ch',
    label: 'General.countries.ch'
  },
  {
    value: 'ba',
    label: 'General.countries.ba'
  },
  {
    value: 'me',
    label: 'General.countries.me'
  },
  {
    value: 'md',
    label: 'General.countries.md'
  },
  {
    value: 'mk',
    label: 'General.countries.mk'
  },
  {
    value: 'ge',
    label: 'General.countries.ge'
  },
  {
    value: 'al',
    label: 'General.countries.al'
  },
  {
    value: 'rs',
    label: 'General.countries.rs'
  },
  {
    value: 'tr',
    label: 'General.countries.tr'
  },
  {
    value: 'ua',
    label: 'General.countries.ua'
  },
  {
    value: 'xk',
    label: 'General.countries.xk'
  },
  {
    value: 'am',
    label: 'General.countries.am'
  },
  {
    value: 'az',
    label: 'General.countries.az'
  },
  {
    value: 'by',
    label: 'General.countries.by'
  },
  {
    value: 'dz',
    label: 'General.countries.dz'
  },
  {
    value: 'eg',
    label: 'General.countries.eg'
  },
  {
    value: 'il',
    label: 'General.countries.il'
  },
  {
    value: 'jo',
    label: 'General.countries.jo'
  },
  {
    value: 'ar',
    label: 'General.countries.ar'
  },
  {
    value: 'au',
    label: 'General.countries.au'
  },
  {
    value: 'br',
    label: 'General.countries.br'
  },
  {
    value: 'ca',
    label: 'General.countries.ca'
  },
  {
    value: 'cn_x_hk',
    label: 'General.countries.cn_x_hk'
  },
  {
    value: 'hk',
    label: 'General.countries.hk'
  },
  {
    value: 'in',
    label: 'General.countries.in'
  },
  {
    value: 'jp',
    label: 'General.countries.jp'
  },
  {
    value: 'mx',
    label: 'General.countries.mx'
  },
  {
    value: 'ng',
    label: 'General.countries.ng'
  },
  {
    value: 'nz',
    label: 'General.countries.nz'
  },
  {
    value: 'ru',
    label: 'General.countries.ru'
  },
  {
    value: 'sg',
    label: 'General.countries.sg'
  },
  {
    value: 'za',
    label: 'General.countries.za'
  },
  {
    value: 'kr',
    label: 'General.countries.kr'
  },
  {
    value: 'tw',
    label: 'General.countries.tw'
  },
  {
    value: 'uk',
    label: 'General.countries.uk'
  },
  {
    value: 'us',
    label: 'General.countries.us'
  },
];

export const MAX_IMAGE_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ACCOUNT_TYPES = [
  {
    value: AccountType.BankAccount,
    label: 'General.accountTypes.bank_account'
  },
  {
    value: AccountType.Jug,
    label: 'General.accountTypes.jug'
  },
];

export const MONTHS = [
  'january', 
  'february', 
  'march', 
  'april', 
  'may', 
  'june', 
  'july', 
  'august', 
  'september', 
  'october', 
  'november', 
  'december'
];


