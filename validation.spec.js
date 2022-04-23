const { confirmSignup } = require("./validation");
const dbNickname = ["aaa", "bbb", "ccc"];
test("닉네임이 최소 3자 이상, 알파벳 대소문자, 숫자로 이루어진지", () => {
  expect(confirmSignup("Ab3", "asdf", "asdf", dbNickname)).toEqual(true);
  expect(confirmSignup("Ab$3", "asdf", "asdf", dbNickname)).toEqual(false);
  expect(confirmSignup("$$$$", "asdf", "asdf", dbNickname)).toEqual(false);
  expect(confirmSignup("Ab", "asdf", "asdf", dbNickname)).toEqual(false);
});
test("비밀번호가 최소 4자이상이며, 닉네임과 같은 값이 포함된 경우 실패", () => {
  expect(confirmSignup("Ab3", "asdf", "asdf", dbNickname)).toEqual(true);
  expect(confirmSignup("Ab3", "AbAb", "AbAb", dbNickname)).toEqual(true);
  expect(confirmSignup("Ab3", "aaAb3", "aaAb3", dbNickname)).toEqual(false);
  expect(confirmSignup("Ab3", "aaAb3aa", "aaAb3aa", dbNickname)).toEqual(false);
});
test("비밀번호 확인이 비밀번화와 정확하게 일치하는지", () => {
  expect(confirmSignup("Ab3", "asdf", "asdf", dbNickname)).toEqual(true);
  expect(confirmSignup("Ab3", "asdf", "asdfe", dbNickname)).toEqual(false);
  expect(confirmSignup("Ab3", "asdfe", "asdf", dbNickname)).toEqual(false);
});
test("데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른경우'중복된 닉네임입니다.'라는 에러메세지가 발생하는지", () => {
  expect(confirmSignup("Ab3", "asdf", "asdf", dbNickname)).toEqual(true);
  expect(confirmSignup("aaa", "asdf", "asdf", dbNickname)).toEqual(false);
  expect(confirmSignup("bbb", "asdf", "asdf", dbNickname)).toEqual(false);
  expect(confirmSignup("ccc", "asdf", "asdf", dbNickname)).toEqual(false);
});
