var baseUrl = "http://localhost:3000";
const loader = document.querySelector('.loader');
const interventions = `${baseUrl}/api/v1/interventions`;

const getId = (record) => {
  localStorage.setItem('Id', record.id);
  localStorage.setItem('reportType', record.title);
};



window.addEventListener('load', (event) => {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem('userToken'));
  if (!user) {
    window.location.href = './login.html';
  }
  const recordItems = document.querySelector('.record-items');
  loader.style.display = 'block';

  const record = (items) => {
    if (items.length === 0) {
      recordItems.innerHTML = 'No records Yet';
      recordItems.style.textAlign = 'center';
      recordItems.style.fontSize = '32px';
      recordItems.style.font = 'bold';
    } else {
      items.forEach((item) => {
        const eachRecord = `<li class="list">
        <div class="post">
        <p class="type">Type:<span> Intervention</span></p>
      </div>
      <div id="image-frame">
      <a href="record.html" class="interventions">${imgArry(item.images.slice(0, 1))}</a>
      </div>
      <div class="comment-div"><a href="./record.html" title="intervention" class="comment" id=${item.id} onclick="getId(this)">${item.comment.slice(0, 150)}...</a>
   </div>
    </li>
    `;

        recordItems.innerHTML += eachRecord;
      });
    }
  };

  fetch(interventions, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': user.token
      },
      mode: 'cors'
    })
    .then(response => response.json())
    .then((data) => {
      if (data.status === 200) {
        const recordList = data.data[0].intervention;
        loader.style.display = 'none';
        record(recordList);
      } else {
        loader.style.display = 'none';
        window.location.href = './login.html';
      }
    }).catch((error) => {
      throw error;
    });
});
