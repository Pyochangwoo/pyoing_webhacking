fetch('/hot_posts')
  .then((response) => response.json())
  .then((data) => {
    const container = document.querySelector('#hot-posts');
    container.innerHTML = '';
    for (let i = 0; i < data.data.length; i++) {
      const postId = data.data[i].id;
      const postPreview = document.createElement('div');
      postPreview.className = 'hpost-preview';
      const postLink = document.createElement('a');
      postLink.href = '#';
      postLink.addEventListener('click', () => {
        fetch(`/posts/${postId}`)
        window.location.href = '../post_board/board_view.html';
        console.log(postId)
          .then((response) => response.json())
          .then((data) => {
          })
          .catch((error) => console.error(error));
      });
      const postTitle = document.createElement('h2');
      postTitle.className = 'hpost-title';
      postTitle.textContent = data.data[i].title;
      const postSubtitle = document.createElement('h4');
      postSubtitle.className = 'hpost-subtitle';
      postSubtitle.textContent = data.data[i].content;
      const postMeta = document.createElement('p');
      postMeta.className = 'hpost-meta';
      const created_at = new Date(data.data[i].created_at);
      const dateStr = `${created_at.getFullYear()}. ${created_at.getMonth() + 1}. ${created_at.getDate()}`;
      const views = data.data[i].views;
      postMeta.textContent = `작성자: ${data.data[i].writer} / Date: ${dateStr} / 조회수: ${views}`;

      postLink.appendChild(postTitle);
      postLink.appendChild(postSubtitle);
      postPreview.appendChild(postLink);
      postPreview.appendChild(postMeta);
      container.appendChild(postPreview);

      // 글마다 가로선 추가
      if (i !== data.data.length - 1) {
        const hr = document.createElement('div');
        hr.className = 'post-divider';
        container.appendChild(hr);
      }
    }
  })
  .catch((error) => console.error(error));