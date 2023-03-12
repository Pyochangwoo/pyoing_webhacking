
    fetch('/posts_list')
    .then(response => response.json())
    .then(posts => {
        const tbody = document.getElementById('post-list');
        for (const post of posts) {
        const row = document.createElement('tr');
        const indexCell = document.createElement('td');
        const titleCell = document.createElement('td');
        const titleLink = document.createElement('a');
        if (post.title.length > 12) {
            titleLink.textContent = post.title.substring(0, 12) + '...';
        } else {
            titleLink.textContent = post.title;
        }
        titleCell.appendChild(titleLink);
        const writerCell = document.createElement('td');
        writerCell.textContent = post.writer;
        const dateCell = document.createElement('td');
        const date = new Date(post.created_at);
        dateCell.textContent = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        row.appendChild(indexCell);
        row.appendChild(titleCell);
        row.appendChild(writerCell);
        row.appendChild(dateCell);

        
        
        // Add click event listener to row
        row.addEventListener('click', () => {
            var userId = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*=\s*([^;]*).*$)|^.*$/, "$1"); // Get user_id cookie value
            const postId = post.id; // Get post id
            window.location.href = '/post_board/board_view.html';
            // Send fetch request with user_id and post id as URL parameters
            fetch(`/posts/${postId}?user_id=${userId}`)
            .then(response => response.json())
            .then(postData => {
                // Handle received data
                console.log(postData);
            })
            .catch(error => console.error(error));
        });

        tbody.appendChild(row);
        }
    })
    .catch(error => console.error(error));
