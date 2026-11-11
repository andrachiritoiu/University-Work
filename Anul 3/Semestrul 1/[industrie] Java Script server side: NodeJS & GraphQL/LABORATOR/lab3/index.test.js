const request = require('supertest');
const app = require('./app');

// Fiecare test isi creeaza singur datele de care are nevoie, astfel incat
// grupurile E1-E4 sa poata fi rulate si separat (ex: npm test -- -t "E2").
let counter = 0;
const uniqueEmail = () => `user${Date.now()}.${counter++}@example.com`;

const createUser = (data = {}) => {
    return request(app)
      .post('/users')
      .send({ name: 'John', email: uniqueEmail(), ...data });
};

describe('E1 - Create users', () => {
    it('should create a user', async () => {
        const res = await createUser({ name: 'John', email: 'john@test.com' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'John');
        expect(res.body).toHaveProperty('email', 'john@test.com');
    });

    it('should generate a different id for each user', async () => {
        const first = await createUser();
        const second = await createUser();

        expect(first.statusCode).toEqual(201);
        expect(second.statusCode).toEqual(201);
        expect(first.body.id).not.toEqual(second.body.id);
    });

    it('should not create a user without name', async () => {
        const res = await request(app)
          .post('/users')
          .send({ email: uniqueEmail() });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should not create a user without email', async () => {
        const res = await request(app)
          .post('/users')
          .send({ name: 'John' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should not create a user without name and email', async () => {
        const res = await request(app)
          .post('/users')
          .send({});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should not create a user with an existing email', async () => {
        const email = uniqueEmail();
        await createUser({ email });

        const res = await createUser({ email });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });
});

describe('E2 - Update users', () => {
    it('should update a user', async () => {
        const created = await createUser();
        const email = uniqueEmail();

        const res = await request(app)
          .put(`/users/${created.body.id}`)
          .send({ name: 'Jane', email });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', created.body.id);
        expect(res.body).toHaveProperty('name', 'Jane');
        expect(res.body).toHaveProperty('email', email);
    });

    it('should not update a user without name', async () => {
        const created = await createUser();

        const res = await request(app)
          .put(`/users/${created.body.id}`)
          .send({ email: uniqueEmail() });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should not update a user without email', async () => {
        const created = await createUser();

        const res = await request(app)
          .put(`/users/${created.body.id}`)
          .send({ name: 'John' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should not update a user without name and email', async () => {
        const created = await createUser();

        const res = await request(app)
          .put(`/users/${created.body.id}`)
          .send({});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should not update a user that does not exist', async () => {
        const res = await request(app)
          .put('/users/999999')
          .send({ name: 'John', email: uniqueEmail() });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    });
});

describe('E3 - List users', () => {
    // Ne asiguram ca exista cel putin 20 de useri, indiferent ce alte teste au rulat inainte.
    beforeAll(async () => {
        for (let i = 0; i < 20; i++) {
            await createUser();
        }
    });

    it('should list users', async () => {
        const res = await request(app)
          .get('/users');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(10);
    });

    it('should list users with limit', async () => {
        const res = await request(app)
          .get('/users?limit=1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

    it('should list users with page', async () => {
        const firstPage = await request(app)
          .get('/users?page=0');
        const secondPage = await request(app)
          .get('/users?page=1');

        expect(secondPage.statusCode).toEqual(200);
        expect(secondPage.body).toHaveLength(10);
        expect(secondPage.body[0].id).not.toEqual(firstPage.body[0].id);
    });

    it('should list users with limit and page', async () => {
        const all = await request(app)
          .get('/users?limit=2');
        const res = await request(app)
          .get('/users?limit=1&page=1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toEqual(all.body[1]);
    });

    it('should return an empty array for a page with no users', async () => {
        const res = await request(app)
          .get('/users?page=999999');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });

    it('should not accept invalid page or limit', async () => {
        for (const query of ['page=-1', 'page=abc', 'limit=0', 'limit=-5', 'limit=abc']) {
            const res = await request(app)
              .get(`/users?${query}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error');
        }
    });
});

describe('E4 - Delete users', () => {
    it('should delete a user', async () => {
        const created = await createUser();

        const res = await request(app)
          .delete(`/users/${created.body.id}`);

        expect(res.statusCode).toEqual(200);

        // User-ul sters nu mai poate fi sters din nou.
        const again = await request(app)
          .delete(`/users/${created.body.id}`);

        expect(again.statusCode).toEqual(404);
    });

    it('should not delete a user with invalid id', async () => {
        const res = await request(app)
          .delete('/users/999999');

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    });
});
