exports.saveUser = function(username, email, password, connection, callback) {
  // 이미 존재하는 username인지 확인하는 SELECT 쿼리
  const checkUserQuery = `SELECT * FROM user_info WHERE name='${username}'`;

  // 중복된 아이디인 경우 에러 메시지를 출력하고 함수를 종료함
  connection.query(checkUserQuery, (err, results) => {
    if (err) {
      throw err;
    }
    if (results.length > 0) {
      console.log('중복된 아이디입니다.');
      return callback('duplicated');
    }

    // 중복된 아이디가 아니면 새로운 회원 정보를 저장하는 INSERT 쿼리 실행
    const insertUserQuery = `INSERT INTO user_info (password, name, email) VALUES ('${password}', '${username}', '${email}')`;
    connection.query(insertUserQuery, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
      callback('success');
    });
  });
};