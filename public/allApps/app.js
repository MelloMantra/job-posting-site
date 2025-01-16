document.addEventListener("DOMContentLoaded", async function () {
    var data;
  
    const jobId = window.location.pathname.split('/').pop();
    try {
      const response = await fetch(`../api/company/getApplications/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        data = await response.json();
        console.log(data);
      } else {
        console.log(`Error: ${response.status} ${response.statusText}`);
        alert("Internal server error.");
      } 
    } catch (err) {
      console.error('Error querying database:', err);
    }
});