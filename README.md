# Проектная работа "Web-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Типы для выбора способа оплаты:

```
export type TPayment = 'Online' | 'Receipt';

```
Типы для категории товаров:

```
export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

```

Интерфейс описывающий данные товара:

```
export interface IProductCard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean
}

```

Интерфейс товаров, добавленных в корзину:

```
export interface ICardBasket {
	index: number;
	title: string;
	price: string | null;
}

```

Интерфейс событий:

```
export interface IActions {
	onClick: (event: MouseEvent) => void;
}

```

Интерфейс для форм оформления заказа:

```
export interface IOrderForm {
  payment?: TPayment;
  address?: string;
  email?: string;
  phone?: string;
  total?: string | number;
}


```
Интерфейс заказа для AppState:

```
export interface IOrder extends IOrderForm {
  items: string[];
}

```
Интерфейс заказа для отправки на сервер:

```
export interface OrderModelPost extends IOrderForm {
  items: string[];
  total: number
}

```
Интерфейс ошибок заполнения формы:

```
export interface IFormError {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

```

Интерфейс ответа с сервера после отправки заказа:

```
export interface OrderModelGet {
  id: string
  total: number
}

```

Интерфейс данных приложения:

```
export interface IAppState {
  setCatalog(items:IProductCard[]):void;
  getCatalog(): IProductCard[];
  getProduct(id:number): IProductCard;
  addItemToBasket(item:IProductCard):void;
  removeFromBasket(id:string):void;
  clearBasket(): void;
  getTotalPrice():number;
  getBasketQuantity(): number;
  getBasketList():IProductCard[];
  setOrderField(field: keyof IOrderForm, value: string): void;
  validateOrder(): boolean;
  clearOrder(): void;
}

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:\

— слой представления, отвечает за отображение данных на странице\
— слой данных, отвечает за хранение и изменение данных\
— презентер, отвечает за связь слоя данных и слоя представления\

Взаимодействия внутри приложения происходят через события.\
Модели инициализируют события,слушатели событий в основном коде
выполняют передачу данных компонентам отображения,а также вычислениями\
между этой передачей, и еще они меняют значения в моделях.

1. Загружаются данные в AppSate из ProductApi
2. Создаем класс AppState
3. Создаем класс который отрисовывает страницу, и в него передаем AppState


### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый\
адрес сервера и опциональный объект с заголовками запросов.\

поля:\
— `baseUrl:string` — Базовый URL для API запросов\
— `options: RequestInit` — Опции для настройки запросов.\

Конструктор принимает аргументы:\
— `baseUrl:string` — Базовый URL для API запросов\
— `options: RequestInit` — Опции для настройки запросов.\
Методы:\
— `handleResponse(response: Response): Promise<object>` - Обрабатывает ответ от API. Если ответ успешный (response.ok равно true), метод возвращает результат в формате JSON. В случае неудачи, метод пытается извлечь сообщение об ошибке из тела ответа и отклоняет Promise с этой ошибкой или со статусом ответа.\
— `get(uri: string)` - выполняет GET запрос и возвращает промис с объектом, который пришел с сервера\
— `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными, которые будут переданы в JSON в теле запроса,и отправляет эти данные на эндпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть изменен заданием третьего параметра при вызове.

#### Класс Component

Базовый абстрактный класс для создания компонентов с предоставлением общего инструментария для работы с DOM.\

Конструктор принимает аргументы:\
— `container: HTMLElement` — Принимает DOM-элемент, который служит контейнером для компонента.\

методы:\
— `toggleClass((element: HTMLElement, className: string, force?: boolean)): void` — переключатель классов\
— `setText(element: HTMLElement, value: unknown): void` — установить текстовое содержимое\
— `setDisabled(element: HTMLElement, state: boolean): void` — сменить статус блокировки\
— `setHidden(element: HTMLElement): void` — скрыть элемент\
— `setVisible(element: HTMLElement): void` — показать элемент\
— `setImage(element: HTMLImageElement, src: string, alt?: string): void` — установить изображение с алтернативным текстом\
— `render(data?: Partial<T>): HTMLElement` — вернуть корневой DOM-элемент\

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе.\
Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

— `on` - для подписки на событие.\
— `off` - для отписки от события.\
— `emit` - уведомления подписчиков о наступлении события соответственно.\
— `onAll` - для подписки на все события.\
— `offAll` - сброса всех подписчиков.\
— `trigger` - генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.

#### Класс Model

Специальный абстрактный класс, определяющий конструктор всех моделей приложения\
(который принимает часть данных дженерика, привязанного к интерфейсу модели, а также инстанс\
брокера событий, который реализует IEvents), а также метод emitChanges для сообщения об\ 
изменении внутренних данных используя EventEmitter\

### Слой данных

#### class AppState
Класс является моделью данных в целом, содержит все основные группы данных и методы для работы с ними

поля:\
— `catalog: IProductCard[]` — массив каточек товара\
— `basket: IProductCard[] = []` — каталог с купленными товарамие\
— `order: IOrder` — данные для отправки на сервер\
— `formErrors: FormErrors` — данные ошибок заполнения форм\

методы:\
— `setСatalog(item: IProductCard[]): void` — Установить каталог с товарами\
— `getCatalog(): IProductCard[]: void` — Получить каталог с товарами\
— `getProduct(id: string): IProductCard` — Получить карточку с товаром\
— `addItemToBasket(item: Product): void` — Добавить товар в корзину\
— `removeFromBasket(id: string): void` — Удалить товар из корзины\
— `clearBasket():void` — Очистить корзину\
— `getTotalPrice():void` — Вывод итоговой стоимости\
— `getBasketQuantity(): void` — Вывод количества товаров находящихся в корзине\
— `getBasketList(): IProductCard[]` — Вывод товаров находящихся в корзине\
— `setOrderField(field: keyof IOrderForm, value: string): void` — методы предназначен для\
установки значений в объекте заказа order и валидации введенных данных.\
— `setContactField(field: keyof IOrderForm, value: string): void` — методы предназначен для\
установки значений в объекте заказа order и валидации введенных данных.\
— `validateForms(): boolean` — валидация форм\
— `clearOrder()` — Очистка данных заказа\


### Слой представления

#### class Card

Предназначен для отображения списка карточек товара\
Наследует класс Component<IProductCard>\
поля:\
— `_category: HTMLElement` — катерогия товара\
— `_title: HTMLElement` — заголовок товара\
— `_image: HTMLImageElement` — картинка товара\
— `_price: HTMLElement` — цена товара\
— `_id: string` — id товара\
— `_priceValue: number | null` — типизация цены товара\

Конструктор принимает аргументы:\
— `blockName: string` — идентификатор для поиска элементов внутри контейнера\
— `container: HTMLElement` — контейнер HTML элемент\
— `events: IEvents` — объект для работы с событиями\
— `actions?: IActions` — объект для работы с событиями

методы:\
— `set id(value: string)` — установка id\
— `get id(): string` — получение id\
— `set title(value: string)` — установка заголовка\
— `get title(): string` — получение заголовка\
— `set image(value: string)` — установка картинки\
— `set price(value: number | null)` — установка цены\
— `get price(): number | null` — получение цены\
— `set category(value: CategoryType)` — установка категории\

#### class CardPreview

Отвечает за отображение выбраной карточки в модальном окне\
Наследует класс Card

поля:\
  `_description: HTMLElement` — описание товара
  `_button: HTMLButtonElement` — кнопка длядобавления товара в корзину

Конструктор принимает аргументы:
— `container: HTMLElement` — контейнер карточки товара
— `events: IEvents` — объект для работы с событиями

методы:\
— `set selected` — установка значения была ли карточка добавлена в корзину\
— `set description` — устанавливает описание
— `get description()` — получает описание

#### class CardBasket

Отвечает за отображение карточки товара в корзине

поля:\
— `_title: HTMLElement` — заголовок товара\
— `_index: HTMLElement` — индекс товара\
— `_price: HTMLElement` — цена товара\
— `_deleteButton: HTMLButtonElement` — разметка для кнопки удаления товара\

Конструктор принимает аргументы:
— `blockName: string` — идентификатор для поиска элементов внутри контейнера\
— `container: HTMLElement` — контейнер HTML элемент\
— `actions?: IActions` — объект для работы с событиями

методы:\
— `set index(value: number)` — устанавливает индекс\
— `set title(value: string)` — устанавливает заголовок\
— `set price(value: number | null)` — устанавливает цену\
— `set id(id: string)` — устанавливает id\

#### class Basket

Отвечает за вывод списка товараов в корзине
Наследует класс Component<IBasket>\

поля:\
— `basketList: HTMLElement` — место куда вставляется список карточек
— `total: HTMLElement` — итоговая цена
— `button: HTMLButtonElement` — кнопка для перехода к оформлению покупки\

Конструктор принимает аргументы:
— `container: HTMLElement` — контейнер HTML элемент\
— `events: EventEmitter` — объект для работы с событиями\

методы:\
— `set items(items: HTMLElement[])` — установка карточек находящихся в корзине\
— `set totalPrice(total: number)` — установка итоговой стоимости\
— `getContainer(): HTMLElement` — получение контейнера с версткой HTML\

#### class Form<T>

Отображение формы. Контролирует отображение ошибок валидации формы,\
предоставляет возможности по прослушиванию событий отправки формы,\
а также внесения изменений в поля формы\
Наследуется от Component<IFormState>\

поля:\
— `_submit: HTMLButtonElement` — разметка кнопки типа сабмит.
— `_errors: HTMLElement` — разметка для вывода ошибки

Конструктор принимает аргументы:
— `container: HTMLFormElement` — контейнер с формой
— `events: IEvents` — объект для работы с событиями

методы:\
— `onInputChange(field: keyof T, value: string)` — функция создания события при изменении инпута
— `set valid(value: boolean)` — установка валидного значения
— `set errors(value: string)` — установка ошибок
— `render(state: Partial<T> & IFormState)` — рендер формы

#### class FormOrder

Отобаражение формы с вводом данных email т телефона\
Наследует класс Form<IOrderForm> \

поля:\
— `online: HTMLButtonElement` — разметка кнопки выбора оплаты картой\
— `recipt: HTMLButtonElement` — разметка кнопки выбора оплаты при получении\

Конструктор принимает аргументы:
— `container: HTMLFormElement` — контейнер с формой
— `events: IEvents` — объект для работы с событиями

методы:\
— `toggleActiveButton(button: 'online' | 'recipt')` — переключение класса активной кнопки
— `set address(value: string)` — устанавливает адрес
— `disableButtons()` — снимает активный класс с обеих кнопок

#### class FormContacts

Отобаражение формы с вводом данных email т телефона\
Наследует класс Form<IOrderForm> \

Конструктор принимает аргументы:
— `container: HTMLFormElement` — контейнер с формой
— `events: IEvents` — объект для работы с событиями

методы:\
— `set email(value: string)` — устанавливает класс активности на кнопку
— `set phone(value: string)` — устанавливает класс активности на кнопку

#### class Modal
Отвечает за отображение модального окна\
наследует класс Component<IModalData>\

поля:\
— `_closeButton: HTMLButtonElement` — кнопка закрытия модального окна
— `_content: HTMLElement` — разметка для вставки контента

Конструктор принимает аргументы:
— `container: HTMLElement` — темплейт превью корзины
— `events: IEvents` — объект для работы с событиями

методы:\
— `set content(value: HTMLElement | null)` —  установка контента
— `open()` —  открытие модального окна
— `close()` —  закрытие модального окна
— `isActive(): boolean ` —  проверка активно ли модальное окно
— `render(data: IModalData): HTMLElement` —  рендер содержимого


#### class Page
Отвечает за разметку страницы\ 
Наследует класс Component<IPage>\

поля:\
— `_catalog: HTMLElement` — разметка каталога товаров
— `_basket: HTMLElement` — разметка для корзины
— `_basketCounter: HTMLElement` — разметка для вывода количства товаров в корзине
— `_wrapper: HTMLElement` — размерка обертки страницы

Конструктор принимает аргументы:
— `container: HTMLElement` — контейнер с HTML элементом
— `events: IEvents` — объект для работы с событиями

методы:\
— `set counter(value: number)` —  установка количества товаров
— `set catalog(items: HTMLElement[])` —  установка каталога
— `set locked(value: boolean)` —  блокировка прокрутки страницы

#### class Success
Отвечает за вывод модального окна успешной покупки\ 
Component<ISuccess>\

поля:\
— `_buttonclose: HTMLElement` — кнопка закрытия
— `_description: HTMLElement` — описание итогового ценника

Конструктор принимает аргументы:
— `container: HTMLElement` — контейнер с HTML элементом
— `events: IEvents` — объект для работы с событиями

методы:\
— `set total(value: number)` —  установка итоговой цены

### Презентер
Код, описывающий взаимодействие представления и данных между собой находится в файле index.ts,\
 выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих\ событий, описанных в `index.ts`\
В index.ts сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.\

### Дополнительные классы

#### Класс ProductApi

Наследует класс Api, реализует метод получения карточек товара и взимодействует с сервисом из слоя презентер
основыне поля:
— `cdn:string` — хранит входящий url

Конструктор принимает аргументы:\
— `cdn:string` — хранит входящий url\
— `baseUrl:string` — базовый URL для API запросов.\
— `options?: RequestInit` — опции для настройки запросов\
(необязательный параметр, передается в конструктор базового класса Api).

методы:\
— `getProductCardList():Promise<IProductCard[]>` —  Выполняет GET-запрос для получения списка продуктов,\
используя метод get базового класса Api. Затем обрабатывает ответ, который ожидается в формате\
ApiListResponse<IProductCard>, и возвращает массив продуктов (`IProductCard[]`).\
— `getProductCard(id:string):Promise<IProductCard>` — Выполняет GET-запрос для получения карточки товара,\
используя метод get базового класса Api.Аргументом передается id запрашиваемой карточки. Затем обрабатывает\
ответ, который ожидается в формате ApiListResponse<IProductCard>, и возвращает запрашиваемую карточку (`IProductCard`).

#### Класс OrderApi

Наследует класс Api, реализует отправки заказа на сервер и взимодействует с сервисом из слоя презентер
поля:
— `cdn` — хранит входящий url

Конструктор принимает аргументы:\
— `cdn:string` — хранит входящий url\
— `baseUrl:string` — базовый URL для API запросов.\
— `options?: RequestInit` — опции для настройки запросов\
(необязательный параметр, передается в конструктор базового класса Api).

методы:\
— `orderProducts(order: IOrder):Promise<OrderResponseModel>` —  Выполняет POST-запрос для создания заказа, 
отправляя данные заказа взятые из слоя представления.
Обрабатывает ответ, который ожидается в формате `OrderResponseModel`, и возвращает этот результат.

Описание взаимодействия:\
Метод orderProducts получает данные заказа из слоя представления, что означает, что он не связан с моделями API напрямую. 
Вместо этого он принимает объект типа IOrder, который формируется и предоставляется слоем представления (view layer).
Это отделяет логику представления от логики API, обеспечивая более чистую архитектуру и разделение ответственности.

#### Описание событий

`items:changed` —  Инициируется при изменении списка товаров и вызывает перерисовку\
списка товаров на странице.\
`cardItem:open` — Инициируется при клике по карточке товара в списке и открывает модальное окно с полным\ описанием карточки и кнопкой добавить в корзину\
`card:addtobasket` — Инициируется при клике на кнопку "В корзину" на карточке CardPreivew
В AppState добавляет товар в корзину, обновляет счётчик на корзине в классе Page\
`basket:open` — Инициируется при клике на кнопку "корзина" и открывает модальное окно
с классом Basket, где отображаются товары добавленные в корзину\
`basket:delete` — Инициируется при клике на кнопку удаления товара в корзине\ 
— Удаляет товар из массива basket в классе AppState\
— Обновляет счётчик корзины на странице\
— Обновляет сумму заказа в корзине\
— Обвновляет порядковые номера в списке корзины\
`orderform:open` — Инициируется при клике на кнопку "Оформить" в корзине открывает окно с формой для
заполнения адреса и способа оплаты\
`formErrors:change` —  Изменение состояния валидации форм
`/^order\..*:change/` — Все соытия которые начинаются на order и заканчиваются на change записывают введенные данные в AppData\
`/^contacts\..*:change/` —  Все соытия которые начинаются на contacts и заканчиваются на change записывают введенные данные в AppData\
`order:submit` — нажимаем на кнопку далее в модальном окне с заполнением способа оплаты и адреса\
передаем в appData значение итоговой стоимости и отрисовываем модальное окно с для заполнения email и телефона
`contacts:submit` — Инициализируется при нажатии на кнопку оплатить\
через appData создается массив с id купленных товаров заполняются поля для order\
отправляется заказ на сервер, после успешного ответа открывается модальное окно успешной покупки,\
чистится корзина, чистится данные заказа, обнуляется каунтер, возвращаем дизейбл кнопок в исходное состояние
`order:success` — вывод модального окна успешной покупки 
`sucess:close` — закрытие модального окна успешной покупки