const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

describe("auth middleware", () => {
    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    });

    let token;
    let name;

    const execute = () => {
        name = "validGenre";
        return request(server)
            .post("/api/genres")
            .set("x-auth-token", token)
            .send({ name });
    };

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it("should return 401 if no token provided", async () => {
        token = "";

        const res = await execute();

        expect(res.status).toBe(401);
    });

    it("should return 400 if invalid token provided", async () => {
        token = "1";

        const res = await execute();

        expect(res.status).toBe(400);
    });

    it("should return 200 if VALID token provided", async () => {
        const res = await execute();

        expect(res.status).toBe(200);
    });
});
