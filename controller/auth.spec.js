const { sign_in_test, sign_up_test } = require("./auth");

const UsersSchema = require("../middlewares/joi");

jest.mock("../models");

const { User } = require("../models");

describe("sign_in_test", () => {
    const mockedSend = jest.fn();
    const res = {
        status: () => ({
            send: mockedSend,
        }),
    };
    test("sign_in_test함수가 호출되면 User.findOne이 실행된다", async () => {
        User.findOne = jest.fn();
        const req = {
            body: {
                nickname: "aaa",
                password: "1234",
            },
        };
        await sign_in_test(req, res);
        expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    test("User.findOne값이 없으면 닉네임 또는 패스워드를 확인해주세요라는 문자열 출력", async () => {
        User.findOne = jest.fn();
        const req = {
            body: {
                nickname: "aaa",
                password: "1234",
            },
        };
        await sign_in_test(req, res);
        expect(mockedSend).toHaveBeenCalledWith({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요",
        });
    });
});

describe("sign_up_test", () => {
    const mockedSend = jest.fn();
    const res = {
        status: () => ({
            send: mockedSend,
        }),
    };
    test("패스워드가 패스워드 확인란과 다르면 패스워드가 패스워드 확인란과 동일하지 않습니다라는 메세지 뱉음", async () => {
        const req = {
            body: {
                nickname: "aaaa",
                password: "bbbb",
                confirmpassword: "bbb",
            },
        };
        User.create = jest.fn();
        UsersSchema.validateAsync = jest.fn();
        UsersSchema.validateAsync.mockReturnValue(true);
        await sign_up_test(req, res);
        console.log(req.body);
        expect(mockedSend).toHaveBeenCalledWith({
            errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
        });
    });

    test("sign_up_test함수가 호출되면 UsersSchema.validateAsync이 실행된다", async () => {
        const req = {
            body: {
                nickname: "aaa",
                password: "bbbb",
                confirmpassword: "bbbb",
            },
        };
        UsersSchema.validateAsync = jest.fn(req.body);

        await sign_up_test(req, res);
        expect(UsersSchema.validateAsync).toHaveBeenCalledTimes(1);
    });

    test("오류 닉네임 영어나 숫자만 3자이상, 암호4자이상 뱉음", async () => {
        const req = {
            body: {
                nickname: "aa",
                password: "bbb",
                confirmpassword: "bbb",
            },
        };

        await sign_up_test(req, res);
        expect(mockedSend).toHaveBeenCalledWith({
            errorMessage: "닉네임 영어나 숫자만 3자이상, 암호4자이상",
        });
    });
});
