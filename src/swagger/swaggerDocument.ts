const swaggerDocument = {
    // openapi: "3.0.0",
    // info: {
    //   title: "Fundoo Notes API",
    //   version: "1.0.0",
    //   description: "API documentation for Fundoo Notes app",
    // },
    // servers: [
    //   {
    //     url: "http://localhost:3000/api",
    //   },
    // ],
    // components: {
    //   securitySchemes: {
    //     Bearer: {
    //       type: "http",
    //       scheme: "bearer",
    //       bearerFormat: "JWT",
    //     },
    //   },
    // },
    // tags: [
    //   {
    //     name: "Users",
    //     description: "User management operations",
    //   },
    //   {
    //     name: "Notes",
    //     description: "Note management operations",
    //   },
    // ],
    // //-------------------------------------------------------register user-------------------------------------------------------
    // paths: {
    //   "/users/register": {
    //     post: {
    //       summary: "Registers a new user",
    //       tags: ["Users"],
    //       requestBody: {
    //         required: true,
    //         content: {
    //           "application/json": {
    //             schema: {
    //               type: "object",
    //               properties: {
    //                 firstName: {
    //                   type: "string",
    //                 },
    //                 lastName: {
    //                   type: "string",
    //                 },
    //                 username: {
    //                     type: "string",
    //                 },
    //                 email: {
    //                   type: "string",
    //                 },
    //                 password: {
    //                   type: "string",
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //       responses: {
    //         200: {
    //           description: "User registered successfully",
    //         },
    //         400: {
    //           description: "Bad request",
    //         },
    //         500: {
    //           description: "Server error",
    //         },
    //       },
    //     },
    //   },
    //     //-------------------------------------------------------login user-------------------------------------------------------
    //   "/users/login": {
    //     post: {
    //       summary: "Logs in an existing user",
    //       tags: ["Users"],
    //       requestBody: {
    //         required: true,
    //         content: {
    //           "application/json": {
    //             schema: {
    //               type: "object",
    //               properties: {
    //                 email: {
    //                   type: "string",
    //                 },
    //                 password: {
    //                   type: "string",
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //       responses: {
    //         200: {
    //           description: "Login successful",
    //         },
    //         400: {
    //           description: "Bad request",
    //         },
    //         401: {
    //           description: "Unauthorized",
    //         },
    //       },
    //     },
    //   },
    //     //-------------------------------------------------------forgot password------------------------------------------------
    //   "/users/forgot-password": {
    //     post: {
    //       summary: "Sends a reset password email to the user",
    //       tags: ["Users"],
    //       requestBody: {
    //         required: true,
    //         content: {
    //           "application/json": {
    //             schema: {
    //               type: "object",
    //               properties: {
    //                 email: {
    //                   type: "string",
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //       responses: {
    //         200: {
    //           description: "Reset password email sent",
    //         },
    //         400: {
    //           description: "Invalid email",
    //         },
    //         500: {
    //           description: "Server error",
    //         },
    //       },
    //     },
    //   },
    //     //-------------------------------------------------------reset password------------------------------------------------
    //   "/users/reset-password": {
    //     post: {
    //       summary: "Resets the user's password",
    //       tags: ["Users"],
    //       requestBody: {
    //         required: true,
    //         content: {
    //           "application/json": {
    //             schema: {
    //               type: "object",
    //               properties: {
    //                 token: {
    //                   type: "string",
    //                 },
    //                 password: {
    //                   type: "string",
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //       responses: {
    //         200: {
    //           description: "Password reset successful",
    //         },
    //         400: {
    //           description: "Bad request",
    //         },
    //         500: {
    //           description: "Server error",
    //         },
    //       },
    //     },
    //   },
    //     //-------------------------------------------------------create note------------------------------------------------
    //   "/notes": {
    //     post: {
    //       summary: "Creates a new note",
    //       tags: ["Notes"],
    //       security: [
    //         {
    //           Bearer: [],
    //         },
    //       ],
    //       requestBody: {
    //         required: true,
    //         content: {
    //           "application/json": {
    //             schema: {
    //               type: "object",
    //               properties: {
    //                 title: {
    //                   type: "string",
    //                 },
    //                 description: {
    //                   type: "string",
    //                 },
    //                 color: {
    //                     type: "string",
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //       responses: {
    //         200: {
    //           description: "Note created successfully",
    //         },
    //         400: {
    //           description: "Bad request",
    //         },
    //         401: {
    //           description: "Unauthorized",
    //         },
    //       },
    //     },
    //   },
    //     //-------------------------------------------------------get unique note------------------------------------------------
    //   "/notes/{id}": {
    //     get: {
    //       summary: "Gets a specific note by ID",
    //       tags: ["Notes"],
    //       parameters: [
    //         {
    //           in: "path",
    //           name: "id",
    //           required: true,
    //           schema: {
    //             type: "string",
    //           },
    //         },
    //       ],
    //       responses: {
    //         200: {
    //           description: "Note retrieved successfully",
    //         },
    //         404: {
    //           description: "Note not found",
    //         },
    //         500: {
    //           description: "Server error",
    //         },
    //       },
    //     },
    //     //-------------------------------------------------------update note------------------------------------------------
    //     put: {
    //       summary: "Updates a specific note by ID",
    //       tags: ["Notes"],
    //       security: [
    //         {
    //           Bearer: [],
    //         },
    //       ],
    //       parameters: [
    //         {
    //           in: "path",
    //           name: "id",
    //           required: true,
    //           schema: {
    //             type: "string",
    //           },
    //         },
    //       ],
    //       requestBody: {
    //         required: true,
    //         content: {
    //           "application/json": {
    //             schema: {
    //               type: "object",
    //               properties: {
    //                 title: {
    //                   type: "string",
    //                 },
    //                 content: {
    //                   type: "string",
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //       responses: {
    //         200: {
    //           description: "Note updated successfully",
    //         },
    //         400: {
    //           description: "Bad request",
    //         },
    //         401: {
    //           description: "Unauthorized",
    //         },
    //         404: {
    //           description: "Note not found",
    //         },
    //       },
    //     },
    //     //-------------------------------------------------------delete note------------------------------------------------
    //     delete: {
    //       summary: "Deletes a specific note by ID",
    //       tags: ["Notes"],
    //       security: [
    //         {
    //           Bearer: [],
    //         },
    //       ],
    //       parameters: [
    //         {
    //           in: "path",
    //           name: "id",
    //           required: true,
    //           schema: {
    //             type: "string",
    //           },
    //         },
    //       ],
    //       responses: {
    //         200: {
    //           description: "Note deleted successfully",
    //         },
    //         400: {
    //           description: "Bad request",
    //         },
    //         401: {
    //           description: "Unauthorized",
    //         },
    //         404: {
    //           description: "Note not found",
    //         },
    //       },
    //     },
    //   },
    // },
    
        "openapi": "3.0.0",
        "info": {
          "title": "Fundoo Notes API",
          "version": "1.0.0",
          "description": "API documentation for Fundoo Notes app"
        },
        "servers": [
          {
            "url": "http://localhost:3000/api"
          }
        ],
        "components": {
          "securitySchemes": {
            "Bearer": {
              "type": "http",
              "scheme": "bearer",
              "bearerFormat": "JWT"
            }
          }
        },
        "tags": [
          { "name": "Users", "description": "User management operations" },
          { "name": "Notes", "description": "Note management operations" }
        ],
        //-------------------------------------------------------paths------------------------------------------------
        "paths": {
            //-------------------------------------------------------register user------------------------------------------------
          "/users/register": {
            "post": {
              "summary": "Registers a new user",
              "tags": ["Users"],
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "firstName": { "type": "string" },
                        "lastName": { "type": "string" },
                        "username": { "type": "string" },
                        "email": { "type": "string" },
                        "password": { "type": "string" }
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": { "description": "User registered successfully" },
                "400": { "description": "Bad request" },
                "500": { "description": "Server error" }
              }
            }
          },
          //-------------------------------------------------------login user------------------------------------------------
          "/users/login": {
            "post": {
              "summary": "Logs in an existing user",
              "tags": ["Users"],
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "email": { "type": "string" },
                        "password": { "type": "string" }
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": { "description": "Login successful" },
                "400": { "description": "Bad request" },
                "401": { "description": "Unauthorized" }
              }
            }
          },
          //-------------------------------------------------------get all notes------------------------------------------------
          "get": {
            "summary": "Get all notes of the logged-in user",
            "tags": ["Notes"],
            "security": [{ "Bearer": [] }],
            "responses": {
              "200": {
                "description": "Notes retrieved successfully",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "notes": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "_id": { "type": "string" },
                              "title": { "type": "string" },
                              "description": { "type": "string" },
                              "color": { "type": "string" },
                              "userId": { "type": "string" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
            "401": { "description": "Unauthorized" },
            "500": { "description": "Internal server error" }
            }
          },
            //-------------------------------------------------------forgot password------------------------------------------------
          "/users/forgot-password": {
            "post": {
              "summary": "Sends a reset password email to the user",
              "tags": ["Users"],
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "email": { "type": "string" }
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": { "description": "Reset password email sent" },
                "400": { "description": "Invalid email" },
                "500": { "description": "Server error" }
              }
            }
          },
            //-------------------------------------------------------reset password------------------------------------------------
          "/users/reset-password": {
            "post": {
              "summary": "Resets the user's password",
              "tags": ["Users"],
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "email": { "type": "string" },
                        "verificationCode": { "type": "string" },
                        "newPassword": { "type": "string" }
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": { "description": "Password reset successful" },
                "400": { "description": "Bad request" },
                "500": { "description": "Server error" }
              }
            }
          },
            //----------------------------------------------------------- note --------------------------------------------------
          "/notes": {
            // -------------------------------------------------------create note------------------------------------------------
            "post": {
              "summary": "Creates a new note",
              "tags": ["Notes"],
              "security": [{ "Bearer": [] }],
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "title": { "type": "string" },
                        "description": { "type": "string" },
                        "color": { "type": "string" }
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": { "description": "Note created successfully" },
                "400": { "description": "Bad request" },
                "401": { "description": "Unauthorized" }
              }
            }
          },
            //-------------------------------------------------------get unique note------------------------------------------------
          "/notes/{id}": {
        get: {
          summary: "Gets a specific note by ID",
          tags: ["Notes"],
          security: [{ "Bearer": [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Note retrieved successfully",
            },
            404: {
              description: "Note not found",
            },
            500: {
              description: "Server error",
            },
          },
        },
            //-------------------------------------------------------update note------------------------------------------------
            "put": {
              "summary": "Updates a specific note by ID",
              "tags": ["Notes"],
              "security": [{ "Bearer": [] }],
              "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }],
              "requestBody": {
                "required": true,
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "title": { "type": "string" },
                        "content": { "type": "string" }
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": { "description": "Note updated successfully" },
                "400": { "description": "Bad request" },
                "401": { "description": "Unauthorized" },
                "404": { "description": "Note not found" }
              }
            },
            //-------------------------------------------------------delete note------------------------------------------------
            "delete": {
              "summary": "Deletes a specific note by ID",
              "tags": ["Notes"],
              "security": [{ "Bearer": [] }],
              "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "string" } }],
              "responses": {
                "200": { "description": "Note deleted successfully" },
                "400": { "description": "Bad request" },
                "401": { "description": "Unauthorized" },
                "404": { "description": "Note not found" }
              }
            }
          }
        }

    
  };
  
  export { swaggerDocument };
  