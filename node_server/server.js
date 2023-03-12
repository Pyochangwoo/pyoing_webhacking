const express = require("express");
const app = express();
const port = 8080;
const path = require('path');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connection = require('./public/js/db.js'); // db.js 모듈을 불러옴
const boardWrite = require('./public/post_board/post_js/board_write.js');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('cookie-secret'));





// POST /register 요청 처리
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // regist.js 파일을 불러와서 saveUser() 함수로 회원가입 정보를 저장함
  const { saveUser } = require('./public/js/regist.js');
  saveUser(username, email, password, connection, (result) => {
    if (result === 'duplicated') {
      res.send('<script>alert("이미 존재하는 아이디입니다.");history.back();</script>');
    } else {
      res.redirect('./login.html');
    }
  });
});



// POST /login 요청 처리
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const loginRouter = require('./public/js/login.js');

  loginRouter(username, password, (result) => {
    if (result === 'success') {
      // 로그인 성공시 쿠키 저장 및 페이지 이동
      const options = {
        maxAge: 1000 * 60 * 60, // 쿠키 유효시간 1시간
        httpOnly: true, // 클라이언트에서 쿠키 접근 금지
      };
      const user = username; // 로그인한 사용자의 이름 정보
      res.cookie('user',user, { signed: true });
      res.redirect('../index.html');
    } else {
      res.send('<script>alert("아이디 혹은 비밀번호를 확인해 주세요.");history.back();</script>');
    }
  }, req, res);
});




// Receive the value of the board as a POST value
app.post('/postwrite', (req, res) => {
  const {title,content,is_locked} = req.body;

  // If is_locked is null or undefined, set it to 0
  const locked = is_locked ?? 0;

  // Get the author cookie value and decrypt it using the secret
  const author = req.signedCookies['user'];

  if (author) {

// 데이터베이스에 넣기
boardWrite.savepost(title, content, locked, author, connection, (success) => {
  if (success) {
    // 성공 시 리다이렉션
    res.redirect('../../post.html');
  } else {
    res.status(500).send('Error saving post');
  }
});
  } else {
    // 유효하지 않은 경우 에러 처리
    res.status(400).send('Invalid cookie value');
  }
});






// 게시글 내용 보기
let result = null;

app.get('/posts/:postId', (req, res) => {
  const { postId } = req.params;
  connection.query(`SELECT id ,title, writer, views, created_at, content FROM pyoing_board WHERE id = ${postId}`, (err, queryResult) => {
    if (err) { 
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (queryResult.length === 0) {
      res.status(404).send('Not Found');
      return;
    }
    result = queryResult;
  });
});



app.get('/post_comments', (req, res) => {
  if (result === null) {
    res.status(404).send('Not Found');
    return;
  }
  res.send(JSON.stringify(result));
});



// 서버 측 코드
app.post('/decrypt_cookie', (req, res) => {
  // req.body.cookieValue를 복호화하여 사용자 이름을 추출하는 코드
  var decryptedUsername = req.signedCookies['user'];
  res.send(JSON.stringify({username: decryptedUsername}));
});


// POST 삭제 API
app.post('/posts_remove', (req, res) => {
  const { title, writer, id} = req.body;
  const userId = req.signedCookies['user'];

  console.log(userId);
  console.log(writer);
  console.log(id);

  // user 변수와 쿠키에 저장된 user 값을 비교
  if (!writer || !userId || String(writer) !== String(userId)) {
    res.status(401).send('Unauthorized access');
    return;
  } else {
    // 데이터베이스에서 해당 데이터 삭제
    connection.query('DELETE FROM pyoing_board WHERE id = ? AND title = ? AND writer = ?', [id, title, writer], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
        return;
      }
      console.log(result);
      res.send('Successfully deleted post');
    });
  }
});

// 조회수 업데이트
app.post('/update_views', (req, res) => {
  const { id } = req.body;

  connection.query('UPDATE pyoing_board SET views = views + 1 WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }

    console.log(result);
    res.send('Successfully updated views');
  });
});


//암호화 된게시글 내용 보기
app.get('/locked_posts/:postId', (req, res) => {
  const { postId } = req.params;
  const user_id = req.signedCookies['user'];
  console.log(user_id);
  console.log(postId);
  connection.query(`SELECT title, writer, views, created_at, content FROM pyoing_board WHERE id = ${postId} AND writer = ${user_id}`, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Not Found');
      return;
    }
    const post = result[0];
    res.send(`
      <html>
        <head>
          <title>${post.title}</title>
        </head>
        <body>
          <h1>${post.title}</h1>
          <p>${post.writer} | ${post.views} views | ${post.created_at}</p>
          <div>${post.content}</div>
        </body>
      </html>
    `);
  });
});

// 인기글 불러오기
app.get('/hot_posts', (req, res) => {
  connection.query('SELECT id, title, content, writer, created_at, views FROM pyoing_board ORDER BY views DESC, created_at ASC LIMIT 4', (error, results, fields) => {
    if (error) throw error;
    console.log(results)
    res.send({ data: results });
  });
});




app.get('/posts_list', (req, res) => {

  connection.query(
    `SELECT id ,title, writer, is_locked, created_at FROM pyoing_board ORDER BY created_at DESC `,
    (err, posts) => {
      if (err) {
        console.log(err);
        return posts.status(500).json({ error: 'Failed to fetch board data' });
      }
      res.send(posts);
    }
  );
});


//로그아웃
app.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('./public/index.html');
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});