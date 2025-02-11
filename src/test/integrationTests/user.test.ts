// import request from 'supertest';
// import { expect } from 'chai';
// import app from '../../index';

// describe('User API', function () {
//     const testUser = {
//         firstName: 'John',
//         lastName: 'Doe',
//         username: 'johndoe',
//         email: 'johnD@example.com',
//         password: 'password@123'
//     };

//     it('should register a new user', async function () {
//         const res = await request(app)
//             .post('/api/users/register')
//             .send(testUser);

//         expect(res.status).to.equal(201);
//         expect(res.body).to.have.property('message', 'User registered successfully');
//         expect(res.body).to.have.property('user');
//         expect(res.body.user).to.have.property('email', testUser.email);
//     });

//     it('should not register an existing user', async function () {
//         const res = await request(app)
//             .post('/api/users/register')
//             .send(testUser);

//         expect(res.status).to.equal(409);
//         expect(res.body).to.have.property('message', 'User already exists');
//     });

//     it('should login a user', async function () {
//         const res = await request(app)
//             .post('/api/users/login')
//             .send({
//                 email: testUser.email,
//                 password: testUser.password
//             });

//         expect(res.status).to.equal(200);
//         expect(res.body).to.have.property('message', 'Login successful');
//         expect(res.body).to.have.property('token');
//     });

//     it('should not login with incorrect password', async function () {
//         const res = await request(app)
//             .post('/api/users/login')
//             .send({
//                 email: testUser.email,
//                 password: 'wrongpassword'
//             });

//         expect(res.status).to.equal(401);
//         expect(res.body).to.have.property('message', 'Invalid credentials');
//     });
// });
