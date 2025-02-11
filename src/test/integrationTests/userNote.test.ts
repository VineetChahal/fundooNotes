import request from 'supertest';
import { expect } from 'chai';
import app from '../../index';

describe('User & Notes API Integration Tests', function () {
    let token: string;
    let noteId: string;

    const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'johnD@example.com',
        password: 'password@123'
    };

    before(async function () {
        console.log('Starting user registration...');
        
        // Register the user
        await request(app)
            .post('/api/users/register')
            .send(testUser);
        
        // Login to get token
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(loginRes.status).to.equal(200);
        token = loginRes.body.token.token;
        console.log('Token received:', token);
        expect(token).to.be.a('string');
    });

    describe('User API Tests', function () {
        it('should not register an existing user', async function () {
            const res = await request(app)
                .post('/api/users/register')
                .send(testUser);

            expect(res.status).to.equal(409);
            expect(res.body).to.have.property('message', 'User already exists');
        });

        it('should login a user', async function () {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Login successful');
            expect(res.body).to.have.property('token');
        });

        it('should not login with incorrect password', async function () {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('message', 'Invalid credentials');
        });
    });

    describe('Notes API Tests', function () {
        it('should create a new note', async () => {
            console.log('Starting note creation...');

            const notePayload = {
                title: 'Test Note',
                description: 'This is a test note',
                color: 'blue'
            };

            const res = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${token}`)
                .send(notePayload);

            expect(res.status).to.equal(201);
            expect(res.body.note).to.have.property('_id');
            noteId = res.body.note._id;
            console.log('Note created successfully with ID:', noteId);
        });

        it('should retrieve all notes', async () => {
            console.log('Fetching all notes...');
            const res = await request(app)
                .get('/api/notes')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body.notes).to.be.an('array');
        });

        it('should retrieve a single note by ID', async () => {
            console.log('Fetching a single note...');
            const res = await request(app)
                .get(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body.note).to.have.property('_id', noteId);
        });

        it('should update a note', async () => {
            console.log('Updating the note...');
            const updatedPayload = {
                title: 'Updated Note',
                description: 'This is an updated test note',
                color: 'red'
            };

            const res = await request(app)
                .put(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedPayload);

            expect(res.status).to.equal(200);
            expect(res.body.note).to.have.property('title', 'Updated Note');
        });

        it('should delete a note', async () => {
            console.log('Deleting the note...');
            const res = await request(app)
                .delete(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Note deleted successfully');
        });
    });
});
