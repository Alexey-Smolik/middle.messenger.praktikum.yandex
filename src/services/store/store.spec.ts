import store from './store.service';

const data = {
    foo: 'bar'
};

describe('Проверка State', () => {
    test('После метода set метод getState должен вернуть объект с этим полем', () => {
        store.set('data', data);

        expect(store.getState()).toStrictEqual({ data: { foo: 'bar' } });
    });

    test('Метод set должен создавать/менять вложенные поля', () => {
        store.set('data.foo', 'new bar');

        expect(store.getState()).toStrictEqual({ data: { foo: 'new bar' } });
    });
});
