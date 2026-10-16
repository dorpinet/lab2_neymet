type EntityId = string | number;

interface BaseProduct {
  readonly id: EntityId;
  title: string;
  price: number;
  description?: string; 
  tags: string[];
  inStock: boolean;
}
interface Product extends BaseProduct {
  isbn: string;
  pageCount: number;
  coverType: 'hard' | 'soft';
  author: string;
}
function createProduct(productData: Product): Product {
  if (productData.price < 0) {
    throw new Error('price cannot be negative!');
  }
  return { ...productData };
}
function calculateLineTotal(
  price: number,
  quantity: number,
  discountPercent: number = 0
): number {
  if (price < 0 || quantity < 0) {
    throw new Error('price n count cannot be negative');
  }
  return price * quantity * (1 - discountPercent / 100);
}
const book1 = createProduct({
  id: 1,
  title: 'The Metamorphosis',
  price: 250,
  tags: ['classic', 'fiction'],
  inStock: true,
  isbn: '978-0-553-21369-0',
  pageCount: 128,
  coverType: 'soft',
  author: 'Franz Kafka',
});

console.log(`created book: ${book1.title}, ${book1.author}, ${book1.price} UAH`);
console.log('total for 2 copies with 10% discount:', calculateLineTotal(book1.price, 2, 10));

try {
  calculateLineTotal(-5, 1);
} catch (error) {
  console.log('caught error:', error instanceof Error ? error.message : error);
}
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type DeliveryMethod = 'post_service' | 'courier' | 'ebook_download';
interface CartItem {
  product: Product;
  quantity: number;
}
type TimestampMetadata = { readonly createdAt: Date; updatedAt: Date };
type Order = {
  readonly orderId: string;
  customerEmail: string;
  items: CartItem[];
  status: OrderStatus;
  delivery: DeliveryMethod;
} & TimestampMetadata;
function updateOrderStatus(order: Order, newStatus: OrderStatus): Order {
  if (order.status === 'cancelled' || order.status === 'delivered') {
    throw new Error(`Cannot change status from '${order.status}'`);
  }
  return { ...order, status: newStatus, updatedAt: new Date() };
}
function validateCustomerInput(input: unknown): string {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }
  const cleaned = input.trim();
  if (cleaned === '') {
    throw new Error('String cannot be empty');
  }
  if (!cleaned.includes('@')) {
    throw new Error('Invalid email: missing @ symbol');
  }
  return cleaned;
}

const book2 = createProduct({
  id: 2,
  title: 'House of Leaves',
  price: 600,
  tags: ['horror', 'experimental'],
  inStock: true,
  isbn: '978-0-375-70376-4',
  pageCount: 709,
  coverType: 'soft',
  author: 'Mark Z. Danielewski',
});

const cart: CartItem[] = [
  { product: book1, quantity: 1 },
  { product: book2, quantity: 2 },
];

let total = 0;
for (const item of cart) {
  const line = calculateLineTotal(item.product.price, item.quantity);
  console.log(`${item.product.title} x ${item.quantity} = ${line} UAH`);
  total += line;
}
console.log('Order total:', total, 'UAH');

const email = validateCustomerInput('  customer@example.com ');

let order: Order = {
  orderId: 'ord-001',
  customerEmail: email,
  items: cart,
  status: 'pending',
  delivery: 'courier',
  createdAt: new Date(),
  updatedAt: new Date(),
};
console.log('Order created:', order.orderId, '| status:', order.status);
order = updateOrderStatus(order, 'processing');
order = updateOrderStatus(order, 'shipped');
order = updateOrderStatus(order, 'delivered');
console.log('Current status:', order.status);
try {
  updateOrderStatus(order, 'pending');
} catch (error) {
  console.log('Error:', error instanceof Error ? error.message : error);
}
try {
  validateCustomerInput(12345);
} catch (error) {
  console.log('Error:', error instanceof Error ? error.message : error);
}

interface CreditCardPayment {
  type: 'card';
  cardNumber: string;
  cardHolder: string;
  cvv: string;
}

interface CashOnDeliveryPayment {
  type: 'cash';
  cashAmountToPay: number;
}

interface OnlineServicePayment {
  type: 'online_service';
  serviceName: 'ApplePay' | 'GooglePay';
  transactionRef: string;
}
type PaymentDetails = CreditCardPayment | CashOnDeliveryPayment | OnlineServicePayment;
function isCreditCardPayment(payment: PaymentDetails): payment is CreditCardPayment {
  return payment.type === 'card';
}
function maskCardNumber(payment: PaymentDetails): string {
  if (isCreditCardPayment(payment)) {
    const digits = payment.cardNumber.replace(/\D/g, '');
    return `**** **** **** ${digits.slice(-4)}`;
  }
  return 'masking is not required';
}
function processPayment(payment: PaymentDetails, amount: number): string {
  switch (payment.type) {
    case 'card':
      return `Successfully charged ${amount} UAH from the card of ${payment.cardHolder}.`;
    case 'cash':
      if (payment.cashAmountToPay > amount) {
        const change = payment.cashAmountToPay - amount;
        return `Prepare change: ${change} UAH.`;
      }
      return `Exact cash amount to receive on delivery: ${amount} UAH.`;
    case 'online_service':
      return `${payment.serviceName} authorized successfully (ref: ${payment.transactionRef}).`;
    default: {
      const _exhaustiveCheck: never = payment;
      throw new Error(`Unknown payment type: ${String(_exhaustiveCheck)}`);
    }
  }
}
console.log('\n=== PAYMENT PROCESSIN ===');

const cardPayment: PaymentDetails = {
  type: 'card',
  cardNumber: '4111 1111 1111 8821',
  cardHolder: 'Dora Bebebe',
  cvv: '123',
};

const cashPayment: PaymentDetails = {
  type: 'cash',
  cashAmountToPay: 1500,
};

const onlinePayment: PaymentDetails = {
  type: 'online_service',
  serviceName: 'ApplePay',
  transactionRef: 'txn-77421',
};

for (const payment of [cardPayment, cashPayment, onlinePayment]) {
  console.log(`method: ${payment.type}`);
  console.log(`masking: ${maskCardNumber(payment)}`);
  console.log(`result: ${processPayment(payment, total)}`);
  console.log('---');
}