/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
var baseUrl = "http://localhost:3000";
const reportForm = document.getElementById('reportForm');
const loader = document.querySelector('.loader');
const msgDiv = document.getElementById('msg-error');
const spinner = document.querySelector('.spinner');
const spin = document.querySelector('.spin');

const displayError = (message) => {
  const para = document.createElement('p');
  para.textContent = message;
  para.style.color = 'red';
  para.style.paddingBottom = '8px';
  msgDiv.appendChild(para);
};

const redirect = (reportType) => {
  if (reportType === 'red-flag') {
    window.location.href = './redFlag.html';
  } else if (reportType === 'intervention') {
    window.location.href = './intervention.html';
  }
};

const resetForm = () => {
  document.getElementById('comment').value = '';
  document.getElementById('select').value = '';
  document.getElementById('location').innerHTML = '';
  document.getElementById('location-code').innerHTML = '';
  document.getElementById('displayImages').innerHTML = '';
  document.getElementById('displayVideos').innerHTML = '';
};

let postUrl;
let imageUrl;
let videoUrl;

const postRecord = (event) => {
  event.preventDefault();
  const comment = document.getElementById('comment').value;
  const select = document.getElementById('select');
  const reportType = select.options[select.selectedIndex].value;
  const imageInput = document.querySelectorAll('.image-uploads');
  const videoInput = document.querySelectorAll('.video-uploads');
  let location = document.getElementById('location');
  const reportImages = [];
  const reportVideos = [];

  if (!(comment && comment.trim().length)) {
    return displayError('Please enter a comment');
  }

  if (reportType === 'red-flag') {
    postUrl = `${baseUrl}/api/v1/red-flags`;
  } else {
    postUrl = `${baseUrl}/api/v1/interventions`;
  }

  if (imageInput.length > 0) {
    for (let i = 0; i < imageInput.length; i++) {
      reportImages.push(imageInput[i].innerHTML);
    }
  }

  if (videoInput.length > 0) {
    for (let i = 0; i < videoInput.length; i++) {
      reportVideos.push(videoInput[i].innerHTML);
    }
  }

  if (location) {
    location = location.innerHTML;
  } else {
    return displayError('Please enter a location');
  }

  const info = {
    comment,
    reportType,
    images: reportImages,
    videos: reportVideos,
    location
  };
  const user = JSON.parse(localStorage.getItem('userToken'));
  if (!user) {
    window.location.href = './index.html';
  }
  loader.style.display = 'block';
  fetch(postUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': user.token
      },
      mode: 'cors',
      body: JSON.stringify(info)
    })
    .then(response => response.json())
    .then((data) => {
      if (data.status === 201) {
        loader.style.display = 'none';
        resetForm();
        localStorage.setItem('urlType', postUrl);
        redirect(reportType);
      } else if (data.status === 401 || data.status === 403) {
        loader.style.display = 'none';
        window.location.href = './login.html';
      } else {
        msgDiv.style.display = 'block';
        msgDiv.style.color = 'red';
        loader.style.display = 'none';
        msgDiv.innerHTML = data.error;
      }
    })
    .catch((error) => {
      throw error;
    });
};
const imageUpload = document.getElementById('image-upload');
const errMsg = document.querySelector('.image-msg');

const uploadImage = (event) => {
  spinner.style.display = 'block';
  const displayImages = document.getElementById('displayImages');
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'yftnq9xd');
  // eslint-disable-next-line no-undef
  fetch('https://api.cloudinary.com/v1_1/djdsxql5q/image/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then((data) => {
      if (typeof data.secure_url !== 'undefined') {
        imageUrl = data.secure_url;
        displayImages.innerHTML += `<li class="image-list">
        <img src=${imageUrl} height="50" width="50" id="img"><span class="del-btn">&times;</span><i class="image-uploads" style="display:none">${imageUrl}</i>

</li>`;
        spinner.style.display = 'none';
        imageUpload.value = '';
        // handleUploads();
      } else {
        spinner.style.display = 'none';
        errMsg.style.display = 'block';
        errMsg.style.color = 'red';
        errMsg.innerHTML = 'Image failed to upload';
      }
    })
    .catch((error) => {
      throw error;
    });
};
const videoUpload = document.getElementById('video-upload');
const errorMsg = document.querySelector('.video-msg');

const uploadVideo = (event) => {
  spin.style.display = 'block';
  const displayVideos = document.getElementById('displayVideos');
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'yftnq9xd');
  // eslint-disable-next-line no-undef
  fetch('https://api.cloudinary.com/v1_1/djdsxql5q/video/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then((data) => {
      if (typeof data.secure_url !== 'undefined') {
        videoUrl = data.secure_url;
        displayVideos.innerHTML += `<li class="video-list"><i class="video-uploads" style="display:none">${videoUrl}</i>
        <video src="${videoUrl}" width="240" height="180" id="video"><span class="del-btn">&times;</span>
</li>`;
        spin.style.display = 'none';
        videoUpload.value = '';
        // handleUploads();
      } else {
        spinner.style.display = 'none';
        errorMsg.style.display = 'block';
        errorMsg.style.color = 'red';
        errorMsg.innerHTML = 'Video failed to upload';
      }
    })
    .catch((error) => {
      throw error;
    });
};


imageUpload.addEventListener('change', uploadImage);
videoUpload.addEventListener('change', uploadVideo);
reportForm.addEventListener('submit', postRecord);
