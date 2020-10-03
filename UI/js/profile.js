
var baseUrl = "http://localhost:3000";
const loader = document.querySelector('.loader');

const getId = (record) => {
  localStorage.removeItem('Id');
  localStorage.removeItem('reportType');
  localStorage.setItem('Id', record.id);
  localStorage.setItem('reportType', record.title);
};

window.addEventListener('load', (event) => {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem('userToken'));
  if (!user) {
    window.location.href = './login.html';
  }
  const userId = user.user.id;

  const urls = [
    `${baseUrl}/api/v1/users/${userId}/interventions`,
    `${baseUrl}/api/v1/users/${userId}/red-flags`
  ];


  loader.style.display = 'block';

  const promises = urls.map(url => fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': user.token
    }
  }).then(response => response.json()));
  Promise.all(promises).then((datas) => {
    console.log(datas);
    loader.style.display = 'none';

    const tablebody = document.getElementById('tablebody');

    const intervention = datas[0].data[0].interventions;
    const interventionDraft = intervention.filter(i => i.status === 'draft').length;
    const interventionUnderInvestigation = intervention.filter(i => i.status === 'under investigation').length;
    const interventionResolved = intervention.filter(i => i.status === 'resolved').length;
    const interventionRejected = intervention.filter(i => i.status === 'rejected').length;

    const redFlag = datas[1].data[0].redFlags;
    const redFlagDraft = redFlag.filter(i => i.status === 'draft').length;
    const redFlagUnderInvestigation = redFlag.filter(i => i.status === 'under investigation').length;
    const redFlagResolved = redFlag.filter(i => i.status === 'resolved').length;
    const redFlagRejected = redFlag.filter(i => i.status === 'rejected').length;

    const merge = intervention.concat(redFlag);
    console.log(merge);
    const totalRecords = merge.length;
    console.log(totalRecords);
    document.getElementById('red-flag-draft').innerHTML = redFlagDraft;
    document.getElementById('red-flag-under-investigation').innerHTML = redFlagUnderInvestigation;
    document.getElementById('red-flag-resolved').innerHTML = redFlagResolved;
    document.getElementById('red-flag-rejected').innerHTML = redFlagRejected;

    document.getElementById('intervention-draft').innerHTML = interventionDraft;
    document.getElementById('intervention-under-investigation').innerHTML = interventionUnderInvestigation;
    document.getElementById('intervention-resolved').innerHTML = interventionResolved;
    document.getElementById('intervention-rejected').innerHTML = interventionRejected;

    const sortedArray = merge.sort((a, b) => a.id - b.id);
    merge.forEach((record) => {
      const eachRecord = `
      <tr>
            <td item-data="ID">${record.id}</td>

            <td item-data="Type">${record.type}</td>
            <td item-data="Comment"><a href="./record.html" title=${record.type} class="comment" id=${record.id} onclick="getId(this)">${record.comment.slice(0, 70)}...</a></td>
            <td item-data="Status">${record.status}</td>
          </tr>

`;
      tablebody.insertAdjacentHTML('beforeend', eachRecord);
    });
  }).catch((error) => {
    throw error;
  });
});
