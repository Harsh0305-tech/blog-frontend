// Login
function login() {
  const pass = document.getElementById("password").value;
  if (pass === "mypassword") { // change "mypassword" to your own password
    document.getElementById("login").style.display = "none";
    document.getElementById("blogSection").style.display = "block";
    displayBlogTitles();
  } else {
    alert("Wrong password!");
  }
}

// Utility: convert file to DataURL
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Post a blog
async function postBlog() {
  const title = document.getElementById("blogTitle").value.trim();
  const content = document.getElementById("blogContent").value.trim();
  const imageFiles = document.getElementById("imageUpload").files;
  const status = document.getElementById("status");
  status.textContent = "";

  if (!title) {
    status.textContent = "Please enter a blog title.";
    return;
  }

  const images = [];
  for (const file of imageFiles) {
    const dataURL = await fileToDataURL(file);
    images.push(dataURL);
  }

  const blog = { title, text: content, images };
  try {
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    blogs.push(blog);
    localStorage.setItem("blogs", JSON.stringify(blogs));
  } catch (err) {
    status.textContent = "Storage full or error saving blog.";
    return;
  }

  document.getElementById("blogTitle").value = "";
  document.getElementById("blogContent").value = "";
  document.getElementById("imageUpload").value = "";
  status.textContent = "Blog posted!";
  displayBlogTitles();
}

// Show only blog titles
function displayBlogTitles() {
  const blogContainer = document.getElementById("blogs");
  blogContainer.innerHTML = "";

  const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

  blogs.forEach((blog, index) => {
    const titleDiv = document.createElement("div");
    titleDiv.className = "blog-title";
    titleDiv.textContent = blog.title;
    titleDiv.onclick = () => openBlogWindow(index);
    blogContainer.appendChild(titleDiv);
  });
}

// Open blog in new popup window
function openBlogWindow(index) {
  const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
  const blog = blogs[index];

  const newWin = window.open("", "_blank", "width=700,height=600,scrollbars=yes");
  newWin.document.write(`
    <html>
    <head>
      <title>${blog.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background: url('popup-bg.jpg') no-repeat center center fixed;
          background-size: cover;
          color: #1c1c1c;
        }
        h2 {
          color: #2a1f14;
          border-bottom: 2px solid rgba(42,31,20,0.4);
          padding-bottom: 5px;
        }
        p {
          color: #1c1c1c;
          line-height: 1.6;
        }
        .images {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        img {
          max-width: 48%;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        button {
          background: #d32f2f;
          color: #fff;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 15px;
        }
        button:hover {
          background: #8b1a1a;
        }
      </style>
    </head>
    <body>
      <h2>${blog.title}</h2>
      <p>${blog.text}</p>
      <div class="images">
        ${blog.images.map(src => `<img src="${src}">`).join("")}
      </div>
      <button onclick="
        const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
        blogs.splice(${index}, 1);
        localStorage.setItem('blogs', JSON.stringify(blogs));
        window.close();
      ">Delete Blog</button>
    </body>
    </html>
  `);
}

// Delete blog (used by main window)
function deleteBlog(index) {
  const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
  blogs.splice(index, 1);
  localStorage.setItem("blogs", JSON.stringify(blogs));
  displayBlogTitles();
}