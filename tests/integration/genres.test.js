const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        await Genre.remove({});
        server.close();
    });

    describe("GET /", () => {
        it("should return all genres", async () => {
            await Genre.collection.insertMany([
                { name: "genreGet1" },
                { name: "genreGet2" },
            ]);

            const res = await request(server).get("/api/genres");

            expect(res.status).toBe(200);
        });
    });

    describe("GET /:id", () => {
        it("should return a genre if valid id is passed", async () => {
            const genre = new Genre({ name: "genreGetId" });
            await genre.save();

            const res = await request(server).get("/api/genres/" + genre._id);

            expect(res.status).toBe(200);
            // expect(res.body).toMatchObject(genre);
            expect(res.body).toHaveProperty("name", genre.name);
        });

        it("should return 404 if invalid id is passed", async () => {
            const res = await request(server).get("/api/genres/1");

            expect(res.status).toBe(404);
        });

        it("should return 404 if no genre with the given id exists", async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get("/api/genres/" + id);

            expect(res.status).toBe(404);
        });
    });

    describe("POST /", () => {
        let token;
        let name;

        const execute = async () => {
            return await request(server)
                .post("/api/genres/")
                .set("x-auth-token", token)
                .send({ name });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = "genrePost200";
        });

        it("should return 401 if client is not logged in", async () => {
            token = "";

            const res = await execute();

            expect(res.status).toBe(401);
        });

        it("should return 400 if genre is less than 3chars", async () => {
            name = "11";

            const res = await execute();

            expect(res.status).toBe(400);
        });

        it("should save and return genre if it's valid", async () => {
            const res = await execute();

            const genre = await Genre.find({ name: "genrePost200" });
            expect(genre).not.toBeNull();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "genrePost200");
        });
    });
});
