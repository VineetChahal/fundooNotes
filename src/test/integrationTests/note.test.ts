import request from 'supertest';
import app from '../../index';
import { expect } from 'chai';
import { Types } from 'mongoose';

describe('Notes API', () => {
    let noteId: string;
    const token: string = 'your_test_jwt_token'; // Replace with a valid token or generate one dynamically

    it('should create a new note', async () => {
        const res = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test Note', description: 'This is a test note' });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
        noteId = res.body._id;
    });

    it('should return 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Incomplete Note' });

        expect(res.status).to.equal(400);
    });

    it('should get all notes', async () => {
        const res = await request(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.be.true.and.to.have.length.above(0);
    });

    it('should get a specific note', async () => {
        const res = await request(app)
            .get(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id', noteId);
    });

    it('should return 404 if note not found', async () => {
        const nonExistentId = new Types.ObjectId().toHexString();
        const res = await request(app)
            .get(`/api/notes/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(404);
    });

    it('should update a note', async () => {
        const res = await request(app)
            .put(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Updated Note', description: 'Updated description' });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('title', 'Updated Note');
    });

    it('should return 404 if updating a non-existing note', async () => {
        const nonExistentId = new Types.ObjectId().toHexString();
        const res = await request(app)
            .put(`/api/notes/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Non-existent Note' });

        expect(res.status).to.equal(404);
    });

    it('should delete a note', async () => {
        const res = await request(app)
            .delete(`/api/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(200);
    });

    it('should return 404 if deleting a non-existing note', async () => {
        const nonExistentId = new Types.ObjectId().toHexString();
        const res = await request(app)
            .delete(`/api/notes/${nonExistentId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).to.equal(404);
    });
});
