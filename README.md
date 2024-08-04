# Проектная работа "Веб-ларек"

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
## Описание проекта

Проект "Веб-ларек" реализует пример типового веб магазина. Пользователь может просматривать список товаров, выбирать товар и добавлять его в корзину. Проект реализован на TypeScript и представляет собой SPA (Single Page Application) с использованием API для получения данных о товарах.

Особенности реализации:
— можно добавлять разные товары в корзину в разном количестве;
— список товаров обновляется раз в сутки;;
— до оформления заказа содержимое корзины сохраняется в localStorage;
— после успешного заказа контактные данные сохраняются в localStorage и подставляются в форму заказа в следующий раз.

## Описание интерфейса

Интерфейс можно условно разделить на 3 процесса:
1. Просмотр списка товаров (MainScreen)
2. Выбор товаров (AddToBasket)
3. Оформление заказа (BasketScreen, OrderScreen, SuccessScreen)

Так как модальные окна в проекте однотипные, то их общая логика и структура вынесена в абстрактный класс ModalScreen. Все модальные окна наследуются от него и переопределяют методы для своих нужд.

## Структура проекта

.
├── src/
│   ├── common.blocks/ [Стили компонент верстки]
│   ├── components/ [Реализация]
│   │   ├── base/ [Базовый код]
│   │   ├── model/ [Модели данных и АПИ]
│   │   ├── view/ [Отображения]
│   │   │   ├── common/ [Общие]
│   │   │   ├── partial/ [Частичные]
│   │   │   ├── screen/ [Верхнеуровневые, экраны]
│   │   ├── controller/
│   ├── pages/
│   │   ├── index.html [Основная страница и шаблоны компонент]
│   ├── types/ [Типизация]
│   │   ├── components/
│   │   │   ├── base/ [Базовый код]
│   │   │   ├── model/ [Модели данных и АПИ]
│   │   │   ├── view/ [Отображения]
│   │   ├── global.d.ts [Глобальные типы, расширение окружения]
│   │   ├── settings.ts [Типизация настроек]
│   │   ├── html.ts [Типизация настроек]
│   ├── utils/
│   │   ├── constants.ts [Настройки проекта]
│   │   ├── html.ts [Утилиты для работы с DOM]
├── api.yaml [Спецификация API]

## Архитектура проекта (MVC)

Реализована единая модель данных приложения в файле `src/components/model/AppState.ts`, содержащая всю логику работы с данными и возможные действия над ними. Все изменения данных происходят через методы модели, а она в свою очередь уведомляет об изменениях через метод настроек `onChange(changes: AppStateChanges)` чтобы не зависеть от конкретного способа коммуникации между компонентами. Подключение модели к системе событий производится через обертку `src/components/model/AppStateEmitter.ts`.

Экземпляр модели передается в контроллеры, которые по факту являются обработчиками пользовательских действий и обновляют состояние модели через ее методы. Экземпляры контроллеров передаются в качестве объекта содержащего обработчики событий в верхнеуровневые отображения (экраны).

При обработке событий возникающих в AppStateEmitter производится обновление данных в верхнеуровневых отображениях. Экраны это фактически крупные сборки инкапсулирующие детали реализации интерфейса и принимающие из вне только обработчики событий и необходимые данные. Экраны внутри составлены из более мелких отображений, которые инициализируют с помощью глобальных настроек проекта и распределяют данные между вложенными отображениями через свойства и метод `render()`.

Общую цепочку взаимодействия можно представить следующим образом:

```typescript
const api = new Api(); // Инициализация API
const app = new ModelEmitter(api); // Инициализация модели и событий
const screen = new Screen( // Инициализация экрана
    // экран ждет объект с обработчиками событий, например { onClick: () => void }
	new Controller( // Инициализация контроллера
        /* { // Обработчики событий
            onClick: () => {
                app.model.value += 1;
            }
        }*/
		app.model // Передача модели в контроллер
    )
);

app.on('change:value', () => {
	screen.value = app.model.value;
});

// Screen.onClick -> Controller.onClick -> Model.value -> Screen.value
```

И таким образом соединяем между собой все компоненты приложения.

### Отображения

Отображения в проекте разделены на три типа:
- `common` — общие компоненты, не зависящие от доменной области проекта
- `partial` — частичные компоненты, реализующие доменную область проекта
- `screen` — верхнеуровневые компоненты, которые являются экранами приложения

Первые два типа (common и partial) независимо типизированы, не используют глобальных настроек напрямую и могут быть легко переносимы между проектами. Экраны (screen) же зависят от глобальных настроек и используют их для инициализации и передачи данных между вложенными отображениями, так как по факту это соединительный код для удобства вынесенные в отдельные файлы и оформленный как отображение.

Каждое отображение (кроме Screen) устроено следующим образом:

```typescript
// Базовое отображение
abstract class View<T, S extends object> implements IView<T, S> {
	// чтобы при копировании создавать дочерний класс, не зная его имени
	['constructor']!: new (root: HTMLElement, settings: S) => this;
	// введем кеш чтобы не пересоздавать и не искать повторно элементы
	protected cache: Record<string, HTMLElement> = {};

	// конструктор с элементом и настройками,
	// в простейшем виде без проверок и дефолтных значений
	constructor(public element: HTMLElement, protected readonly settings: S) {}

	// копирующий конструктор, чтобы настроить один раз
	// и дальше использовать копии отображения везде,
	// но при желании можем что-то поменять, например обработчики событий
	copy(settings?: S) {}

	// методы жизненного цикла
	// начальная инициализация, здесь можно создать элементы, повесить слушатели и т.д.
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected init() {}

	// рендер, вызывается когда надо обновить отображение с данными
	render(data: Partial<T>): HTMLElement {
		// Простая реализация рендера позволяющая, в том числе
		// установить сеттеры для отдельных полей
		// и вызывать их через поверхностное копирование.
	}

	// ... другие методы которые помогут строить отображение

	// Обернем метод проверки элемента из утилит в кеш, чтобы повторно не искать по DOM
	protected ensure() {}

	// замена элемента на другой или его обновлённую версию
	// с проверкой существования обоих
	protected setElement() {}

	protected ensureTemplate(query: string) {}

	protected create(){}

	setVisibility() {}

	// метод для универсальной установки свойств тега
	protected setValue() {}
}
```

Если необходимо использовать в одном отображении другие, то передаем их через настройки, не создавая зависимость напрямую. Пример:

```typescript
interface ChildData {
    value: number;
}

interface ComponentData {
	content: ChildData;
}

interface ComponentSettings {
	contentView: IView<ChildData> // Ждем отображение принимающее данные типа ChildData
}

class Component extends View<Тип_данных, Тип_настроек> {
    set content(data: ChildData) {
        this.settings.contentView.render(data);
        // или this.settings.contentView.value = data.value; 
    }
}
```

Если нужно использовать переданное отображение как шаблон, то можно использовать метод `copy()` — копирующие конструктор, который создает новый экземпляр отображения с теми же настройками (но их можно переопределить через параметры метода).


### Модели

Модели в проекте представлены классом `AppState`, который содержит в себе все данные и логику работы с ними. Модель частично реализует паттерн "Наблюдатель", и уведомляет об изменениях через метод `onChange(changes: AppStateChanges)`. Для удобства работы с данными в модели реализованы методы для изменения данных, которые в свою очередь вызывают метод `onChange()`.

В целом типовая модель данных выглядит следующим образом:

```typescript
enum ModelChanges {
    // Изменения в модели
    value = 'change:value'
}

interface ModelSettings {
    // Настройки модели
    onChange(changes: ModelChanges): void;
}

class Model {
    constructor(
			protected api: Api, // API для работы с данными
            protected settings: ModelSettings // Настройки и обработчики событий
    ) {
        // Инициализация модели
    }

    // Методы для изменения данных
    public changeValue(value: number) {
        // Изменение данных
        this.onChange(ModelChanges.value);
    }
}
```
### Базовый код

Класс API- реализует работу API, содержит свойства baseUrl(только для чтения) и options.

Конструктор принимает такие аргументы:
baseUrl: string
options: RequestInit

Методы:
protected handleResponse(response: Response): Promise<object>
get(url: string)
post(uri: string, data: object, method: ApiPostMethods = 'POST')

 Класс Controller:

 Контроллеры в проекте представлены классами унаследованными от `Controller`, и являются обработчиками пользовательских действий и обновляют состояние модели через ее методы. Контроллеры принимают в себя экземпляр модели и обрабатывают события, вызывая методы модели для изменения данных.

Пример контроллера:

```typescript
class Controller {
    constructor(
        protected model: Model // Модель для работы с данными
    ) {
        // Инициализация контроллера
    }

    public onClick = () => { // чтобы не потерять контекст
        // Обработка события
        this.model.changeValue(1);
    }
}
```

Обычно при использовании контроллеров бизнес-логику перераспределяют так, что в моделях не принимаются решения, а только изменяются данные с соблюдением их взаимозависимостей. В контроллерах же происходит обработка событий и принятие решений, а также обновление данных в моделях. Но это не строгое правило и в зависимости от проекта можно использовать разные подходы, например в этом проекте используется несколько реализаций архитектуры в разных ветках и чтобы не переносить много кода модель реализует практически всю логику, что несколько упрощает роль контроллеров.


Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы on ,  off ,  emit  — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
Дополнительно реализованы методы  onAll и  offAll  — для подписки на все события и сброса всех
подписчиков.
Интересным дополнением является метод  trigger , генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от
класса  EventEmitter .

Методы:
on(eventName: string, handler: EventHandler) -  Установить обработчик на событие
off(eventName: string, handler: EventHandler) - Снять обработчик с события
emit(eventName: string, data: object) - Инициировать событие с данными
onAll(callback: (event: EmitterEvent) => void) - Слушать все события
offAll() - Сбросить все обработчики
trigger<T extends object>(eventName: string, context?: Partial<T>) - Сделать коллбек триггер, генерирующий событие при вызове

Класс Screen:

```typescript
abstract class Screen<T, S extends object> extends View<T, S> {
	constructor(settings: S) {
		super(null, settings);
	}
}
```

Класс Basket:
Реализует работу корзины веб-магазина.

```typescript
class BasketController extends Controller<AppState> {
	onRemove = () => {}; // удаление товара из корзины
	onNext = () => {}; // переход на следующий этап оформления заказа по кнопке "Оформить"
	onBack = () => {}; // вернуться на предыдущую страницу
	onClose = () => {}; // закрыть корзину
}
```

Класс Main: 
Главная страница веб-магазина.

```typescript
class MainController extends Controller<AppState> {
	onOpenBasket = () => {}; // открыть корзину
	onOpenProduct =  {}; // открыть карточку товара
}
```

Класс Modal:
Открытие и закрытие модальных окон. Например, на главной странице можно открыть или закрыть карточку товара и корзину.

```typescript
class ModalController extends Controller<AppState> {
	onClose = () => {}; // закрытие уже открытого ранее модального окна
}
```

Класс Order:
Реализует процесс оформления заказа.

```typescript
class OrderController extends Controller<AppState> {
	onChange =  {}; // изменение контактных данных пользователя
	onNext = () => {}; // успешное оформление заказа после проверки на валидность заполненных полей контактов
	onBack = () => {}; // вернуться в корзину
	onClose = () => {}; // закрыть окно оформления заказа
}
```

Класс Appstate:
Модель данных приложения

```typescript
class AppStateModel implements AppState {
    // Заполняемые пользователем данные
    basket: Map<string, IBasketModel>;
    contacts: Contacts = {
        email: '',
        phone: '',
        address: ''
    };
    order: Order;
    // Загружаемые с сервера данные
    _productList: Map<string, IProduct>;
    // Состояние интерфейса
    openedModal: AppStateModals = AppStateModals.none;
    modalMessage: string | null = null;
    isError: false;
    // Действия с API
    constructor(protected api: IProductApi, protected settings: AppStateSettings) {}
    loadProductList(): Promise<void> {}
    get productList(): Map<string, IProduct> {}
    // Вспомогательные методы
    get basketTotal(): number {}
    get isOrderReady(): boolean {}
    get productList(): Map<string, IProduct> {}
    // Пользовательские действия
    addToBasket(id: string): void {}
    removeFromBasket(id: string): void { }
    fillContacts(contacts: Partial<Contacts>): void {}
    isValidContacts(): boolean {}
    openModal(modal: AppStateModals): void {}
    setMessage(message: string | null, isError: boolean): void {}
    // Действия с localStorage
    restoreState(): void {}
    persistState(): void {}
 // Конструктор модели данных
 interface AppStateConstructor {
	new (api: IFilmAPI, settings: AppStateSettings): AppState; 
}
}
```

Класс ProductApi:
Класс для работы с API товаров

```typescript
class ProductAPI extends Api implements IProductApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	async getItem(id: string): Promise<IProduct | IApiError> {} // получение карточки отдельного товара
	async getList(): Promise<ApiListResponse<IProduct>> {} // получения списка всех товаров
	async postOrder(order: Order): Promise<OrderResult[]> {} // оформление заказа через корзину
}
```

Класс AppStateEmitter:
Для корректной обработки событий открытия и закрытия модальных окон


```typescript
class AppStateEmitter extends EventEmitter {
    public model: AppState;
    protected previousModal: AppStateModals = AppStateModals.none;

    constructor(
        api: IProductApi,
        settings: Omit<AppStateSettings, 'onChange'>,
        Model: AppStateConstructor
    ) {
        super()
    }
    protected onModalChange(changed: AppStateChanges) {} // функционал открытия, закрытия и перехода на предыдущее модальное окно
 }
```


