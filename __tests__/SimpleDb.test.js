const { rm, mkdir } = require('fs/promises');
const SimpleDb = require('../SimpleDb.js');

describe('SimpleDb', () => {
  const rootDir = './store/';

  const clearStore = () => {
    return rm(rootDir, { force: true, recursive: true }).then(() =>
      mkdir(rootDir, { recursive: true })
    );
  };

  beforeEach(clearStore);
  afterEach(clearStore);

  test('SimpleDb can save and get an object', () => {
    const obj = {
      abc: 123,
      bob: 'bobbert'
    };
    const expected = Object.assign({
      id: expect.any(String)
    }, obj);

    const simpleDb = new SimpleDb(rootDir);
    return simpleDb.save(obj)
      .then(() => simpleDb.get(obj.id))
      .then(actual => expect(actual).toEqual(expected));
  });

  test('SimpleDb can getAll saved objects', () => {
    const obj1 = {
      abc: 123,
      bob: 'bobbert'
    };

    const obj2 = {
      abc: 123,
      bob: 'bobbert'
    };

    const simpleDb = new SimpleDb(rootDir);
    return simpleDb.save(obj1)
      .then(() => simpleDb.save(obj2))
      .then(() => simpleDb.getAll())
      .then(actual => expect(actual).toEqual(expect.arrayContaining([obj1, obj2])));
  });
});
