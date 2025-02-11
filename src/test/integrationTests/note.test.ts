// import request from 'supertest';
// import app from '../../index';
// import { expect } from 'chai';

// describe('Notes API - Create Note Test', () => {
//     let token: string;
//     let noteId: string;

//     before(async () => {
//         console.log('Starting user registration...');

//         // Login the user to get token
//         const loginRes = await request(app)
//             .post('/api/users/login')
//             .send({
//                 email: 'testuser@example.com',
//                 password: 'Test@1234'
//             });

//         console.log('Login Response:', loginRes.body);
//         expect(loginRes.status).to.equal(200);

//         // Fix: Extract the correct token string
//         token = loginRes.body.token.token;
        
//         console.log('Token received:', token);
//         expect(token).to.be.a('string');
//     });

//     it('should create a new note', async () => {
//         console.log('Starting note creation...');

//         const notePayload = {
//             title: 'Test Note',
//             description: 'This is a test note',
//             color: 'blue'
//         };

//         console.log('Payload being sent:', notePayload);

//         const res = await request(app)
//             .post('/api/notes')
//             .set('Authorization', `Bearer ${token}`)
//             .send(notePayload);

//         console.log('Note Creation Response:', res.body);
//         expect(res.status).to.equal(201);
//         expect(res.body.note).to.have.property('_id');

//         noteId = res.body.note._id;
//         console.log('Note created successfully with ID:', noteId);
//     });

//     it('should retrieve all notes', async () => {
//         console.log('Fetching all notes...');
//         const res = await request(app)
//             .get('/api/notes')
//             .set('Authorization', `Bearer ${token}`);

//         console.log('Notes Fetch Response:', res.body);
//         expect(res.status).to.equal(200);
//         expect(res.body.notes).to.be.an('array'); // Fix applied
//     });

//     it('should retrieve a single note by ID', async () => {
//         console.log('Fetching a single note...');
//         const res = await request(app)
//             .get(`/api/notes/${noteId}`)
//             .set('Authorization', `Bearer ${token}`);

//         console.log('Single Note Response:', res.body);
//         expect(res.status).to.equal(200);
//         expect(res.body.note).to.have.property('_id', noteId); // Fix applied
//     });

//     it('should update a note', async () => {
//         console.log('Updating the note...');
//         const updatedPayload = {
//             title: 'Updated Note',
//             description: 'This is an updated test note',
//             color: 'red'
//         };

//         const res = await request(app)
//             .put(`/api/notes/${noteId}`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(updatedPayload);

//         console.log('Update Note Response:', res.body);
//         expect(res.status).to.equal(200);
//         expect(res.body.note).to.have.property('title', 'Updated Note');
//     });

//     it('should delete a note', async () => {
//         console.log('Deleting the note...');
//         const res = await request(app)
//             .delete(`/api/notes/${noteId}`)
//             .set('Authorization', `Bearer ${token}`);

//         console.log('Delete Note Response:', res.body);
//         expect(res.status).to.equal(200);
//         expect(res.body.message).to.equal('Note deleted successfully');
//     });
// });