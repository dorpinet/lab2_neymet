# Практична робота № 2

**Тема:** Базові засоби системи типів TypeScript

Варіант 2: книжковий онлайн-магазин 
Використано: VS Code, Node.js, TypeScript, tsx, Git.

## Запуск

```
npm install
npm start
npx tsc --noEmit
```

## Налаштування проєкту

```
npm init -y
npm i -D typescript tsx @types/node
npx tsc --init
```

У `tsconfig.json`: `target: ES2022`, `module: NodeNext`, `moduleResolution: NodeNext`, `strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`. У `package.json` додано `"start": "tsx src/index.ts"`.

![npm init](screenshots/Screenshot%202026-10-15%20160505.png)
![Встановлення залежностей і tsc --init](screenshots/Screenshot_2026-10-15_160511.png)
Прим.: так як новий вид генерованого файлу tsconfig.json для мене був трохи незручним я переписала його трохи іншим чином

## Рівень 1

Типи `EntityId`, `BaseProduct`, `Product` (розширює базовий товар полями книги), функції `createProduct` і `calculateLineTotal` із валідацією: від'ємні ціна або кількість кидають `Error`.

![Рівень 1](screenshots/Screenshot%202026-10-15%20164934.png)

## Рівень 2

Типи `OrderStatus`, `DeliveryMethod`, `CartItem`, `TimestampMetadata`, `Order` (через перетин `&`). Функція `updateOrderStatus` повертає новий об'єкт і не дозволяє змінювати статус із `cancelled` та `delivered`. Функція `validateCustomerInput(input: unknown)` звужує тип через `typeof` і кидає `TypeError`, якщо це не рядок.

![Рівень 2](screenshots/Screenshot%202026-10-15%20173833.png)

## Рівень 3

Розпізнаване об'єднання `PaymentDetails` з дискримінатором `type` (`card`, `cash`, `online_service`), type guard `isCreditCardPayment`, маскування картки `maskCardNumber` і `processPayment` із вичерпною перевіркою через `never`.

![Рівень 3](screenshots/Screenshot%202026-10-15%20175250.png)

Перевірка типів без помилок (`npx tsc --noEmit` нічого не виводить):

![tsc --noEmit](screenshots/Screenshot%202026-10-15%20175954.png)

## Висновки

Налаштовано суворий режим TypeScript і змодельовано ядро книжкового магазину: інтерфейси, union та intersection типи, звуження типів із `unknown`, discriminated unions, користувацький type guard та exhaustiveness check через `never`.
