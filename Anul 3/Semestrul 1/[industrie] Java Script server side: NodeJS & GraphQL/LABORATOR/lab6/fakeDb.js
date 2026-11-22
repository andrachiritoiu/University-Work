const db = {
    users: [
        {
            id: 1,
            name: 'John'
        },
        {
            id: 2,
            name: 'Mary'
        },
    ],
}

const findEntity = (entity, id) => {
    console.log('db: findEntity', db);
    return db[entity].find(entity => entity.id === id);
};
const createEntity = (entity, data) => {
    data.id = db[entity].length + 1;
    db[entity].push({...data});
    console.log('db: createEntity', db);
}
const updateEntity = (entity, id, data) => {
    const entityIndex = db[entity].findIndex(entity => entity.id === id);
    console.log('db: updateEntity: found Index', entityIndex);
    if (entityIndex === -1) return;

    db[entity][entityIndex] = { ...db[entity][entityIndex], ...data };
    console.log('db: updateEntity', db);
};
const deleteEntity = (entity, id) => {
    db[entity] = db[entity].filter(entity => entity.id !== id);
    console.log('db: deleteEntity', db);
};
const listEntities = (entity) => {
    console.log('db: listEntities', db);
    return db[entity];
};

export { db, findEntity, updateEntity, createEntity, deleteEntity, listEntities };
export default db;